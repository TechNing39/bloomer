export type AnalyticsEvent =
  | 'map_open'
  | 'marker_click'
  | 'list_item_click'
  | 'search_keyword'
  | 'shop_detail_view'
  | 'flower_card_click'
  | 'builder_cta_click'
  | 'flower_added'
  | 'flower_removed'
  | 'qty_changed'
  | 'wrap_option_selected'
  | 'summary_view'
  | 'call_click'
  | 'map_click'
  | 'save_bouquet';

export function logEvent(event: AnalyticsEvent, params?: Record<string, unknown>) {
  const payload = { event, ts: Date.now(), ...params };
  const stored = JSON.parse(localStorage.getItem('bloomer_analytics') ?? '[]');
  stored.push(payload);
  localStorage.setItem('bloomer_analytics', JSON.stringify(stored.slice(-200)));
  if (import.meta.env.DEV) {
    console.info('[analytics]', event, params ?? '');
  }
}
