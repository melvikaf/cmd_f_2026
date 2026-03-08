import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    _id: "user123",
    username: "melvika",
    gender: "female",
    age: 22,
    bio: "hi",
    photoUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    location: {
      type: "Point",
      coordinates: [-123.1207, 49.2827],
    },
    locationEnabled: true,
    preferences: {
      genderPreference: ["male"],
      ageMin: 21,
      ageMax: 27,
      maxDistanceMeters: 50,
    },
    lastLocationUpdatedAt: new Date().toISOString(),
  },
  {
    _id: "user456",
    username: "alex",
    gender: "male",
    age: 23,
    bio: "coffee and concerts",
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    location: {
      type: "Point",
      coordinates: [-123.1206, 49.28275],
    },
    locationEnabled: true,
    preferences: {
      genderPreference: ["female"],
      ageMin: 20,
      ageMax: 26,
      maxDistanceMeters: 50,
    },
    lastLocationUpdatedAt: new Date().toISOString(),
  },
  {
    _id: "user789",
    username: "jordan",
    gender: "male",
    age: 29,
    bio: "runner",
    photoUrl: "https://randomuser.me/api/portraits/men/54.jpg",
    location: {
      type: "Point",
      coordinates: [-123.1218, 49.2837],
    },
    locationEnabled: true,
    preferences: {
      genderPreference: ["female"],
      ageMin: 21,
      ageMax: 30,
      maxDistanceMeters: 100,
    },
    lastLocationUpdatedAt: new Date().toISOString(),
  },
  {
    _id: "user101",
    username: "sam",
    gender: "non-binary",
    age: 24,
    bio: "music + movies",
    photoUrl: "https://randomuser.me/api/portraits/women/21.jpg",
    location: {
      type: "Point",
      coordinates: [-123.12072, 49.28269],
    },
    locationEnabled: false,
    preferences: {
      genderPreference: ["female", "male"],
      ageMin: 22,
      ageMax: 28,
      maxDistanceMeters: 50,
    },
    lastLocationUpdatedAt: new Date().toISOString(),
  },
];