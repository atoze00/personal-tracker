import React from 'react';
import { type Data, dateKey } from '../data';
import { Icon } from './Icon';

export function MonthlyHabitTracker({ data, change, today, month, setMonth, weekly }: {
    data: Data;
    change: (fn: (d: Data) => Data) => void;
    today: Date;
    month: Date;
    setMonth: (date: Date) => void;
    weekly: () => void;
}) {
    const year = month.getFullYear(), index = month.getMonth();
    const count = new Date(year, index + 1, 0).getDate();
    const offset = (new Date(year, index, 1).getDay() + 6) % 7;
    const days = Array.from({ length: count }, (_, i) => new Date(year, index, i + 1));
    const isCurrent = year === today.getFullYear() && index === today.getMonth();
    return <section className="monthly-view" aria-label="월간 습관 트래커">
        <div className="card monthly-heading"><div className="section-title"><h2>월간 습관</h2><span className="badge">{data.habits.length}</span></div><div className="view-switch" role="group" aria-label="습관 보기"><button className="today-button" aria-pressed={false} onClick={weekly}>이번 주</button><button className="today-button active" aria-pressed={true}>월간</button></div></div>
        <div className="month-nav"><button className="icon-button" aria-label="이전 달" onClick={() => setMonth(new Date(year, index - 1, 1))}><Icon name="left"/></button><span aria-live="polite">{year}년 {index + 1}월</span><button className="icon-button" aria-label="다음 달" onClick={() => setMonth(new Date(year, index + 1, 1))}><Icon name="right"/></button><button className="today-button" disabled={isCurrent} onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>이번 달</button></div>
        <div className="monthly-cards">{data.habits.length === 0 && <div className="card empty">이번 주 보기에서 습관을 추가해보세요.</div>}{data.habits.map(habit => {
            const checks = data.checks[habit.id] || {};
            const done = days.filter(d => checks[dateKey(d)]).length;
            return <article key={habit.id} className="card monthly-card" aria-label={`${habit.name} 월간 기록`}>
                <div className="monthly-card-title"><h3><span className="color-dot" style={{ background: habit.color }}/>{habit.name}</h3><span className="monthly-count">{done} / {count}일 · {Math.round(done / count * 100)}%</span></div>
                <div className="month-grid">{['월','화','수','목','금','토','일'].map(d => <span className="month-weekday" key={d}>{d}</span>)}{Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} aria-hidden="true"/>)}{days.map(d => {
                    const key = dateKey(d), checked = !!checks[key];
                    return <button key={key} className={'month-cell' + (dateKey(today) === key ? ' month-today' : '')} aria-label={`${habit.name} ${key}`} title={`${key} · ${checked ? '완료' : '미완료'}`} aria-pressed={checked} aria-current={dateKey(today) === key ? 'date' : undefined} onClick={() => change(current => ({ ...current, checks: { ...current.checks, [habit.id]: { ...current.checks[habit.id], [key]: !current.checks[habit.id]?.[key] } } }))}><span className={'square' + (checked ? ' checked' : '')} style={checked ? { background: habit.color } : undefined}/></button>;
                })}</div>
            </article>;
        })}</div>
    </section>;
}
