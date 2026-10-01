import React, { useEffect, useRef, useState } from 'react';
import { addDays, dateKey, monday } from '../data';
import { Icon } from './Icon';

export function DateNavigation({ selected, today, select }: { selected: Date; today: Date; select: (d: Date) => void }) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
    const close = () => { setOpen(false); trigger.current?.focus(); };
    const pick = (d: Date) => { select(d); close(); };
    const start = monday(month);
    const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
    return <>
        <nav className="date-navigation" aria-label="일일 기록 날짜">
            <button className="icon-button" aria-label="이전 날짜" onClick={() => select(addDays(selected, -1))}><Icon name="left" /></button>
            <span className="selected-date" aria-live="polite">{selected.getFullYear()}년 {selected.getMonth() + 1}월 {selected.getDate()}일 <small>{['일', '월', '화', '수', '목', '금', '토'][selected.getDay()]}</small></span>
            <button className="icon-button" aria-label="다음 날짜" onClick={() => select(addDays(selected, 1))}><Icon name="right" /></button>
            {dateKey(selected) !== dateKey(today) && <button className="today-button" onClick={() => select(today)}>오늘</button>}
            <button ref={trigger} className="icon-button calendar-trigger" aria-label="달력 열기" aria-haspopup="dialog" onClick={() => { setMonth(new Date(selected.getFullYear(), selected.getMonth(), 1)); setOpen(true); }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v5m8-5v5M4 11h16"/></svg></button>
        </nav>
        {open && <dialog ref={dialog} className="calendar-dialog" aria-label="날짜 선택 달력" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === dialog.current) close(); }}>
            <div className="calendar-header"><button className="icon-button" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><Icon name="left"/></button><h2>{month.getFullYear()}년 {month.getMonth() + 1}월</h2><button className="icon-button" aria-label="다음 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><Icon name="right"/></button><button className="icon-button" aria-label="달력 닫기" onClick={close}><Icon name="close"/></button></div>
            <div className="calendar-grid">{['월','화','수','목','금','토','일'].map(d => <span className="calendar-weekday" key={d}>{d}</span>)}{days.map(d => <button key={dateKey(d)} className={'calendar-day' + (d.getMonth() !== month.getMonth() ? ' outside' : '') + (dateKey(d) === dateKey(selected) ? ' selected' : '') + (dateKey(d) === dateKey(today) ? ' is-today' : '')} aria-label={dateKey(d)} aria-pressed={dateKey(d) === dateKey(selected)} aria-current={dateKey(d) === dateKey(today) ? 'date' : undefined} onClick={() => pick(d)}>{d.getDate()}</button>)}</div>
            <button className="today-button calendar-today" onClick={() => pick(today)}>오늘로 돌아가기</button>
        </dialog>}
    </>;
}
