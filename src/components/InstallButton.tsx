import React, { useSyncExternalStore } from 'react';

type InstallController = {
    subscribe: (listener: () => void) => () => void;
    isReady: () => boolean;
    prompt: () => Promise<void>;
};
declare global {
    interface Window { trackerInstall?: InstallController }
}
const unavailable = () => false;
const noSubscription = () => () => {};

export function InstallButton() {
    const controller = window.trackerInstall;
    const ready = useSyncExternalStore(controller?.subscribe ?? noSubscription, controller?.isReady ?? unavailable, unavailable);
    if (!ready || !controller) return null;
    return <button className="text-button" onClick={() => { void controller.prompt(); }}>앱 설치</button>;
}
