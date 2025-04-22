import { writable } from 'svelte/store';

interface ToastState {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | '';
}

const initialState: ToastState = {
    visible: false,
    message: '',
    type: '',
};

export const toastStore = writable<ToastState>(initialState);

export function showToast(message: string, type: 'success' | 'error') {
    toastStore.set({ visible: true, message, type });
    setTimeout(() => {
        hideToast();
    }, 3000); // Auto-dismiss after 3 seconds
}

export function hideToast() {
    toastStore.set(initialState);
}