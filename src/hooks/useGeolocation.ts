import { useEffect } from 'react';
import { useMapStore } from '../store/mapStore';

const SEOUL_CENTER = { lat: 37.5563, lng: 126.9138 };

export function useGeolocation() {
  const setMapCenter = useMapStore(s => s.setMapCenter);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setMapCenter(SEOUL_CENTER);
      },
      { timeout: 5000 }
    );
  }, []);
}
