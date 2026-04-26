import { useBuilderStore } from '../../store/builderStore';
import { useAnalytics } from '../../hooks/useAnalytics';

const WRAP_OPTIONS = [
  {
    id: 'basic' as const,
    emoji: '🧻',
    label: '베이직',
    desc: '자연스러운 크라프트지',
    extra: '',
  },
  {
    id: 'ribbon' as const,
    emoji: '🎀',
    label: '리본',
    desc: '새틴 리본 마감',
    extra: '+₩2,000',
  },
  {
    id: 'premium' as const,
    emoji: '✨',
    label: '프리미엄',
    desc: '고급 한지 + 리본',
    extra: '+₩5,000',
  },
];

export default function WrapOptionSelector() {
  const { track } = useAnalytics();
  const { wrapOption, setWrapOption } = useBuilderStore();

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {WRAP_OPTIONS.map(opt => {
        const active = wrapOption === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => { setWrapOption(opt.id); track('wrap_option_selected', { option: opt.id }); }}
            style={{
              flex: 1, padding: '14px 8px', borderRadius: 16,
              border: active ? '2px solid var(--rose)' : '1.5px solid var(--border)',
              background: active ? 'var(--rose-light)' : 'var(--white)',
              cursor: 'pointer', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.emoji}</div>
            <div style={{
              fontFamily: 'var(--ff-kr)', fontSize: 13, fontWeight: 700,
              color: active ? 'var(--rose)' : 'var(--ink)',
              marginBottom: 3, letterSpacing: '-0.3px',
            }}>{opt.label}</div>
            <div style={{
              fontFamily: 'var(--ff-kr)', fontSize: 10,
              color: 'var(--muted)', marginBottom: 4,
            }}>{opt.desc}</div>
            {opt.extra && (
              <div style={{
                fontFamily: 'var(--ff-en)', fontSize: 11, fontWeight: 700,
                color: active ? 'var(--rose)' : 'var(--ink2)',
              }}>{opt.extra}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
