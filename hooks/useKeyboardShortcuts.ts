'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUILayout } from '@/contexts/UILayoutContext';

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { toggleSidebar, openSidebar, closeSidebar } = useUILayout();

  const shortcuts: ShortcutHandler[] = [
    // Navigation shortcuts
    { key: 'h', ctrl: true, handler: () => router.push('/individual-dashboard'), description: 'Go to Dashboard' },
    { key: 'o', ctrl: true, handler: () => router.push('/opportunities'), description: 'Go to Opportunities' },
    { key: 's', ctrl: true, handler: () => router.push('/skills'), description: 'Go to Skills' },
    { key: 'p', ctrl: true, handler: () => router.push('/portfolio'), description: 'Go to Portfolio' },
    { key: 'i', ctrl: true, handler: () => router.push('/insights'), description: 'Go to Insights' },
    
    // UI shortcuts
    { key: 'b', ctrl: true, handler: toggleSidebar, description: 'Toggle sidebar' },
    { key: '/', ctrl: true, handler: () => window.dispatchEvent(new Event('openGlobalSearch')), description: 'Open global search' },
    { key: 'k', ctrl: true, handler: () => window.dispatchEvent(new Event('openGlobalSearch')), description: 'Open global search' },
    { key: 'Escape', handler: closeSidebar, description: 'Close sidebar' },
    
    // Action shortcuts
    { key: 'n', ctrl: true, handler: () => window.dispatchEvent(new Event('openNotifications')), description: 'Open notifications' },
    { key: 'm', ctrl: true, handler: () => window.dispatchEvent(new Event('openMessages')), description: 'Open messages' },
    { key: 'v', ctrl: true, handler: () => router.push('/verification'), description: 'Go to Verification' },
    
    // Help
    { key: '?', shift: true, handler: () => showShortcutsHelp(), description: 'Show shortcuts help' }
  ];

  const showShortcutsHelp = useCallback(() => {
    const helpContent = shortcuts
      .map(s => {
        const keys = [];
        if (s.ctrl) keys.push('Ctrl');
        if (s.shift) keys.push('Shift');
        if (s.alt) keys.push('Alt');
        keys.push(s.key);
        return `${keys.join(' + ')} - ${s.description}`;
      })
      .join('\n');
    
    alert(`Keyboard Shortcuts:\n\n${helpContent}`);
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !shortcut.ctrl || event.ctrlKey || event.metaKey;
      const shiftMatch = !shortcut.shift || event.shiftKey;
      const altMatch = !shortcut.alt || event.altKey;
      
      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.handler();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts, showShortcutsHelp };
}