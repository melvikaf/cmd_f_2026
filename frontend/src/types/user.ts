export type User = {
  _id: string;
  username: string;
  gender: string;
  age: number;
  bio: string;
  photoUrl: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  locationEnabled: boolean;
  preferences: {
    genderPreference: string[];
    ageMin: number;
    ageMax: number;
    maxDistanceMeters: number;
  };
  lastLocationUpdatedAt?: string;
};