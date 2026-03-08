import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    _id: "userA",
    username: "Alice",
    gender: "female",
    age: 22,
    bio: "Coffee lover and sunset walks.",
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",

    location: {
      type: "Point",
      coordinates: [-123.1207, 49.2827],
    },

    locationEnabled: true,

    preferences: {
      genderPreference: ["male"],
      ageMin: 20,
      ageMax: 28,
      maxDistanceMeters: 50,
    },

    lastLocationUpdatedAt: new Date().toISOString(),
  },

  {
    _id: "userB",
    username: "Ben",
    gender: "male",
    age: 23,
    bio: "Music, hiking, and good food.",
    photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",

    location: {
      type: "Point",
      coordinates: [-123.1208, 49.2828],
    },

    locationEnabled: true,

    preferences: {
      genderPreference: ["female"],
      ageMin: 20,
      ageMax: 28,
      maxDistanceMeters: 50,
    },

    lastLocationUpdatedAt: new Date().toISOString(),
  },
];