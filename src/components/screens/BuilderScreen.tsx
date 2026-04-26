import { useMapStore } from '../../store/mapStore';
import { useBuilderStore } from '../../store/builderStore';
import BouquetPreview from '../builder/BouquetPreview';
import FlowerPalette from '../builder/FlowerPalette';
import WrapOptionSelector from '../builder/WrapOptionSelector';

const WRAP_EXTRA: Record<string, number> = { basic: 0, ribbon: 2000, premium: 5000 };

export default function BuilderScreen() {
  const setScreen = useMapStore(s => s.setScreen);
  const { flowers, wrapOption } = useBuilderStore();

  const flowerTotal = flowers.reduce((sum, f) => sum + f.unitPrice * f.quantity, 0);
  const total = flowerTotal + WRAP_EXTRA[wrapOption];
  const count = flowers.reduce((s, f) => s + f.quantity, 0);

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

        {/* 꽃 추가 */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>꽃 추가하기</SectionTitle>
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
          onClick={() => setScreen('map')}
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
      color: 'var(--muted)', letterSpacing: '-0.2px', marginBottom: 10,
    }}>{children}</div>
  );
}
