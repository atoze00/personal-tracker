import React, { useState, useEffect, useRef } from 'react';
import { type Data, type Habit, type Todo, dateKey, monday, addDays, nextColor, palette } from '../data';
type Change = (fn: (d: Data) => Data) => void;
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const shortDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
const uid = () => crypto.randomUUID();
export function Icon({ name }: {
    name: 'left' | 'right' | 'edit' | 'close';
}) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'left' ? <path d="m14 6-6 6 6 6"/> : name === 'right' ? <path d="m10 6 6 6-6 6"/> : name === 'close' ? <path d="m6 6 12 12M18 6 6 18"/> : <><path d="m15 4 5 5-10 10-6 1 1-6Z"/><path d="m13 6 5 5"/></>}</svg>; }
