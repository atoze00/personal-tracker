import React, { useState, useEffect, useRef } from 'react';
import { type Data, type Habit, type Todo, dateKey, monday, addDays, nextColor, palette } from '../data';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
import { Icon } from './Icon';
export function AddHabitModal({ habit, habits, close, save, remove }: {
    habit: Habit | null;
    habits: Habit[];
    close: () => void;
    save: (name: string, color: string) => void;
    remove: () => void;
}) { const [name, setName] = useState(habit?.name || ''), [color, setColor] = useState(habit?.color || nextColor(habits)), [deleting, setDeleting] = useState(false); const dialog = useRef<HTMLDialogElement>(null); useEffect(() => { dialog.current?.showModal(); }, []); return <dialog ref={dialog} onCancel={close} onClick={e => { if (e.target === dialog.current)
    close(); }}><form onSubmit={e => { e.preventDefault(); if (name.trim())
    save(name.trim(), color); }}><div className="modal-header"><h2>{habit ? '습관 수정' : '새로운 습관'}</h2><button type="button" className="icon-button" aria-label="닫기" onClick={close}><Icon name="close"/></button></div><label htmlFor="habit-name">습관 이름</label><input id="habit-name" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="매일 실천할 작은 습관" maxLength={60}/><label htmlFor="habit-color">습관 색상 <small>처음에는 자동으로 골라드려요</small></label><div className="color-options">{palette.map(c => <button key={c} type="button" style={{ background: c }} className={color === c ? 'selected' : ''} aria-label={`색상 ${c}`} aria-pressed={color === c} onClick={() => setColor(c)}/>)}<input id="habit-color" type="color" value={color} onChange={e => setColor(e.target.value)} aria-label="사용자 지정 색상"/></div>{deleting && <p className="delete-warning">이 습관의 이전 체크 기록도 삭제됩니다.</p>}<div className="modal-actions">{habit && <button type="button" className="delete-button" onClick={() => deleting ? remove() : setDeleting(true)}>{deleting ? '기록까지 삭제' : '습관 삭제'}</button>}<button type="button" className="cancel-button" onClick={close}>취소</button><button className="primary-button" disabled={!name.trim()} type="submit">{habit ? '저장' : '추가하기'}</button></div></form></dialog>; }
