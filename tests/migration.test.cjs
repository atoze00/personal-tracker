const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../src/data.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const fixture = { version: 1, habits: [{ id: 'h', name: '나의 습관', color: '#a8bd9d' }], checks: { h: { '2026-09-30': true } }, todos: { '2026-09-30': [{ id: 't', text: '기존 할 일', done: true }] }, notes: [{ id: 'main', text: '기존 메모' }, { id: 'other', text: '추가 메모' }] };
function setup(failKey) {
    const values = new Map([['personal-tracker:v1', JSON.stringify(fixture)]]);
    const localStorage = { getItem: k => values.get(k) ?? null, setItem(k, value) { if (k === failKey) throw new Error('QuotaExceeded'); values.set(k, value); } };
    const context = { exports: {}, localStorage };
    vm.runInNewContext(code, context);
    return { ...context.exports, values };
}
test('migration preserves source bytes, backup and all legacy fields', () => {
    const x = setup();
    const data = x.repository.load('2026-10-01');
    assert.equal(x.values.get(x.legacyKey), JSON.stringify(fixture));
    assert.equal(x.values.get(x.backupKey), JSON.stringify(fixture));
    for (const name of ['habits', 'checks', 'todos', 'notes']) assert.equal(JSON.stringify(data[name]), JSON.stringify(fixture[name]));
    assert.equal(data.dailyRecords['2026-10-01'].note, fixture.notes[0].text);
    assert.equal(JSON.stringify(data.dailyRecords['2026-09-30'].todos), JSON.stringify(fixture.todos['2026-09-30']));
});
test('second load uses v2; edited note is not overwritten or moved to another day', () => {
    const x = setup(); const data = x.repository.load('2026-10-01');
    data.dailyRecords['2026-10-01'].note = '수정'; x.repository.save(data);
    const next = x.repository.load('2026-10-02');
    assert.equal(next.dailyRecords['2026-10-01'].note, '수정');
    assert.equal(next.dailyRecords['2026-10-02'], undefined);
});
for (const key of ['personal-tracker:backup:v1', 'personal-tracker:v2']) test(`write failure at ${key} retains original`, () => {
    const x = setup(key); assert.throws(() => x.repository.load('2026-10-01'));
    assert.equal(x.values.get(x.legacyKey), JSON.stringify(fixture)); assert.equal(x.values.has(x.key), false);
});
test('invalid v1 is never replaced with defaults', () => {
    const x = setup(); x.values.set(x.legacyKey, '{invalid');
    assert.throws(() => x.repository.load()); assert.equal(x.values.get(x.legacyKey), '{invalid'); assert.equal(x.values.has(x.key), false);
});
test('invalid v2 does not trigger remigration or replace stored data', () => {
    const x = setup(); x.values.set(x.key, '{invalid');
    assert.throws(() => x.repository.load()); assert.equal(x.values.get(x.key), '{invalid'); assert.equal(x.values.get(x.legacyKey), JSON.stringify(fixture));
});
test('existing backup is never overwritten', () => {
    const x = setup(); x.values.set(x.backupKey, 'earlier backup'); x.repository.load('2026-10-01'); assert.equal(x.values.get(x.backupKey), 'earlier backup');
});
