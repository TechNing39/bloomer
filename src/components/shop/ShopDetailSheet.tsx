import { useState, useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import FlowerDetailModal from '../flower/FlowerDetailModal';
import shopsData from '../../data/shops.json';
import flowersData from '../../data/flowers.json';
import type { Shop } from '../../types/shop';
import type { Flower } from '../../types/flower';

const shops = shopsData as Shop[];
const flowers = flowersData as Flower[];

const FLOWER_EMOJI: Record<string, string> = {
  'flower-01': '🌹', 'flower-02': '🌷', 'flower-03': '🌼',
  'flower-04': '🪷', 'flower-05': '💐', 'flower-06': '🌻',
  'flower-07': '🌸', 'flower-08': '💜', 'flower-09': '🤍',
  'flower-10': '🌼', 'flower-11': '🌸', 'flower-12': '💙',
  'flower-13': '🌿', 'flower-14': '💙', 'flower-15': '🌸',
};

function isOpen(businessHours: string): boolean {
  const now = new Date();
  const hours = now.getHours() * 100 + now.getMinutes();
  const match = businessHours.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  if (!match) return false;
  const open = parseInt(match[1]) * 100 + parseInt(match[2]);
  const close = parseInt(match[3]) * 100 + parseInt(match[4]);
  return hours >= open && hours <= close;
}

export default function ShopDetailSheet() {
  const { shopDetailId, setShopDetailId, openBuilderWithAi } = useMapStore();
  const { track } = useAnalytics();
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);

  useEffect(() => { track('shop_detail_view', { shopId: shopDetailId ?? undefined }); }, []);

  const shop = shops.find(s => s.id === shopDetailId) ?? null;
  if (!shop) return null;

  const shopFlowers = shop.flowerIds
    .map(id => flowers.find(f => f.id === id))
    .filter((f): f is Flower => f !== undefined);

  const open = isOpen(shop.businessHours);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShopDetailId(null)}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(30,18,24,0.4)',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 390, zIndex: 110,
        background: 'var(--white)', borderRadius: '24px 24px 0 0',
        maxHeight: '85dvh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
      }}>
        {/* Handle */}
        <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
          <div style={{ width: 38, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 14px' }} />

          {/* Shop header */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
              background: 'var(--rose-light)',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(212,99,122,0.07) 6px, rgba(212,99,122,0.07) 12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            }}>🌸</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.4px' }}>
                  {shop.name}
                </span>
                <span style={{
                  fontFamily: 'var(--ff-kr)', fontSize: 11, fontWeight: 600,
                  color: open ? '#5aaa70' : '#cc6666',
                }}>
                  ● {open ? '영업중' : '마감'}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 12, color: 'var(--muted)', marginBottom: 5 }}>
                📍 {shop.dist} · {shop.businessHours}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ color: 'var(--rose)', fontSize: 11 }}>{'★'.repeat(5)}</span>
                <span style={{ fontFamily: 'var(--ff-en)', fontSize: 11, fontWeight: 700, color: 'var(--ink2)' }}>{shop.rating}</span>
                <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 11, color: 'var(--muted)' }}>({shop.reviewCount})</span>
              </div>
            </div>
            <span
              onClick={() => setShopDetailId(null)}
              style={{ fontSize: 20, color: 'var(--muted)', cursor: 'pointer', alignSelf: 'flex-start' }}
            >✕</span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            {shop.tags.map(t => (
              <span key={t} style={{
                fontFamily: 'var(--ff-kr)', fontSize: 11, fontWeight: 500,
                borderRadius: 100, padding: '3px 10px',
                background: 'var(--rose-light)', color: 'var(--rose)',
                border: '1.5px solid var(--rose-mid)',
              }}>{t}</span>
            ))}
          </div>

          {/* AI CTA */}
          <button
            onClick={() => { setShopDetailId(null); openBuilderWithAi(); }}
            style={{
            width: '100%', padding: '12px 0', marginBottom: 16,
            background: 'var(--rose)', color: '#fff', border: 'none',
            borderRadius: 13, fontFamily: 'var(--ff-kr)',
            fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px', cursor: 'pointer',
          }}>
            🤖 AI 꽃 배합 시작하기
          </button>

          {/* Section title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
              보유 꽃 <span style={{ color: 'var(--rose)' }}>{shopFlowers.length}</span>종
            </span>
            <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 11, color: 'var(--muted)' }}>탭해서 상세보기</span>
          </div>
        </div>

        {/* Flower grid — scrollable */}
        <div style={{ overflowY: 'auto', padding: '0 20px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {shopFlowers.map(flower => (
              <div
                key={flower.id}
                onClick={() => { setSelectedFlower(flower); track('flower_card_click', { flowerId: flower.id }); }}
                style={{
                  background: 'var(--white)', borderRadius: 14,
                  border: '1.5px solid var(--border)', overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  height: 90, background: 'var(--rose-light)',
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(212,99,122,0.07) 6px, rgba(212,99,122,0.07) 12px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36,
                }}>
                  {FLOWER_EMOJI[flower.id] ?? '🌸'}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>
                    {flower.name}
                  </div>
                  <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                    {flower.meaning}
                  </div>
                  <div style={{ fontFamily: 'var(--ff-en)', fontSize: 11, fontWeight: 600, color: 'var(--rose)' }}>
                    ₩{flower.priceRange.min.toLocaleString()}~
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* S-03 Flower detail modal */}
      {selectedFlower && (
        <FlowerDetailModal
          flower={selectedFlower}
          onClose={() => setSelectedFlower(null)}
        />
      )}
    </>
  );
}
