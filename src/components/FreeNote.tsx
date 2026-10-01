import React, { useState, useEffect, useRef } from 'react';
import { type Data, type Habit, type Todo, dateKey, monday, addDays, nextColor, palette } from '../data';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
import { Icon } from './Icon';
export function FreeNote({ text, change, selectedKey }: {
    text: string;
    selectedKey: string;
    change: Change;
}) { return <section className="card notes"><div className="card-header"><h2>메모</h2><span className="note-mark"><Icon name="edit"/></span></div><textarea aria-label="메모" placeholder="생각나는 걸 자유롭게 적어두세요." value={text} onChange={e => { const text = e.target.value; change(d => ({ ...d, dailyRecords: { ...d.dailyRecords, [selectedKey]: { todos: d.dailyRecords[selectedKey]?.todos || [], note: text } } })); }}/><div className="note-footer">{text.length.toLocaleString()}자</div></section>; }
