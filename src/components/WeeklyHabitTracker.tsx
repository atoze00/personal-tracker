import React, { useState, useEffect, useRef } from 'react';
import { type Data, type Habit, type Todo, dateKey, monday, addDays, nextColor, palette } from '../data';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
import { Icon } from './Icon';
import { HabitRow } from './HabitRow';
export function WeeklyHabitTracker({ data, change, today, week, setWeek, edit, monthly }: {
    monthly: () => void;
    data: Data;
    change: Change;
    today: Date;
    week: Date;
    setWeek: (d: Date) => void;
    edit: (h: Habit | null) => void;
}) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
    const isCurrent = dateKey(week) === dateKey(monday(today));
    const move = (id: string, offset: number) => change(d => { const list = [...d.habits]; const from = list.findIndex(h => h.id === id), to = from + offset; if (to < 0 || to >= list.length)
        return d; [list[from], list[to]] = [list[to], list[from]]; return { ...d, habits: list }; });
    return <section className="card tracker" aria-label="주간 습관 트래커"><div className="card-header"><div className="section-title"><h2>주간 습관</h2><span className="badge">{data.habits.length}</span></div><div className="week-nav"><button className="icon-button" aria-label="이전 주" onClick={() => setWeek(addDays(week, -7))}><Icon name="left"/></button><span>{shortDate(week)} – {shortDate(days[6])}</span><button className="icon-button" aria-label="다음 주" onClick={() => setWeek(addDays(week, 7))}><Icon name="right"/></button><div className="view-switch" role="group" aria-label="습관 보기"><button className="today-button active" aria-pressed={true} onClick={() => setWeek(monday(today))}>이번 주</button><button className="today-button" aria-pressed={false} onClick={monthly}>월간</button></div></div></div>
 <div className="habit-grid weekday-row"><span className="muted">작은 습관, 꾸준하게</span>{days.map((d, i) => <div key={i} className={'day ' + (dateKey(d) === dateKey(today) ? 'today' : '')}><span>{weekdays[i]}</span><b>{d.getDate()}</b></div>)}</div>
 <div className="habit-scroll">{data.habits.length === 0 ? <div className="empty">매일 이어가고 싶은 습관을 추가해보세요.</div> : data.habits.map((habit, i) => <HabitRow key={habit.id} habit={habit} days={days} today={today} checks={data.checks[habit.id] || {}} first={i === 0} last={i === data.habits.length - 1} move={n => move(habit.id, n)} edit={() => edit(habit)} toggle={day => change(d => ({ ...d, checks: { ...d.checks, [habit.id]: { ...d.checks[habit.id], [day]: !d.checks[habit.id]?.[day] } } }))}/>)}</div><div className="tracker-footer"><button className="add-habit" onClick={() => edit(null)}>＋ 습관 추가</button><span>한 칸을 눌러 오늘의 실천을 기록하세요</span></div></section>;
}
