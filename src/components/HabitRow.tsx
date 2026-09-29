import React, { useState, useEffect, useRef } from 'react';
import { type Data, type Habit, type Todo, dateKey, monday, addDays, nextColor, palette } from '../data';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
import { Icon } from './Icon';
export function HabitRow({ habit, days, today, checks, toggle, edit, move, first, last }: {
    habit: Habit;
    days: Date[];
    today: Date;
    checks: Record<string, boolean>;
    toggle: (d: string) => void;
    edit: () => void;
    move: (n: number) => void;
    first: boolean;
    last: boolean;
}) { return <div className="habit-grid habit-row"><div className="habit-label"><span className="color-dot" style={{ background: habit.color }}/><button className="habit-name" onClick={edit} title="습관 수정">{habit.name}</button><div className="row-tools"><button aria-label={`${habit.name} 위로`} disabled={first} onClick={() => move(-1)}>↑</button><button aria-label={`${habit.name} 아래로`} disabled={last} onClick={() => move(1)}>↓</button></div></div>{days.map(d => { const key = dateKey(d), checked = !!checks[key]; return <button key={key} className={'habit-cell ' + (dateKey(d) === dateKey(today) ? 'current-column' : '')} aria-label={`${habit.name} ${key}`} aria-pressed={checked} onClick={() => toggle(key)}><span className={'square ' + (checked ? 'checked' : '')} style={checked ? { background: habit.color } : undefined}>{checked && <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" fill="none" stroke="#1d2424" strokeWidth="1.5"/></svg>}</span></button>; })}</div>; }
