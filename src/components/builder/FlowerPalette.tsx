import { useState } from 'react';
import flowersData from '../../data/flowers.json';
import type { Flower, ColorTag } from '../../types/flower';
import { useBuilderStore } from '../../store/builderStore';

const COLOR_META: Record<ColorTag | 'all', { label: string; dot: string }> = {
  all:    { label: '전체',   dot: '#d4637a' },
  red:    { label: '레드',   dot: '#c04060' },
  pink:   { label: '핑크',   dot: '#e07090' },
  white:  { label: '화이트', dot: '#c0a8b0' },
  yellow: { label: '옐로우', dot: '#c0a020' },
  purple: { label: '퍼플',   dot: '#7c55b8' },
  orange: { label: '오렌지', dot: '#c07020' },
  blue:   { label: '블루',   dot: '#3a78a8' },
  mixed:  { label: '혼합',   dot: '#d4637a' },
};

const FLOWER_EMOJI: Record<string, string> = {
  'flower-01': '🌹', 'flower-02': '🌷', 'flower-03': '🌼',
  'flower-04': '🪷', 'flower-05': '💐', 'flower-06': '🌻',
  'flower-07': '🌸', 'flower-08': '💜', 'flower-09': '🤍',
  'flower-10': '🌼', 'flower-11': '🌸', 'flower-12': '💙',
  'flower-13': '🌿', 'flower-14': '💙', 'flower-15': '🌸',
};

const flowers = flowersData as Flower[];
const COLOR_FILTERS = ['all', 'red', 'pink', 'white', 'yellow', 'purple', 'orange', 'blue', 'mixed'] as const;

export default function FlowerPalette() {
  const [activeColor, setActiveColor] = useState<'all' | ColorTag>('all');
  const { flowers: added, addFlower } = useBuilderStore();

  const addedIds = new Set(added.map(f => f.flowerId));

  const filtered = activeColor === 'all'
    ? flowers
    : flowers.filter(f => f.color === activeColor);

  function handleAdd(flower: Flower) {
    addFlower({
      flowerId: flower.id,
      name: flower.name,
      quantity: 1,
      color: flower.color,
      unitPrice: flower.priceRange.min,
    });
  }

  return (
    <div>
      {/* 색상 필터 */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
        scrollbarWidth: 'none', marginBottom: 14,
      }}>
        {COLOR_FILTERS.map(c => {
          const meta = COLOR_META[c];
          const active = activeColor === c;
          return (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 100, border: 'none',
                background: active ? 'var(--rose)' : 'var(--white)',
                color: active ? '#fff' : 'var(--ink2)',
                fontFamily: 'var(--ff-kr)', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: active ? 'none' : '0 0 0 1.5px var(--border)',
                flexShrink: 0,
              }}
            >
              {c !== 'all' && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: meta.dot, flexShrink: 0,
                }} />
              )}
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* 꽃 그리드 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
      }}>
        {filtered.map(flower => {
          const inCart = addedIds.has(flower.id);
          return (
            <button
              key={flower.id}
              onClick={() => handleAdd(flower)}
              style={{
                background: inCart ? 'var(--rose-light)' : 'var(--white)',
                border: inCart ? '2px solid var(--rose)' : '1.5px solid var(--border)',
                borderRadius: 16, padding: '12px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                cursor: 'pointer', position: 'relative',
              }}
            >
              {inCart && (
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--rose)', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✓</span>
              )}
              <span style={{ fontSize: 30 }}>{FLOWER_EMOJI[flower.id] ?? '🌸'}</span>
              <span style={{
                fontFamily: 'var(--ff-kr)', fontSize: 12, fontWeight: 700,
                color: 'var(--ink)', letterSpacing: '-0.3px',
              }}>{flower.name}</span>
              <span style={{
                fontFamily: 'var(--ff-en)', fontSize: 10, color: 'var(--muted)',
              }}>₩{flower.priceRange.min.toLocaleString()}~</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
