import { useBuilderStore } from '../../store/builderStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { ColorTag } from '../../types/flower';

const FLOWER_EMOJI: Record<string, string> = {
  'flower-01': '🌹', 'flower-02': '🌷', 'flower-03': '🌼',
  'flower-04': '🪷', 'flower-05': '💐', 'flower-06': '🌻',
  'flower-07': '🌸', 'flower-08': '💜', 'flower-09': '🤍',
  'flower-10': '🌼', 'flower-11': '🌸', 'flower-12': '💙',
  'flower-13': '🌿', 'flower-14': '💙', 'flower-15': '🌸',
};

const COLOR_DOT: Record<ColorTag, string> = {
  red: '#c04060', pink: '#e07090', white: '#c0a8b0', yellow: '#c0a020',
  purple: '#7c55b8', orange: '#c07020', blue: '#3a78a8', mixed: '#d4637a',
};

export default function BouquetPreview() {
  const { track } = useAnalytics();
  const { flowers, updateQuantity, removeFlower } = useBuilderStore();

  if (flowers.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '28px 0',
        border: '1.5px dashed var(--border)', borderRadius: 18,
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>💐</div>
        <div style={{
          fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--muted)',
        }}>아래 팔레트에서 꽃을 골라보세요</div>
      </div>
    );
  }

  const total = flowers.reduce((sum, f) => sum + f.unitPrice * f.quantity, 0);

  return (
    <div style={{
      border: '1.5px solid var(--border)', borderRadius: 18,
      overflow: 'hidden', background: 'var(--white)',
    }}>
      {flowers.map((item, idx) => (
        <div
          key={item.flowerId}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px',
            borderBottom: idx < flowers.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <span style={{ fontSize: 24, flexShrink: 0 }}>
            {FLOWER_EMOJI[item.flowerId] ?? '🌸'}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: COLOR_DOT[item.color as ColorTag] ?? '#d4637a',
              }} />
              <span style={{
                fontFamily: 'var(--ff-kr)', fontSize: 14, fontWeight: 700,
                color: 'var(--ink)', letterSpacing: '-0.3px',
              }}>{item.name}</span>
            </div>
            <span style={{
              fontFamily: 'var(--ff-en)', fontSize: 11, color: 'var(--muted)',
            }}>₩{(item.unitPrice * item.quantity).toLocaleString()}</span>
          </div>

          {/* 수량 조절 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                if (item.quantity <= 1) { removeFlower(item.flowerId); track('flower_removed', { flowerId: item.flowerId }); }
                else { updateQuantity(item.flowerId, item.quantity - 1); track('qty_changed', { flowerId: item.flowerId, qty: item.quantity - 1 }); }
              }}
              style={qtyBtnStyle}
            >−</button>
            <span style={{
              fontFamily: 'var(--ff-en)', fontSize: 14, fontWeight: 700,
              color: 'var(--ink)', minWidth: 16, textAlign: 'center',
            }}>{item.quantity}</span>
            <button
              onClick={() => { updateQuantity(item.flowerId, item.quantity + 1); track('qty_changed', { flowerId: item.flowerId, qty: item.quantity + 1 }); }}
              style={{ ...qtyBtnStyle, background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' }}
            >+</button>
          </div>
        </div>
      ))}

      {/* 소계 */}
      <div style={{
        padding: '12px 14px', background: 'var(--rose-light)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 12, color: 'var(--muted)' }}>
          꽃 {flowers.reduce((s, f) => s + f.quantity, 0)}송이 기준 예상금액
        </span>
        <span style={{
          fontFamily: 'var(--ff-en)', fontSize: 15, fontWeight: 700, color: 'var(--rose)',
        }}>₩{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 8,
  border: '1.5px solid var(--border)',
  background: 'var(--white)', color: 'var(--ink2)',
  fontFamily: 'var(--ff-en)', fontSize: 16, fontWeight: 700,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
