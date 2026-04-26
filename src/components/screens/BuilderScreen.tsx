import { useState, useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { useBuilderStore } from '../../store/builderStore';
import BouquetPreview from '../builder/BouquetPreview';
import FlowerPalette from '../builder/FlowerPalette';
import WrapOptionSelector from '../builder/WrapOptionSelector';
import { getFlowerRecommendation } from '../../api/groq';
import flowersData from '../../data/flowers.json';
import type { ColorTag } from '../../types/flower';

const WRAP_EXTRA: Record<string, number> = { basic: 0, ribbon: 2000, premium: 5000 };

const COLOR_OPTIONS: { label: string; value: ColorTag }[] = [
  { label: '레드', value: 'red' },
  { label: '핑크', value: 'pink' },
  { label: '화이트', value: 'white' },
  { label: '옐로우', value: 'yellow' },
  { label: '퍼플', value: 'purple' },
  { label: '블루', value: 'blue' },
  { label: '혼합', value: 'mixed' },
];

export default function BuilderScreen() {
  const setScreen = useMapStore(s => s.setScreen);
  const builderOpenAi = useMapStore(s => s.builderOpenAi);
  const resetBuilderOpenAi = useMapStore(s => s.resetBuilderOpenAi);
  const { flowers, wrapOption, addFlower } = useBuilderStore();

  const [showAi, setShowAi] = useState(builderOpenAi);

  useEffect(() => {
    if (builderOpenAi) resetBuilderOpenAi();
  }, []);
  const [occasion, setOccasion] = useState('');
  const [selectedColors, setSelectedColors] = useState<ColorTag[]>([]);
  const [budget, setBudget] = useState(30000);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const flowerTotal = flowers.reduce((sum, f) => sum + f.unitPrice * f.quantity, 0);
  const total = flowerTotal + WRAP_EXTRA[wrapOption];
  const count = flowers.reduce((s, f) => s + f.quantity, 0);

  const toggleColor = (color: ColorTag) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleAiRecommend = async () => {
    if (!occasion.trim()) {
      setAiError('상황을 입력해주세요');
      return;
    }
    setLoading(true);
    setAiError('');
    try {
      const result = await getFlowerRecommendation({
        occasion: occasion.trim(),
        colors: selectedColors,
        budget,
      });
      result.flowerIds.forEach(id => {
        const flower = flowersData.find(f => f.id === id);
        if (flower) {
          addFlower({
            flowerId: flower.id,
            name: flower.name,
            quantity: 1,
            color: flower.color,
            unitPrice: flower.priceRange.min,
          });
        }
      });
      setShowAi(false);
      setOccasion('');
      setSelectedColors([]);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : '추천 실패. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column',
      background: '#faf6f7',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px 12px', background: 'var(--white)',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <button
          onClick={() => setScreen('map')}
          style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid var(--border)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 18, color: 'var(--ink2)',
          }}
        >←</button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--ff-kr)', fontSize: 17, fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '-0.5px',
          }}>꽃다발 빌더</div>
        </div>
        {count > 0 && (
          <span style={{
            background: 'var(--rose)', color: '#fff',
            borderRadius: 100, padding: '3px 10px',
            fontFamily: 'var(--ff-kr)', fontSize: 12, fontWeight: 700,
          }}>{count}송이</span>
        )}
      </div>

      {/* 스크롤 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>
        {/* 현재 구성 */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>현재 구성</SectionTitle>
          <BouquetPreview />
        </div>

        {/* 포장 선택 */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>포장 선택</SectionTitle>
          <WrapOptionSelector />
        </div>

        {/* 꽃 추가 + AI 추천 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <SectionTitle>꽃 추가하기</SectionTitle>
            <button
              onClick={() => { setShowAi(v => !v); setAiError(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', borderRadius: 20,
                border: '1.5px solid var(--rose)',
                background: showAi ? 'var(--rose)' : 'transparent',
                color: showAi ? '#fff' : 'var(--rose)',
                fontFamily: 'var(--ff-kr)', fontSize: 12, fontWeight: 700,
                cursor: 'pointer',
              }}
            >🌸 AI 추천</button>
          </div>

          {/* AI 패널 */}
          {showAi && (
            <div style={{
              background: 'var(--white)', borderRadius: 16,
              border: '1.5px solid var(--border)', padding: 16, marginBottom: 16,
            }}>
              <div style={{ marginBottom: 12 }}>
                <Label>어떤 상황인가요?</Label>
                <input
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  placeholder="예: 생일 선물, 졸업 축하, 프로포즈"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10,
                    border: '1.5px solid var(--border)', background: '#faf6f7',
                    fontFamily: 'var(--ff-kr)', fontSize: 14, color: 'var(--ink)',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <Label>선호 색상 (복수 선택 가능)</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {COLOR_OPTIONS.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => toggleColor(value)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12,
                        fontFamily: 'var(--ff-kr)', fontWeight: 600, cursor: 'pointer',
                        border: '1.5px solid var(--border)',
                        background: selectedColors.includes(value) ? 'var(--rose)' : 'transparent',
                        color: selectedColors.includes(value) ? '#fff' : 'var(--ink2)',
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Label>예산: ₩{budget.toLocaleString()}</Label>
                <input
                  type="range" min={10000} max={100000} step={5000}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--rose)' }}
                />
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: 'var(--ff-kr)', fontSize: 11, color: 'var(--muted)',
                }}>
                  <span>₩10,000</span><span>₩100,000</span>
                </div>
              </div>

              {aiError && (
                <div style={{ color: '#e53e3e', fontFamily: 'var(--ff-kr)', fontSize: 12, marginBottom: 10 }}>
                  {aiError}
                </div>
              )}

              <button
                onClick={handleAiRecommend}
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 12,
                  background: loading ? 'var(--border)' : 'var(--rose)',
                  color: loading ? 'var(--muted)' : '#fff',
                  border: 'none', fontFamily: 'var(--ff-kr)', fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >{loading ? '추천 중...' : '추천 받기'}</button>
            </div>
          )}

          <FlowerPalette />
        </div>

        <div style={{ height: 100 }} />
      </div>

      {/* 하단 CTA */}
      <div style={{
        padding: '12px 20px 24px', background: 'var(--white)',
        borderTop: '1px solid var(--border)', flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: 'var(--ff-kr)', fontSize: 13, color: 'var(--muted)' }}>
            포장 포함 예상금액
          </span>
          <span style={{
            fontFamily: 'var(--ff-en)', fontSize: 18, fontWeight: 700, color: 'var(--ink)',
          }}>₩{total.toLocaleString()}</span>
        </div>
        <button
          disabled={flowers.length === 0}
          onClick={() => setScreen('summary')}
          style={{
            width: '100%', padding: '15px 0',
            background: flowers.length === 0 ? 'var(--border)' : 'var(--rose)',
            color: flowers.length === 0 ? 'var(--muted)' : '#fff',
            border: 'none', borderRadius: 16,
            fontFamily: 'var(--ff-kr)', fontSize: 16, fontWeight: 700,
            letterSpacing: '-0.3px', cursor: flowers.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {flowers.length === 0 ? '꽃을 선택해주세요' : '요약 보기 →'}
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--ff-kr)', fontSize: 13, fontWeight: 700,
      color: 'var(--muted)', letterSpacing: '-0.2px',
    }}>{children}</div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--ff-kr)', fontSize: 12, fontWeight: 700,
      color: 'var(--ink2)', marginBottom: 8,
    }}>{children}</div>
  );
}
