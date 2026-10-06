import { useState, useEffect } from 'react';

export interface DevicePerformanceProfile {
  isLowEnd: boolean;
  isDataSaver: boolean;
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
  allowVideoHoverPreview: boolean;
  recommendedPageSize: number;
  imageQuality: 'low' | 'medium' | 'high';
}

export function useDevicePerformance(): DevicePerformanceProfile {
  const [profile, setProfile] = useState<DevicePerformanceProfile>(() => {
    if (typeof window === 'undefined') {
      return {
        isLowEnd: false,
        isDataSaver: false,
        isTouchDevice: false,
        prefersReducedMotion: false,
        allowVideoHoverPreview: true,
        recommendedPageSize: 12,
        imageQuality: 'high',
      };
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const isLowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const isLowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
    const isDataSaver = Boolean(nav.connection?.saveData);
    const isSlowNetwork =
      nav.connection?.effectiveType === '2g' || nav.connection?.effectiveType === '3g';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || nav.maxTouchPoints > 0;

    const isLowEnd = isLowMemory || isLowCpu || isDataSaver || isSlowNetwork;

    return {
      isLowEnd,
      isDataSaver,
      isTouchDevice,
      prefersReducedMotion,
      allowVideoHoverPreview: !isTouchDevice && !isLowEnd,
      recommendedPageSize: isLowEnd ? 8 : 12,
      imageQuality: isLowEnd ? 'low' : 'high',
    };
  });

  useEffect(() => {
    const root = document.documentElement;
    if (profile.isLowEnd || profile.prefersReducedMotion) {
      root.classList.add('low-perf');
    } else {
      root.classList.remove('low-perf');
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setProfile((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
      }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [profile.isLowEnd, profile.prefersReducedMotion]);

  return profile;
}
