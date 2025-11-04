export interface Pet {
  id: string;
  name: string;
  happiness: number;
  intelligence: number;
  energy: number;
  petType: string;
  color: string;
  userId: string;
}

export interface User {
  id: string;
  username: string;
  isPremium: boolean;
  foodCount: number;
}
