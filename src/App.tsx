import { useKakaoLoader } from 'react-kakao-maps-sdk';
import KakaoMap from './components/map/KakaoMap';
import ShopListSheet from './components/shop/ShopListSheet';

export default function App() {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
  });

  if (loading) return <div className="flex items-center justify-center h-dvh text-gray-400">지도 불러오는 중...</div>;
  if (error) return <div className="flex items-center justify-center h-dvh text-red-400">지도를 불러올 수 없어요</div>;

  return (
    <div className="w-full h-dvh relative">
      <KakaoMap />
      <ShopListSheet />
    </div>
  );
}
