export interface FoodItem {
  id: string;
  title: string;
  details: string;
  description: string;
}

export const sampleFoodItems: FoodItem[] = [
  {
    id: '1',
    title: '🍕 Pizza Slices',
    details: '2 slices • 0.3 miles away',
    description: 'Fresh pizza from Mario\'s Kitchen',
  },
  {
    id: '2',
    title: '🥗 Fresh Salad',
    details: '1 bowl • 0.5 miles away',
    description: 'Organic mixed greens with dressing',
  },
];
