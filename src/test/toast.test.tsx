import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../context/ToastContext';

const TestComponent = () => {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Action 1: Prompt Copied', 'success')}>
        Trigger Action 1
      </button>
      <button onClick={() => showToast('Action 2: Ratio Changed', 'info')}>
        Trigger Action 2
      </button>
      <button onClick={() => showToast('Action 3: Download Error', 'error')}>
        Trigger Action 3
      </button>
    </div>
  );
};

describe('ToastContext Non-Stacking Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a single active toast on trigger', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const btn1 = screen.getByText('Trigger Action 1');
    act(() => {
      btn1.click();
    });

    expect(screen.getByText('Action 1: Prompt Copied')).toBeDefined();
  });

  it('does NOT stack multiple toasts; replaces previous toast cleanly', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const btn1 = screen.getByText('Trigger Action 1');
    const btn2 = screen.getByText('Trigger Action 2');
    const btn3 = screen.getByText('Trigger Action 3');

    // Trigger three actions in rapid succession
    act(() => {
      btn1.click();
      btn2.click();
      btn3.click();
    });

    // Only the last toast must exist in document (no stacking!)
    expect(screen.queryByText('Action 1: Prompt Copied')).toBeNull();
    expect(screen.queryByText('Action 2: Ratio Changed')).toBeNull();
    expect(screen.getByText('Action 3: Download Error')).toBeDefined();
  });

  it('auto-dismisses toast after 2.2 seconds', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const btn1 = screen.getByText('Trigger Action 1');
    act(() => {
      btn1.click();
    });

    expect(screen.getByText('Action 1: Prompt Copied')).toBeDefined();

    // Advance timers by 2250ms
    act(() => {
      vi.advanceTimersByTime(2250);
    });

    expect(screen.queryByText('Action 1: Prompt Copied')).toBeNull();
  });
});
