import type { Flower, ColorTag } from '../../types/flower';
import { useBuilderStore } from '../../store/builderStore';

interface Props {
  flower: Flower;
  onClose: () => void;
}

const COLOR_MAP: Record<ColorTag, { bg: string; text: string; label: string }> = {
  red:    { bg: '#fde8e8', text: '#c04060', label: '레드' },
  pink:   { bg: '#f7dde4', text: '#d4637a', label: '핑크' },
  white:  { bg: '#f4f0f1', text: '#9a7580', label: '화이트' },
  yellow: { bg: '#fef8e0', text: '#b08820', label: '옐로우' },
  purple: { bg: '#ede8f5', text: '#7c55b8', label: '퍼플' },
  orange: { bg: '#fef0e0', text: '#c07020', label: '오렌지' },
  blue:   { bg: '#e0eef5', text: '#3a78a8', label: '블루' },
  mixed:  { bg: '#f7dde4', text: '#d4637a', label: '혼합' },
};

const FLOWER_EMOJI: Record<string, string> = {
  'flower-01': '🌹', 'flower-02': '🌷', 'flower-03': '🌼',
  'flower-04': '🪷', 'flower-05': '💐', 'flower-06': '🌻',
  'flower-07': '🌸', 'flower-08': '💜', 'flower-09': '🤍',
  'flower-10': '🌼', 'flower-11': '🌸', 'flower-12': '💙',
  'flower-13': '🌿', 'flower-14': '💙', 'flower-15': '🌸',
};

const SEASON_KR: Record<string, string> = {
  spring: '봄', summer: '여름', autumn: '가을', winter: '겨울',
};

export default function FlowerDetailModal({ flower, onClose }: Props) {
  const addFlower = useBuilderStore(s => s.addFlower);
  const color = COLOR_MAP[flower.color];
  const emoji = FLOWER_EMOJI[flower.id] ?? '🌸';

  function handleAdd() {
    addFlower({
      flowerId: flower.id,
      name: flower.name,
      quantity: 1,
      color: flower.color,
      unitPrice: flower.priceRange.min,
    });
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(30,18,24,0.5)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 390, margin: '0 auto',
          background: 'var(--white)', borderRadius: '24px 24px 0 0',
          padding: '20px 20px 32px',
        }}
      >
        {/* Handle */}
        <div style={{ width: 38, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Flower hero */}
        <div style={{
          height: 160, borderRadius: 18, marginBottom: 18,
          background: color.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 72,
        }}>
          {emoji}
        </div>

        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
            {flower.name}
          </span>
          <span style={{ fontFamily: 'var(--ff-en)', fontSize: 13, color: 'var(--muted)', marginBottom: 3 }}>
            {flower.nameEn}
          </span>
          <span style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center',
            borderRadius: 100, padding: '3px 10px',
            background: color.bg, color: color.text,
            fontSize: 11, fontWeight: 700, fontFamily: 'var(--ff-kr)',
            border: `1.5px solid ${color.text}30`,
          }}>
            {color.label}
          </span>
        </div>

        {/* 꽃말 */}
        <div style={{
          background: 'var(--rose-light)', borderRadius: 14,
          padding: '12px 14px', marginBottom: 14,
        }}>
          <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 10, fontWeight: 500, color: 'var(--muted)', marginBottom: 4 }}>꽃말</div>
          <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
            {flower.meaning}
          </div>
        </div>

        {/* Price + Season */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{
            flex: 1, background: '#faf6f7', borderRadius: 14,
            padding: '10px 14px', border: '1.5px solid var(--border)',
          }}>
            <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 10, color: 'var(--muted)', marginBottom: 3 }}>가격대 (1개)</div>
            <div style={{ fontFamily: 'var(--ff-en)', fontSize: 14, fontWeight: 700, color: 'var(--ink2)' }}>
              ₩{flower.priceRange.min.toLocaleString()} ~ ₩{flower.priceRange.max.toLocaleString()}
            </div>
          </div>
          <div style={{
            flex: 1, background: '#faf6f7', borderRadius: 14,
            padding: '10px 14px', border: '1.5px solid var(--border)',
          }}>
            <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 10, color: 'var(--muted)', marginBottom: 5 }}>제철</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {flower.season.map(s => (
                <span key={s} style={{
                  fontFamily: 'var(--ff-kr)', fontSize: 11, fontWeight: 600,
                  color: 'var(--rose)', background: 'var(--rose-light)',
                  borderRadius: 100, padding: '1px 7px',
                }}>{SEASON_KR[s]}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%', padding: '14px 0',
            background: 'var(--rose)', color: '#fff', border: 'none',
            borderRadius: 14, fontFamily: 'var(--ff-kr)',
            fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', cursor: 'pointer',
          }}
        >
          🌸 빌더에 추가하기
        </button>
      </div>
    </div>
  );
}
