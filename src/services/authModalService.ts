let showLoginModalCallback: (() => void) | null = null;

export function registerShowLoginModal(cb: () => void) {
    showLoginModalCallback = cb;
}

export function triggerLoginModal() {
    if (showLoginModalCallback) {
        showLoginModalCallback();
    }
}
