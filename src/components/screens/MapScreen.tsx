import { useState, useEffect } from 'react';
import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useMapStore } from '../../store/mapStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGeolocation } from '../../hooks/useGeolocation';
import shopsData from '../../data/shops.json';
import type { Shop } from '../../types/shop';

const shops = shopsData as Shop[];
const CATEGORIES = ['🌸 전체', '🌹 장미', '🌷 튤립', '💐 부케', '🤖 AI추천'];

const CATEGORY_FILTER: ((shop: Shop) => boolean)[] = [
  () => true,
  (s) => s.flowerIds.includes('flower-01'),
  (s) => s.flowerIds.includes('flower-02'),
  (s) => s.tags.includes('부케'),
  () => false,
];

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function MapScreen() {
  const { mapCenter, setMapCenter, setSelectedShopId, setScreen, setShopDetailId, openBuilderWithAi } = useMapStore();
  const { track } = useAnalytics();
  useGeolocation();
  const [selIdx, setSelIdx] = useState(0);
  const [selCat, setSelCat] = useState(0);

  useEffect(() => { track('map_open'); }, []);

  const filteredShops = shops.filter(CATEGORY_FILTER[selCat] ?? (() => true));
  const selectedShop = filteredShops[selIdx] ?? filteredShops[0];

  function handleMarkerClick(i: number) {
    setSelIdx(i);
    setSelectedShopId(filteredShops[i].id);
    track('marker_click', { shopId: filteredShops[i].id });
  }

  function handleCatSelect(i: number) {
    if (i === 4) { openBuilderWithAi(); return; }
    setSelCat(i);
    setSelIdx(0);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>
      {/* Map */}
      <Map
        center={mapCenter}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCenterChanged={(map) =>
          setMapCenter({ lat: map.getCenter().getLat(), lng: map.getCenter().getLng() })
        }
      >
        {filteredShops.map((shop, i) => (
          <CustomOverlayMap
            key={shop.id}
            position={{ lat: shop.lat, lng: shop.lng }}
            yAnchor={1.4}
          >
            <div
              onClick={() => handleMarkerClick(i)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{
                background: selIdx === i ? 'var(--rose)' : 'var(--white)',
                color: selIdx === i ? '#fff' : 'var(--rose)',
                border: '1.5px solid var(--rose)',
                borderRadius: 100, padding: '3px 10px',
                fontSize: 11, fontWeight: 700, fontFamily: 'var(--ff-kr)',
                whiteSpace: 'nowrap', marginBottom: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              }}>
                {shop.name}
              </div>
              <div style={{
                width: selIdx === i ? 28 : 20,
                height: selIdx === i ? 28 : 20,
                background: selIdx === i ? '#1e1218' : 'var(--rose)',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                border: '2px solid #fff',
                boxShadow: '0 3px 8px rgba(212,99,122,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <span style={{ transform: 'rotate(45deg)', fontSize: selIdx === i ? 12 : 9 }}>🌸</span>
              </div>
            </div>
          </CustomOverlayMap>
        ))}
      </Map>

      {/* Floating search bar + categories */}
      <div style={{ position: 'absolute', top: 16, left: 14, right: 14, zIndex: 20 }}>
        <div
          onClick={() => setScreen('search')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 14, padding: '9px 13px', cursor: 'pointer',
            fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--muted)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          <SearchIcon />
          <span style={{ flex: 1 }}>내 주변 꽃집 찾기</span>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: 'var(--rose-light)', border: '1.5px solid var(--rose-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>👤</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {CATEGORIES.map((c, i) => (
            <span
              key={c}
              onClick={() => handleCatSelect(i)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                borderRadius: 100, padding: '5px 12px',
                fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
                fontFamily: 'var(--ff-kr)', cursor: 'pointer',
                background: selCat === i ? 'var(--rose)' : 'var(--white)',
                color: selCat === i ? '#fff' : 'var(--ink2)',
                border: selCat === i ? '1.5px solid var(--rose)' : '1.5px solid var(--border)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{ position: 'absolute', right: 14, top: '42%', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {['+', '−'].map(s => (
          <div key={s} style={{
            width: 32, height: 32, background: 'var(--white)',
            border: '1.5px solid var(--border)', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--ff-en)', fontSize: 18, color: 'var(--ink2)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)', cursor: 'pointer',
          }}>{s}</div>
        ))}
      </div>

      {/* Bottom shop card */}
      <div style={{ position: 'absolute', bottom: 16, left: 14, right: 14, zIndex: 20 }}>
        {filteredShops.length === 0 && (
          <div style={{
            background: 'var(--white)', borderRadius: 16,
            border: '1.5px solid var(--border)', padding: '20px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            textAlign: 'center', fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--muted)',
          }}>
            해당 꽃을 취급하는 주변 꽃집이 없어요 🌿
          </div>
        )}
        {filteredShops.length > 0 && selectedShop && <div style={{
          background: 'var(--white)', borderRadius: 16,
          border: '1.5px solid var(--border)',
          padding: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'flex', gap: 11 }}>
            <div style={{
              width: 66, height: 66, borderRadius: 13, flexShrink: 0,
              background: 'var(--rose-light)',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(212,99,122,0.07) 6px, rgba(212,99,122,0.07) 12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>🌸</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--ff-kr)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
                    {selectedShop.name}
                  </div>
                  <div style={{ fontFamily: 'var(--ff-kr)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    📍 {selectedShop.dist} · {selectedShop.tags[0]}
                  </div>
                </div>
                <span style={{ fontSize: 18, cursor: 'pointer' }}>♡</span>
              </div>
              <div style={{ color: 'var(--rose)', fontSize: 11, letterSpacing: '0.5px', marginTop: 4 }}>
                {'★'.repeat(5)}
                <span style={{ fontFamily: 'var(--ff-en)', fontSize: 11, color: 'var(--ink2)', marginLeft: 4 }}>
                  {selectedShop.rating}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button
                  onClick={() => setShopDetailId(selectedShop.id)}
                  style={{
                    flex: 1, background: 'var(--rose)', color: '#fff', border: 'none',
                    borderRadius: 13, padding: '8px 0', fontSize: 12,
                    fontFamily: 'var(--ff-kr)', fontWeight: 700, cursor: 'pointer',
                  }}>상세보기</button>
                <button
                  onClick={() => openBuilderWithAi()}
                  style={{
                  flex: 1, background: 'transparent', color: 'var(--rose)',
                  border: '1.5px solid var(--rose)',
                  borderRadius: 13, padding: '7px 0', fontSize: 12,
                  fontFamily: 'var(--ff-kr)', fontWeight: 600, cursor: 'pointer',
                }}>🤖 AI배합</button>
              </div>
            </div>
          </div>
          {/* Carousel dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 10 }}>
            {filteredShops.map((_, i) => (
              <div
                key={i}
                onClick={() => handleMarkerClick(i)}
                style={{
                  width: i === selIdx ? 16 : 6, height: 6, borderRadius: 3,
                  background: i === selIdx ? 'var(--rose)' : 'var(--rose-mid)',
                  transition: 'all 0.2s', cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}
