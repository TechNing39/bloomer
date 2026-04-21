import type { Shop } from '../../types/shop';

interface ShopCardProps {
  shop: Shop;
  isSelected: boolean;
  onClick: () => void;
}

export default function ShopCard({ shop, isSelected, onClick }: ShopCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-4 cursor-pointer
        border-b border-gray-100 last:border-none
        transition-colors
        ${isSelected ? 'bg-pink-50' : 'bg-white hover:bg-gray-50'}
      `}
    >
      {/* 썸네일 */}
      <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0 text-2xl">
        💐
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 truncate">{shop.name}</p>
          {isSelected && (
            <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full flex-shrink-0">
              선택됨
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate mt-0.5">{shop.address}</p>
        <p className="text-xs text-gray-400 mt-0.5">{shop.businessHours}</p>
      </div>

      {/* 꽃 개수 */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-pink-500">{shop.flowerIds.length}종</p>
        <p className="text-xs text-gray-400">보유</p>
      </div>
    </div>
  );
}
