import BottomSheet from '../common/BottomSheet';
import ShopCard from './ShopCard';
import { useMapStore } from '../../store/mapStore';
import shopsData from '../../data/shops.json';
import type { Shop } from '../../types/shop';

const shops = shopsData as Shop[];

export default function ShopListSheet() {
  const { selectedShopId, setSelectedShopId } = useMapStore();

  return (
    <BottomSheet isOpen={true}>
      <div className="px-4 pb-2">
        <p className="text-sm font-semibold text-gray-700">
          주변 꽃집 <span className="text-pink-500">{shops.length}</span>곳
        </p>
      </div>
      <div className="overflow-y-auto max-h-64">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            isSelected={selectedShopId === shop.id}
            onClick={() => setSelectedShopId(shop.id)}
          />
        ))}
      </div>
    </BottomSheet>
  );
}
