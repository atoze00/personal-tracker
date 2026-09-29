import { WeeklyHabitTracker } from './components/WeeklyHabitTracker';
import { TodoList } from './components/TodoList';
import { FreeNote } from './components/FreeNote';
import { AddHabitModal } from './components/AddHabitModal';
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { type Data, type Habit, type Todo, repository, initialData, dateKey, monday, addDays, nextColor, palette } from './data';
import './style.css';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
function App() {
    const [loaded] = useState(() => { try {
        return { data: repository.load(), error: '' };
    }
    catch {
        return { data: initialData(), error: '저장 데이터를 읽지 못했습니다. 기존 데이터 보호를 위해 편집을 잠시 중지합니다.' };
    } });
    const [data, setData] = useState(loaded.data), [error, setError] = useState(loaded.error), [saved, setSaved] = useState(true), [today, setToday] = useState(() => new Date()), [week, setWeek] = useState(() => monday(new Date())), [editing, setEditing] = useState<Habit | null | undefined>(undefined), [install, setInstall] = useState<any>(null);
    const dataRef = useRef(data);
    dataRef.current = data;
    const change: Change = fn => { if (loaded.error)
        return; const next = fn(dataRef.current); dataRef.current = next; setData(next); try {
        repository.save(next);
        setError('');
        setSaved(true);
    }
    catch {
        setError('저장 공간을 확인해주세요. 변경 내용이 아직 저장되지 않았습니다.');
        setSaved(false);
    } };
    useEffect(() => { let previous = dateKey(new Date()); const check = () => { const now = new Date(); if (dateKey(now) !== previous) {
        setWeek(w => dateKey(w) === dateKey(monday(new Date(previous + 'T12:00:00'))) ? monday(now) : w);
        previous = dateKey(now);
        setToday(now);
    } }; const t = setInterval(check, 15000); window.addEventListener('focus', check); const prompt = (e: Event) => { e.preventDefault(); setInstall(e); }; window.addEventListener('beforeinstallprompt', prompt); return () => { clearInterval(t); window.removeEventListener('focus', check); window.removeEventListener('beforeinstallprompt', prompt); }; }, []);
    useEffect(() => { const sync = (e: StorageEvent) => { if (e.key === 'personal-tracker:v1') {
        try {
            const next = repository.load();
            dataRef.current = next;
            setData(next);
        }
        catch {
            setError('다른 창의 저장 내용을 읽지 못했습니다.');
        }
    } }; window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync); }, []);
    return <main className="shell"><header className="app-header"><div className="brand"><span className="brand-mark"><i /><i /><i /><i /></span><h1>개인 트래커</h1></div><div className="header-right">{install && <button className="text-button" onClick={async () => { await install.prompt(); setInstall(null); }}>앱 설치</button>}<span>{today.getFullYear()}.{String(today.getMonth() + 1).padStart(2, '0')}.{String(today.getDate()).padStart(2, '0')} <b>{weekdays[(today.getDay() + 6) % 7]}요일</b></span></div></header>
 {error && <div className="error" role="alert">{error}{!loaded.error && <button onClick={() => change(d => ({ ...d }))}>다시 저장</button>}</div>}
 <div className="dashboard" inert={!!loaded.error || undefined}><WeeklyHabitTracker data={data} change={change} today={today} week={week} setWeek={setWeek} edit={setEditing}/><div className="bottom"><TodoList data={data} change={change} today={today}/><FreeNote text={data.notes[0].text} change={change}/></div></div>
 <footer><span>나의 하루, 한 칸씩.</span><span className="save-status" role="status"><span className={saved ? 'saved-dot' : 'unsaved-dot'}/>{saved ? '이 기기에 자동 저장' : '저장되지 않음'}</span></footer>
 {editing !== undefined && <AddHabitModal habit={editing} habits={data.habits} close={() => setEditing(undefined)} save={(name, color) => { change(d => ({ ...d, habits: editing ? d.habits.map(h => h.id === editing.id ? { ...h, name, color } : h) : [...d.habits, { id: uid(), name, color }] })); setEditing(undefined); }} remove={() => { if (!editing)
        return; change(d => ({ ...d, habits: d.habits.filter(h => h.id !== editing.id), checks: Object.fromEntries(Object.entries(d.checks).filter(([id]) => id !== editing.id)) })); setEditing(undefined); }}/>}</main>;
}
createRoot(document.getElementById('root')!).render(<App />);
if ('serviceWorker' in navigator && !import.meta.url.includes(':5173/src/'))
    window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => { }); });
