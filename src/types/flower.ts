export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ColorTag = 'red' | 'pink' | 'white' | 'yellow' | 'purple' | 'orange' | 'blue' | 'mixed';

export interface Flower {
  id: string;
  name: string;
  nameEn: string;
  color: ColorTag;
  meaning: string;
  season: Season[];
  priceRange: {
    min: number;
    max: number;
  };
  imageUrl: string;
}
