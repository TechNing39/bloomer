import { useCallback } from 'react';
import { logEvent, type AnalyticsEvent } from '../utils/analytics';

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent, params?: Record<string, unknown>) => {
    logEvent(event, params);
  }, []);
  return { track };
}
