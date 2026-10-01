import React, { useEffect, useState } from 'react';

const themeKey = 'personal-tracker:theme';
type Theme = 'dark' | 'light';
const readTheme = (): Theme => {
    try { return localStorage.getItem(themeKey) === 'light' ? 'light' : 'dark'; }
    catch { return 'dark'; }
};

export function ThemeSwitch() {
    const [theme, setTheme] = useState<Theme>(readTheme);
    const [saveError, setSaveError] = useState(false);
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f5f3' : '#151719');
    }, [theme]);
    useEffect(() => {
        const sync = (e: StorageEvent) => { if (e.key === themeKey) { setTheme(readTheme()); setSaveError(false); } };
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);
    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        try { localStorage.setItem(themeKey, next); setSaveError(false); }
        catch { setSaveError(true); }
    };
    return <div className="theme-control">
        <svg className={'theme-symbol ' + (theme === 'light' ? 'active' : '')} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
        <button className="theme-switch" role="switch" aria-label="다크 모드" aria-checked={theme === 'dark'} title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'} onClick={toggle}><span/></button>
        <svg className={'theme-symbol ' + (theme === 'dark' ? 'active' : '')} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/></svg>
        {saveError && <span className="theme-error" role="status">테마를 저장하지 못했습니다.</span>}
    </div>;
}
