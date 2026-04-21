import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useMapStore } from '../../store/mapStore';
import shops from '../../data/shops.json';

export default function KakaoMap() {
  const { mapCenter, setMapCenter, setSelectedShopId } = useMapStore();

  return (
    <Map
      center={mapCenter}
      style={{ width: '100%', height: '100%' }}
      level={5}
      onCenterChanged={(map) =>
        setMapCenter({ lat: map.getCenter().getLat(), lng: map.getCenter().getLng() })
      }
    >
      {shops.map((shop) => (
        <MapMarker
          key={shop.id}
          position={{ lat: shop.lat, lng: shop.lng }}
          title={shop.name}
          onClick={() => setSelectedShopId(shop.id)}
        />
      ))}
    </Map>
  );
}
