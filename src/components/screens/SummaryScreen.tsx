import { useState, useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { useBuilderStore } from '../../store/builderStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import shopsData from '../../data/shops.json';
import type { Shop } from '../../types/shop';

const shops = shopsData as Shop[];

const WRAP_LABELS: Record<string, string> = { basic: '기본 포장', ribbon: '리본 포장', premium: '프리미엄 포장' };
const WRAP_EXTRA: Record<string, number> = { basic: 0, ribbon: 2000, premium: 5000 };

const FLOWER_EMOJI: Record<string, string> = {
  'flower-01': '🌹', 'flower-02': '🌷', 'flower-03': '🌼',
  'flower-04': '🪷', 'flower-05': '💐', 'flower-06': '🌻',
  'flower-07': '🌸', 'flower-08': '💜', 'flower-09': '🤍',
  'flower-10': '🌼', 'flower-11': '🌸', 'flower-12': '💙',
  'flower-13': '🌿', 'flower-14': '💙', 'flower-15': '🌸',
};

export default function SummaryScreen() {
  const setScreen = useMapStore(s => s.setScreen);
  const selectedShopId = useMapStore(s => s.selectedShopId);
  const { flowers, wrapOption, reset } = useBuilderStore();
  const [memo, setMemo] = useState('');

  const { track } = useAnalytics();
  const shop = shops.find(s => s.id === selectedShopId) ?? shops[0];
  const flowerTotal = flowers.reduce((sum, f) => sum + f.unitPrice * f.quantity, 0);

  useEffect(() => { track('summary_view', { shopId: shop.id, total }); }, []);
  const wrapCost = WRAP_EXTRA[wrapOption] ?? 0;
  const total = flowerTotal + wrapCost;

  function handleCall() {
    track('call_click', { shopId: shop.id });
    window.location.href = `tel:${shop.phone}`;
  }

  function handleMapLink() {
    track('map_click', { shopId: shop.id });
    window.open(
      `https://map.kakao.com/link/to/${encodeURIComponent(shop.name)},${shop.lat},${shop.lng}`,
      '_blank'
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', background: '#faf6f7' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px 12px', background: 'var(--white)',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <button
          onClick={() => setScreen('builder')}
          style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid var(--border)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18, color: 'var(--ink2)',
          }}
        >←</button>
        <div style={{
          fontFamily: 'var(--ff-kr)', fontSize: 17, fontWeight: 700,
          color: 'var(--ink)', letterSpacing: '-0.5px',
        }}>꽃다발 요약</div>
      </div>

      {/* 스크롤 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>

        {/* 꽃집 정보 카드 */}
        <div style={{
          background: 'var(--white)', borderRadius: 16,
          border: '1.5px solid var(--border)', padding: 16, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13, flexShrink: 0,
            background: 'var(--rose-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>🌸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
              {shop.name}
            </div>
            <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              📍 {shop.dist} · {shop.businessHours}
            </div>
          </div>
        </div>

        {/* 꽃 목록 */}
        <div style={{
          background: 'var(--white)', borderRadius: 16,
          border: '1.5px solid var(--border)', padding: 16, marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'var(--ff-kr)', fontSize: 13, fontWeight: 700,
            color: 'var(--muted)', marginBottom: 14,
          }}>선택한 꽃</div>

          {flowers.map(f => (
            <div key={f.flowerId} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingBottom: 12, marginBottom: 12,
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'var(--rose-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {FLOWER_EMOJI[f.flowerId] ?? '🌸'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
                  {f.name}
                </div>
                <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {f.quantity}송이 · ₩{f.unitPrice.toLocaleString()}/송이
                </div>
              </div>
              <div style={{ fontFamily: 'var(--ff-en)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                ₩{(f.unitPrice * f.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          {/* 포장 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--ink2)' }}>
              {WRAP_LABELS[wrapOption]}
            </span>
            <span style={{ fontFamily: 'var(--ff-en)', fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>
              {wrapCost === 0 ? '무료' : `+₩${wrapCost.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* 합계 */}
        <div style={{
          background: 'var(--rose-light)', borderRadius: 16,
          border: '1.5px solid var(--rose-mid)', padding: '14px 16px', marginBottom: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 14, fontWeight: 700, color: 'var(--rose)' }}>
            예상 합계
          </span>
          <span style={{ fontFamily: 'var(--ff-en)', fontSize: 22, fontWeight: 700, color: 'var(--rose)' }}>
            ₩{total.toLocaleString()}
          </span>
        </div>

        {/* 메모 */}
        <div style={{
          background: 'var(--white)', borderRadius: 16,
          border: '1.5px solid var(--border)', padding: 16, marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'var(--ff-kr)', fontSize: 13, fontWeight: 700,
            color: 'var(--muted)', marginBottom: 10,
          }}>꽃집에 전달할 메모</div>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="예: 리본 핑크색으로 해주세요, 카드에 '생일 축하해'라고 적어주세요"
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              border: '1.5px solid var(--border)', background: '#faf6f7',
              fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--ink)',
              resize: 'none', boxSizing: 'border-box', outline: 'none', lineHeight: 1.6,
            }}
          />
        </div>

        <div style={{ height: 100 }} />
      </div>

      {/* 하단 CTA */}
      <div style={{
        padding: '12px 20px 24px', background: 'var(--white)',
        borderTop: '1px solid var(--border)', flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* 전화 + 길찾기 나란히 */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleCall}
            style={{
              flex: 1, padding: '14px 0',
              background: 'var(--rose)', color: '#fff',
              border: 'none', borderRadius: 16,
              fontFamily: 'var(--ff-kr)', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
            }}
          >📞 전화 연결</button>
          <button
            onClick={handleMapLink}
            style={{
              flex: 1, padding: '14px 0',
              background: 'var(--ink)', color: '#fff',
              border: 'none', borderRadius: 16,
              fontFamily: 'var(--ff-kr)', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
            }}
          >🗺 길찾기</button>
        </div>
        <button
          onClick={() => { reset(); setScreen('map'); }}
          style={{
            width: '100%', padding: '11px 0',
            background: 'transparent', color: 'var(--muted)',
            border: '1.5px solid var(--border)', borderRadius: 16,
            fontFamily: 'var(--ff-kr)', fontSize: 14, cursor: 'pointer',
          }}
        >처음부터 다시</button>
      </div>
    </div>
  );
}
