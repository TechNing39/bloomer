import { useState } from 'react';
import { useMapStore } from '../../store/mapStore';
import shopsData from '../../data/shops.json';

const totalShops = shopsData.length;

const FLOWERS = ['🌹 장미', '🌷 튤립', '🌼 국화', '💐 부케', '🌸 계절꽃', '🪷 수국'];
const OCCASIONS = ['💍 웨딩', '🎂 생일', '🏠 인테리어', '🎁 선물'];
const DISTANCES = ['500m', '1km', '2km', '5km'];
const BUDGETS = ['~3만원', '3~7만원', '7만원~'];
const RECENTS = ['장미 꽃다발', '강남 꽃집', '웨딩 부케'];

const pill = (selected: boolean, soft = false): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 100, padding: '5px 12px',
  fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
  fontFamily: 'var(--ff-kr)', cursor: 'pointer',
  background: selected ? (soft ? 'var(--rose-light)' : 'var(--rose)') : 'var(--white)',
  color: selected ? (soft ? 'var(--rose)' : '#fff') : 'var(--ink2)',
  border: `1.5px solid ${selected ? (soft ? 'var(--rose-mid)' : 'var(--rose)') : 'var(--border)'}`,
});

export default function SearchScreen() {
  const { setScreen } = useMapStore();
  const [selFlowers, setSelFlowers] = useState<number[]>([0, 3]);
  const [selOccasions, setSelOccasions] = useState<number[]>([1]);
  const [selDist, setSelDist] = useState(1);
  const [budget, setBudget] = useState(1);
  const [openOnly, setOpenOnly] = useState(true);

  function toggleFlower(i: number) {
    setSelFlowers(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  function toggleOccasion(i: number) {
    setSelOccasions(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  const labelSm: React.CSSProperties = {
    fontFamily: 'var(--ff-kr)', fontSize: 11, fontWeight: 500,
    color: 'var(--muted)', letterSpacing: '0.2px', marginBottom: 7,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', background: '#faf6f7', overflow: 'hidden' }}>
      {/* Search bar */}
      <div style={{ padding: '12px 14px 10px', background: 'var(--white)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
          <span onClick={() => setScreen('map')} style={{ fontSize: 18, color: 'var(--ink2)', cursor: 'pointer' }}>←</span>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--white)', border: '2px solid var(--rose)',
            borderRadius: 14, padding: '8px 11px',
            fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--muted)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ flex: 1 }}>꽃 종류, 장소 검색...</span>
            <span style={{ color: 'var(--muted)', cursor: 'pointer' }}>✕</span>
          </div>
        </div>
      </div>

      {/* Scrollable filters */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 0' }}>
        {/* Recent searches */}
        <div style={{ marginBottom: 14 }}>
          <div style={labelSm}>최근 검색</div>
          {RECENTS.map(r => (
            <div key={r} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--ink2)',
            }}>
              <span>🕐 {r}</span>
              <span style={{ color: 'var(--muted)', cursor: 'pointer' }}>✕</span>
            </div>
          ))}
        </div>

        {/* Flower type */}
        <div style={{ marginBottom: 14 }}>
          <div style={labelSm}>꽃 종류</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {FLOWERS.map((f, i) => (
              <span key={f} onClick={() => toggleFlower(i)} style={pill(selFlowers.includes(i))}>{f}</span>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div style={{ marginBottom: 14 }}>
          <div style={labelSm}>목적</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {OCCASIONS.map((o, i) => (
              <span key={o} onClick={() => toggleOccasion(i)} style={pill(selOccasions.includes(i), true)}>{o}</span>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div style={{ marginBottom: 14 }}>
          <div style={labelSm}>거리</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {DISTANCES.map((d, i) => (
              <span key={d} onClick={() => setSelDist(i)} style={{ ...pill(selDist === i, true), flex: 1 }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <div style={labelSm}>예산</div>
            <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 11, color: 'var(--rose)', fontWeight: 700 }}>
              {BUDGETS[budget]}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {BUDGETS.map((b, i) => (
              <span key={b} onClick={() => setBudget(i)} style={{ ...pill(budget === i), flex: 1 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Open only toggle */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          marginBottom: 14,
        }}>
          <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--ink)' }}>지금 영업중만 보기</span>
          <div
            onClick={() => setOpenOnly(p => !p)}
            style={{
              width: 42, height: 24, borderRadius: 12, position: 'relative',
              cursor: 'pointer', flexShrink: 0,
              background: openOnly ? 'var(--rose)' : 'var(--border)',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: 2, width: 20, height: 20, borderRadius: 10, background: '#fff',
              right: openOnly ? 3 : undefined, left: openOnly ? undefined : 3,
              transition: 'all 0.2s',
            }} />
          </div>
        </div>

        {/* AI highlight card */}
        <div style={{
          background: 'linear-gradient(135deg, #fce8ef, #f5d0df)',
          border: '1.5px solid var(--rose-mid)', borderRadius: 16,
          padding: 14, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              background: 'linear-gradient(120deg, #e8a4b5, #d4637a)',
              color: '#fff', borderRadius: 100, padding: '3px 9px',
              fontSize: 11, fontWeight: 700, fontFamily: 'var(--ff-en)',
            }}>✨ AI 추천</span>
            <span style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 13, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
              꽃 배합 추천받기
            </span>
          </div>
          <p style={{ fontFamily: 'var(--ff-kr)', fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6, marginBottom: 10 }}>
            목적과 예산을 입력하면 AI가 최적의 꽃 조합을 찾아드려요 🌸
          </p>
          <button style={{
            width: '100%', padding: '10px 0',
            background: 'var(--rose)', color: '#fff', border: 'none',
            borderRadius: 13, fontFamily: 'var(--ff-kr)',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>✨ AI 배합 시작하기</button>
        </div>
      </div>

      {/* Result CTA — pinned */}
      <div style={{ padding: '10px 14px 14px', background: '#faf6f7', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={() => setScreen('list')}
          style={{
            width: '100%', padding: '14px 0',
            background: 'var(--rose)', color: '#fff', border: 'none',
            borderRadius: 13, fontFamily: 'var(--ff-kr)',
            fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px', cursor: 'pointer',
          }}
        >
          결과 보기 ({totalShops}개)
        </button>
      </div>
    </div>
  );
}
