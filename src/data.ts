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
export type LegacyData = {
    version: 1;
    habits: Habit[];
    checks: Record<string, Record<string, boolean>>;
    todos: Record<string, Todo[]>;
    notes: {
        id: string;
        text: string;
    }[];
};
export const legacyKey = 'personal-tracker:v1';
export const key = 'personal-tracker:v2';
export const backupKey = 'personal-tracker:backup:v1';
export type DailyRecord = { todos: Todo[]; note: string };
export type Data = Omit<LegacyData, 'version'> & { version: 2; dailyRecords: Record<string, DailyRecord> };
export const emptyRecord = (): DailyRecord => ({ todos: [], note: '' });
export const palette = ['#a8bd9d', '#98b5cf', '#b0a1d1', '#d6b77e', '#d49788', '#87bfb3', '#cb9ebc', '#adbd79'];
export const initialHabits = ['물 2L 마시기', '스트레칭 10분', '블로그 포스팅', '저녁 금식', '운동'];
export const initialData = (): Data => ({ version: 2, dailyRecords: {}, habits: initialHabits.map((name, i) => ({ id: `habit-${i}`, name, color: palette[i] })), checks: {}, todos: {}, notes: [{ id: 'main', text: '' }] });
export const dateKey = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
export const monday = (d: Date) => { const r = addDays(d, -((d.getDay() + 6) % 7)); r.setHours(0, 0, 0, 0); return r; };
export function nextColor(habits: Habit[]) { const used = new Set(habits.map(h => h.color.toLowerCase())); const preset = palette.find(c => !used.has(c)); if (preset)
    return preset; for (let i = 0; i < 16777216; i++) {
    const c = '#' + ((0x7395ac + i * 7919) % 16777216).toString(16).padStart(6, '0');
    if (!used.has(c))
        return c;
} return '#ffffff'; }
function validateLegacy(v: unknown): v is LegacyData { if (!v || typeof v !== 'object')
    return false; const d = v as LegacyData; return d.version === 1 && Array.isArray(d.habits) && d.habits.every(h => typeof h.id === 'string' && typeof h.name === 'string' && /^#[0-9a-f]{6}$/i.test(h.color)) && !!d.checks && typeof d.checks === 'object' && Object.values(d.checks).every(r => !!r && typeof r === 'object' && Object.values(r).every(c => typeof c === 'boolean')) && !!d.todos && typeof d.todos === 'object' && Object.values(d.todos).every(a => Array.isArray(a) && a.every(t => typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean')) && Array.isArray(d.notes) && d.notes.length > 0 && d.notes.every(n => typeof n.id === 'string' && typeof n.text === 'string'); }

export function validateV2(value: unknown): value is Data {
    if (!value || typeof value !== 'object') return false;
    const d = value as Data;
    return d.version === 2 && validateLegacy({ ...d, version: 1 }) && !!d.dailyRecords && !Array.isArray(d.dailyRecords) && typeof d.dailyRecords === 'object' && Object.values(d.dailyRecords).every(r => !!r && typeof r.note === 'string' && Array.isArray(r.todos) && r.todos.every(t => !!t && typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean'));
}
export function migrateV1(legacy: LegacyData, today: string): Data {
    const copy = JSON.parse(JSON.stringify(legacy)) as LegacyData;
    const dailyRecords: Record<string, DailyRecord> = {};
    for (const [date, todos] of Object.entries(copy.todos)) dailyRecords[date] = { todos, note: '' };
    dailyRecords[today] = { ...dailyRecords[today] || emptyRecord(), note: copy.notes[0].text };
    // Retain all legacy fields too, including additional notes not shown by the old UI.
    return { ...copy, version: 2, dailyRecords };
}
export const repository = {
    load(today = dateKey(new Date())): Data {
        const current = localStorage.getItem(key);
        if (current !== null) {
            const parsed: unknown = JSON.parse(current);
            if (!validateV2(parsed)) throw new Error('새 저장 데이터를 읽지 못했습니다. 원본을 보존합니다.');
            return parsed;
        }
        const raw = localStorage.getItem(legacyKey);
        if (raw === null) return initialData();
        const legacy: unknown = JSON.parse(raw);
        if (!validateLegacy(legacy)) throw new Error('기존 저장 데이터를 읽지 못했습니다. 원본을 보존합니다.');
        const migrated = migrateV1(legacy, today);
        if (localStorage.getItem(backupKey) === null) {
            localStorage.setItem(backupKey, raw);
            if (localStorage.getItem(backupKey) !== raw) throw new Error('백업 확인 실패');
        }
        const serialized = JSON.stringify(migrated);
        // Never overwrite or remove v1. A failed write leaves the source intact.
        localStorage.setItem(key, serialized);
        if (localStorage.getItem(key) !== serialized) throw new Error('이전 데이터 저장 확인 실패');
        return migrated;
    },
    save(data: Data) {
        if (!validateV2(data)) throw new Error('올바르지 않은 저장 데이터');
        localStorage.setItem(key, JSON.stringify(data));
    }
};
