export type Habit = {
    id: string;
    name: string;
    color: string;
};
export type Todo = {
    id: string;
    text: string;
    done: boolean;
};
export type Data = {
    version: 1;
    habits: Habit[];
    checks: Record<string, Record<string, boolean>>;
    todos: Record<string, Todo[]>;
    notes: {
        id: string;
        text: string;
    }[];
};
export const key = 'personal-tracker:v1';
export const palette = ['#a8bd9d', '#98b5cf', '#b0a1d1', '#d6b77e', '#d49788', '#87bfb3', '#cb9ebc', '#adbd79'];
export const initialHabits = ['물 2L 마시기', '스트레칭 10분', '블로그 포스팅', '저녁 금식', '운동'];
export const initialData = (): Data => ({ version: 1, habits: initialHabits.map((name, i) => ({ id: `habit-${i}`, name, color: palette[i] })), checks: {}, todos: {}, notes: [{ id: 'main', text: '' }] });
export const dateKey = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
export const monday = (d: Date) => { const r = addDays(d, -((d.getDay() + 6) % 7)); r.setHours(0, 0, 0, 0); return r; };
export function nextColor(habits: Habit[]) { const used = new Set(habits.map(h => h.color.toLowerCase())); const preset = palette.find(c => !used.has(c)); if (preset)
    return preset; for (let i = 0; i < 16777216; i++) {
    const c = '#' + ((0x7395ac + i * 7919) % 16777216).toString(16).padStart(6, '0');
    if (!used.has(c))
        return c;
} return '#ffffff'; }
function validate(v: unknown): v is Data { if (!v || typeof v !== 'object')
    return false; const d = v as Data; return d.version === 1 && Array.isArray(d.habits) && d.habits.every(h => typeof h.id === 'string' && typeof h.name === 'string' && /^#[0-9a-f]{6}$/i.test(h.color)) && !!d.checks && typeof d.checks === 'object' && Object.values(d.checks).every(r => !!r && typeof r === 'object' && Object.values(r).every(c => typeof c === 'boolean')) && !!d.todos && typeof d.todos === 'object' && Object.values(d.todos).every(a => Array.isArray(a) && a.every(t => typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean')) && Array.isArray(d.notes) && d.notes.length > 0 && d.notes.every(n => typeof n.id === 'string' && typeof n.text === 'string'); }
// Replace this adapter when moving to a database. UI data models remain independent.
export const repository = { load(): Data { const raw = localStorage.getItem(key); if (!raw)
        return initialData(); const parsed: unknown = JSON.parse(raw); if (!validate(parsed))
        throw new Error('저장된 데이터를 읽을 수 없습니다. 기존 데이터는 보존됩니다.'); return parsed; }, save(data: Data) { localStorage.setItem(key, JSON.stringify(data)); } };
