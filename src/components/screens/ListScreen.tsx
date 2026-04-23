import { useMapStore } from '../../store/mapStore';
import shopsData from '../../data/shops.json';
import type { Shop } from '../../types/shop';

const shops = shopsData as Shop[];
const FILTERS = ['정렬 ▾', '가격대 ▾', '거리 ▾', '영업중'];

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function isOpen(businessHours: string): boolean {
  const now = new Date();
  const hours = now.getHours() * 100 + now.getMinutes();
  const match = businessHours.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  if (!match) return false;
  const open = parseInt(match[1]) * 100 + parseInt(match[2]);
  const close = parseInt(match[3]) * 100 + parseInt(match[4]);
  return hours >= open && hours <= close;
}

const pill = (selected: boolean, soft = false): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center',
  borderRadius: 100, padding: '5px 12px',
  fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
  fontFamily: 'var(--ff-kr)', cursor: 'pointer',
  background: selected ? (soft ? 'var(--rose-light)' : 'var(--rose)') : 'var(--white)',
  color: selected ? (soft ? 'var(--rose)' : '#fff') : 'var(--ink2)',
  border: `1.5px solid ${selected ? (soft ? 'var(--rose-mid)' : 'var(--rose)') : 'var(--border)'}`,
});

export default function ListScreen() {
  const { setScreen, setShopDetailId } = useMapStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', background: '#faf6f7', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px 8px', background: 'var(--white)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
          <span onClick={() => setScreen('map')} style={{ fontSize: 18, color: 'var(--ink2)', cursor: 'pointer' }}>←</span>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 14, padding: '7px 11px',
            fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--muted)',
            boxShadow: '0 2px 8px rgba(212,99,122,0.06)',
          }}>
            <SearchIcon />
            <span>내 주변 꽃집</span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: 'var(--rose-light)',
            border: '1.5px solid var(--rose-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>⚙</div>
        </div>
        <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2 }}>
          {FILTERS.map((f, i) => (
            <span key={f} style={pill(i === 0, true)}>{f}</span>
          ))}
        </div>
      </div>

      {/* Mini map strip */}
      <div style={{
        height: 160, position: 'relative', flexShrink: 0, overflow: 'hidden',
        background: '#fce8ef',
        backgroundImage: 'linear-gradient(rgba(212,99,122,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,99,122,0.06) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}>
        <div style={{ position: 'absolute', top: '45%', left: 0, right: 0, height: 4, background: 'rgba(212,99,122,0.18)', borderRadius: 3 }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '38%', width: 4, background: 'rgba(212,99,122,0.18)', borderRadius: 3 }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '68%', width: 4, background: 'rgba(212,99,122,0.18)', borderRadius: 3 }} />

        {[{ t: '22%', l: '32%', sel: true }, { t: '44%', l: '62%', sel: false }, { t: '55%', l: '18%', sel: false }].map((p, i) => (
          <div key={i} style={{ position: 'absolute', top: p.t, left: p.l }}>
            {p.sel && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--rose)', color: '#fff',
                border: '1.5px solid var(--rose)', borderRadius: 100,
                padding: '2px 8px', fontSize: 10, fontWeight: 700,
                fontFamily: 'var(--ff-kr)', whiteSpace: 'nowrap', marginBottom: 3, zIndex: 11,
              }}>
                {shops[0]?.name}
              </div>
            )}
            <div style={{
              width: p.sel ? 24 : 18, height: p.sel ? 24 : 18,
              background: p.sel ? 'var(--rose)' : 'var(--rose-light)',
              border: p.sel ? '2px solid #fff' : '2px solid var(--rose)',
              borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
              boxShadow: '0 2px 6px rgba(212,99,122,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: p.sel ? 11 : 8 }}>🌸</span>
            </div>
          </div>
        ))}

        <div style={{
          position: 'absolute', top: '52%', left: '50%', zIndex: 5,
          width: 12, height: 12, borderRadius: 6,
          background: '#fff', border: '3px solid var(--rose)',
          boxShadow: '0 0 0 6px rgba(212,99,122,0.15)',
          transform: 'translate(-50%, -50%)',
        }} />

        <div style={{ position: 'absolute', bottom: 10, right: 12 }}>
          <span
            onClick={() => setScreen('map')}
            style={{
              display: 'inline-flex', alignItems: 'center',
              borderRadius: 100, padding: '4px 10px', fontSize: 11,
              fontFamily: 'var(--ff-kr)', cursor: 'pointer',
              background: 'var(--white)', color: 'var(--ink2)',
              border: '1.5px solid var(--border)', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            }}>전체 지도 →</span>
        </div>
      </div>

      {/* Count + view toggle */}
      <div style={{ padding: '8px 13px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 12, color: 'var(--muted)' }}>
          총 <strong style={{ color: 'var(--rose)' }}>{shops.length}</strong>개 꽃집
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['≡', '⊞'].map((icon, i) => (
            <span key={icon} style={{ ...pill(i === 1, true), padding: '3px 8px' }}>{icon}</span>
          ))}
        </div>
      </div>

      {/* Shop list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 13px 12px' }}>
        {shops.map(shop => (
          <div key={shop.id} onClick={() => setShopDetailId(shop.id)} style={{
            background: 'var(--white)', borderRadius: 16,
            border: '1.5px solid var(--border)', overflow: 'hidden', marginBottom: 10,
            cursor: 'pointer',
          }}>
            <div style={{
              height: 110, background: 'var(--rose-light)',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(212,99,122,0.07) 6px, rgba(212,99,122,0.07) 12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 3, fontSize: 28,
            }}>
              🌸<span style={{ fontSize: 10, opacity: 0.7, fontFamily: 'var(--ff-kr)' }}>꽃집 사진</span>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 14, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
                    {shop.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <div style={{ color: 'var(--rose)', fontSize: 11 }}>{'★'.repeat(5)}</div>
                    <span style={{ fontFamily: 'var(--ff-en)', fontSize: 11, color: 'var(--ink2)', fontWeight: 600 }}>{shop.rating}</span>
                    <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 11, color: 'var(--muted)' }}>({shop.reviewCount})</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 11, fontWeight: 600, color: isOpen(shop.businessHours) ? '#5aaa70' : '#cc6666' }}>
                    {isOpen(shop.businessHours) ? '● 영업중' : '● 마감'}
                  </div>
                  <div style={{ fontFamily: 'var(--ff-en)', fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                    {shop.dist} · {shop.priceRange}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 7 }}>
                {shop.tags.map(t => (
                  <span key={t} style={{ ...pill(false), padding: '2px 9px', fontSize: 11 }}>{t}</span>
                ))}
              </div>
              <button style={{
                marginTop: 9, padding: '8px 0', width: '100%',
                background: 'transparent', color: 'var(--rose)',
                border: '1.5px solid var(--rose)', borderRadius: 13,
                fontFamily: 'var(--ff-kr)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>🤖 AI로 꽃 배합하기</button>
            </div>
          </div>
        ))}
      </div>

      {/* Map toggle CTA */}
      <div style={{ padding: '8px 14px 12px', background: '#faf6f7', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={() => setScreen('map')}
          style={{
            width: '100%', padding: '12px 0',
            background: 'var(--ink)', color: '#fff', border: 'none',
            borderRadius: 13, fontFamily: 'var(--ff-kr)',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          🗺 지도로 보기
        </button>
      </div>
    </div>
  );
}
