import { MonthlyHabitTracker } from './components/MonthlyHabitTracker';
import { ThemeSwitch } from './components/ThemeSwitch';
import { DateNavigation } from './components/DateNavigation';
import { WeeklyHabitTracker } from './components/WeeklyHabitTracker';
import { TodoList } from './components/TodoList';
import { FreeNote } from './components/FreeNote';
import { AddHabitModal } from './components/AddHabitModal';
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { type Data, type Habit, type Todo, repository, key, validateV2, initialData, dateKey, monday, addDays, nextColor, palette } from './data';
import './style.css';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
const lockMessage = '저장 데이터를 안전하게 불러오지 못했어요. 데이터 보호를 위해 편집을 잠시 중단합니다. 앱을 새로고침하거나 다시 실행해주세요.';
// Read-only: never migrate or initialize storage during a live synchronization.
function readCurrent(allowMissing: boolean): { raw: string | null; data: Data | null } {
    const raw = localStorage.getItem(key);
    if (raw === null) {
        if (!allowMissing) throw new Error('Stored data disappeared');
        return { raw, data: null };
    }
    const data: unknown = JSON.parse(raw);
    if (!validateV2(data)) throw new Error('Invalid stored data');
    return { raw, data };
}
function App() {
    const [loaded] = useState(() => { try {
        const data = repository.load();
        const current = readCurrent(true);
        return { data: current.data ?? data, raw: current.raw, error: '' };
    } catch {
        return { data: initialData(), raw: null, error: lockMessage };
    } });
    const [data, setData] = useState(loaded.data), [error, setError] = useState(loaded.error), [saved, setSaved] = useState(true), [today, setToday] = useState(() => new Date()), [week, setWeek] = useState(() => monday(new Date())), [editing, setEditing] = useState<Habit | null | undefined>(undefined), [install, setInstall] = useState<any>(null);
    const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
    const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [selected, setSelected] = useState(() => new Date());
    const selectedKey = dateKey(selected);
    const selectDate = (date: Date) => { setSelected(date); setWeek(monday(date)); };
    const dataRef = useRef(data);
    dataRef.current = data;
    const [locked, setLocked] = useState(!!loaded.error);
    const lockRef = useRef(!!loaded.error);
    const editEpoch = useRef(0);
    const snapshotRef = useRef(loaded.raw);
    const lockEditing = () => {
        editEpoch.current += 1;
        lockRef.current = true; // Synchronous guard also blocks already queued handlers.
        setLocked(true);
        setError(lockMessage);
        setEditing(undefined);
    };
    const acceptCurrent = (current: { raw: string | null; data: Data | null }) => {
        editEpoch.current += 1;
        snapshotRef.current = current.raw;
        if (current.data) { dataRef.current = current.data; setData(current.data); }
        lockRef.current = false;
        setLocked(false);
        setError('');
        setSaved(true);
    };
    const change: Change = fn => {
        if (lockRef.current) return;
        try {
            const current = readCurrent(snapshotRef.current === null);
            if (current.raw !== snapshotRef.current) {
                acceptCurrent(current);
                setEditing(undefined);
                setError('다른 창의 최신 기록을 불러왔어요. 내용을 확인한 뒤 다시 수정해주세요.');
                return;
            }
        } catch { lockEditing(); return; }
        const next = fn(dataRef.current);
        dataRef.current = next;
        setData(next); // Controlled inputs must update synchronously while a write lock is pending.
        const epoch = editEpoch.current;
        const commit = () => {
            if (lockRef.current || epoch !== editEpoch.current) return;
            let current: ReturnType<typeof readCurrent>;
            try { current = readCurrent(snapshotRef.current === null); }
            catch { lockEditing(); return; }
            if (current.raw !== snapshotRef.current) {
                // No timestamps/schema changes: compare the exact snapshot and reject stale edits.
                acceptCurrent(current);
                setEditing(undefined);
                setError('다른 창의 최신 기록을 불러왔어요. 내용을 확인한 뒤 다시 수정해주세요.');
                return;
            }
            try {
                repository.save(next);
                snapshotRef.current = JSON.stringify(next);
                setError('');
                setSaved(true);
            } catch {
                setError('저장 공간을 확인해주세요. 변경 내용이 아직 저장되지 않았습니다.');
                setSaved(false);
            }
        };
        // Serialize cooperating tabs without adding keys or changing persisted data.
        if (navigator.locks) void navigator.locks.request('personal-tracker:write', commit).catch(lockEditing);
        else commit();
    };
    useEffect(() => { let previous = dateKey(new Date()); const check = () => { const now = new Date(); if (dateKey(now) !== previous) {
        const oldDay = previous;
        setSelected(d => dateKey(d) === oldDay ? now : d);
        setWeek(w => dateKey(w) === dateKey(monday(new Date(previous + 'T12:00:00'))) ? monday(now) : w);
        previous = dateKey(now);
        setToday(now);
    } }; const t = setInterval(check, 15000); window.addEventListener('focus', check); const prompt = (e: Event) => { e.preventDefault(); setInstall(e); }; window.addEventListener('beforeinstallprompt', prompt); return () => { clearInterval(t); window.removeEventListener('focus', check); window.removeEventListener('beforeinstallprompt', prompt); }; }, []);
    useEffect(() => {
        const refresh = () => {
            try {
                const current = readCurrent(snapshotRef.current === null && !lockRef.current);
                if (current.raw !== snapshotRef.current || lockRef.current) acceptCurrent(current);
            } catch { lockEditing(); }
        };
        const sync = (e: StorageEvent) => { if (e.key === key || e.key === null) refresh(); };
        window.addEventListener('storage', sync);
        window.addEventListener('focus', refresh);
        return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', refresh); };
    }, []);
    return <main className={'shell' + (view === 'monthly' ? ' monthly-shell' : '')}><header className="app-header"><div className="brand"><span className="brand-mark"><i /><i /><i /><i /></span><h1>개인 트래커</h1></div><div className="header-right">{install && <button className="text-button" onClick={async () => { await install.prompt(); setInstall(null); }}>앱 설치</button>}<span>{today.getFullYear()}.{String(today.getMonth() + 1).padStart(2, '0')}.{String(today.getDate()).padStart(2, '0')} <b>{weekdays[(today.getDay() + 6) % 7]}요일</b></span><span inert={locked || undefined}><ThemeSwitch/></span></div></header>
 {error && <div className="error" role="alert">{error}{!locked && <button onClick={() => change(d => ({ ...d }))}>다시 저장</button>}</div>}
 <div className={'dashboard' + (view === 'monthly' ? ' monthly-dashboard' : '')} inert={locked || undefined}>{view === 'monthly' && <MonthlyHabitTracker data={data} change={change} today={today} month={month} setMonth={setMonth} weekly={() => { setView('weekly'); setWeek(monday(today)); }}/>}<div className="weekly-view" hidden={view !== 'weekly'}><WeeklyHabitTracker data={data} change={change} today={today} week={week} setWeek={setWeek} edit={setEditing} monthly={() => setView('monthly')}/><DateNavigation selected={selected} today={today} select={selectDate}/><div className="bottom"><TodoList key={selectedKey} data={data} change={change} today={selected} isToday={selectedKey === dateKey(today)}/><FreeNote text={data.dailyRecords[selectedKey]?.note || ''} change={change} selectedKey={selectedKey}/></div></div></div>
 <footer><span>나의 하루, 한 칸씩.</span><span className="save-status" role="status"><span className={saved ? 'saved-dot' : 'unsaved-dot'}/>{saved ? '이 기기에 자동 저장' : '저장되지 않음'}</span></footer>
 {!locked && editing !== undefined && <AddHabitModal habit={editing} habits={data.habits} close={() => setEditing(undefined)} save={(name, color) => { change(d => ({ ...d, habits: editing ? d.habits.map(h => h.id === editing.id ? { ...h, name, color } : h) : [...d.habits, { id: uid(), name, color }] })); setEditing(undefined); }} remove={() => { if (!editing)
        return; change(d => ({ ...d, habits: d.habits.filter(h => h.id !== editing.id), checks: Object.fromEntries(Object.entries(d.checks).filter(([id]) => id !== editing.id)) })); setEditing(undefined); }}/>}</main>;
}
createRoot(document.getElementById('root')!).render(<App />);
if ('serviceWorker' in navigator && !import.meta.url.includes(':5173/src/'))
    window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => { }); });
