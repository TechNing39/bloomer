export interface Shop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  businessHours: string;
  flowerIds: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  priceRange: '₩' | '₩₩' | '₩₩₩';
  dist: string;
}
