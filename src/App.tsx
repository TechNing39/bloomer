import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { useMapStore } from './store/mapStore';
import MapScreen from './components/screens/MapScreen';
import ListScreen from './components/screens/ListScreen';
import SearchScreen from './components/screens/SearchScreen';
import ShopDetailSheet from './components/shop/ShopDetailSheet';

export default function App() {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
  });
  const screen = useMapStore(s => s.screen);
  const shopDetailId = useMapStore(s => s.shopDetailId);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', fontFamily: 'var(--ff-kr)', color: 'var(--muted)', fontSize: 14 }}>
      🌸 불러오는 중...
    </div>
  );
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', fontFamily: 'var(--ff-kr)', color: 'var(--rose)', fontSize: 14 }}>
      지도를 불러올 수 없어요
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100dvh', overflow: 'hidden' }}>
      {screen === 'map' && <MapScreen />}
      {screen === 'list' && <ListScreen />}
      {screen === 'search' && <SearchScreen />}
      {shopDetailId && <ShopDetailSheet />}
    </div>
  );
}
