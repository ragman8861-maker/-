export interface Puppy {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  price: string;
  description: string;
  images: string[];
  status: 'available' | 'adopted';
  createdAt: number;
}

export interface ContactInfo {
  phone: string;
  address: string;
  kakaoId: string;
  instagram: string;
  businessHours: string;
  businessRegistrationNumber: string;
  animalSalesLicenseNumber: string;
}

export interface Review {
  id: string;
  userName: string;
  puppyName: string;
  breed: string;
  content: string;
  rating: number;
  image: string;
  createdAt: number;
}
