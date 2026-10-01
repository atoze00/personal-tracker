import React, { useState, useEffect, useRef } from 'react';
import { type Data, type Habit, type Todo, dateKey, monday, addDays, nextColor, palette } from '../data';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
import { Icon } from './Icon';
export function TodoList({ data, change, today, isToday }: {
    data: Data;
    change: Change;
    today: Date;
    isToday: boolean;
}) { const key = dateKey(today), todos = data.dailyRecords[key]?.todos || []; const [draft, setDraft] = useState(''), [editing, setEditing] = useState<string | null>(null), [value, setValue] = useState(''); const drag = useRef<string | null>(null); const update = (fn: (a: Todo[]) => Todo[]) => change(d => ({ ...d, dailyRecords: { ...d.dailyRecords, [key]: { note: d.dailyRecords[key]?.note || '', todos: fn(d.dailyRecords[key]?.todos || []) } } })); const add = (text: string) => { if (!text.trim())
    return; update(a => [...a, { id: uid(), text: text.trim(), done: false }]); setDraft(''); }; const save = (id: string) => { if (value.trim())
    update(a => a.map(t => t.id === id ? { ...t, text: value.trim() } : t)); setEditing(null); }; const move = (id: string, n: number) => update(a => { const b = [...a], i = b.findIndex(t => t.id === id), j = i + n; if (j < 0 || j >= b.length)
    return a; [b[i], b[j]] = [b[j], b[i]]; return b; }); return <section className="card todos"><div className="card-header"><h2>{isToday ? '오늘 할 일' : shortDate(today) + ' 할 일'}</h2><span className="counter"><b>{todos.filter(t => t.done).length}</b> / {todos.length} 완료</span></div><div className="todo-scroll">{!todos.length && <div className="empty todo-empty"><span className="empty-checkbox">✓</span><p>무엇을 해볼까요?</p><span>작은 할 일부터 하나씩 적어보세요.</span></div>}{todos.map((t, i) => <div className={'todo-row ' + (t.done ? 'done' : '')} key={t.id} draggable={editing !== t.id} onDragStart={() => drag.current = t.id} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const id = drag.current; if (!id || id === t.id)
    return; update(a => { const b = [...a]; const from = b.findIndex(v => v.id === id), to = b.findIndex(v => v.id === t.id); if (from < 0)
    return a; const [item] = b.splice(from, 1); b.splice(to, 0, item); return b; }); drag.current = null; }}><input type="checkbox" checked={t.done} aria-label={`${t.text} 완료`} onChange={() => update(a => a.map(v => v.id === t.id ? { ...v, done: !v.done } : v))}/>{editing === t.id ? <input className="edit-todo" autoFocus value={value} onChange={e => setValue(e.target.value)} onBlur={() => save(t.id)} onKeyDown={e => { if (e.nativeEvent.isComposing)
    return; if (e.key === 'Enter')
    save(t.id); if (e.key === 'Escape')
    setEditing(null); }}/> : <button className="todo-text" title="할 일 수정" onClick={() => { setEditing(t.id); setValue(t.text); }}>{t.text}</button>}<div className="todo-tools"><button aria-label={`${t.text} 위로`} disabled={i === 0} onClick={() => move(t.id, -1)}>↑</button><button aria-label={`${t.text} 아래로`} disabled={i === todos.length - 1} onClick={() => move(t.id, 1)}>↓</button><button aria-label={`${t.text} 삭제`} onClick={() => update(a => a.filter(v => v.id !== t.id))}><Icon name="close"/></button></div></div>)}</div><form className="todo-add" onSubmit={e => { e.preventDefault(); add(draft); }}><button type="submit" aria-label="할 일 추가" disabled={!draft.trim()}>＋</button><input aria-label="새 할 일" placeholder="할 일 추가하고 Enter" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && e.nativeEvent.isComposing)
    e.preventDefault(); }} maxLength={300}/><span>↵</span></form></section>; }
