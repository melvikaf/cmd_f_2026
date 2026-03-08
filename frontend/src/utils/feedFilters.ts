import type { User } from "../types/user";
import { calculateDistanceMeters } from "./proximity";

function isLocationFresh(user: User, maxMinutes = 5): boolean {
  if (!user.lastLocationUpdatedAt) return true;

  const updatedAt = new Date(user.lastLocationUpdatedAt).getTime();
  const now = Date.now();
  const diffMinutes = (now - updatedAt) / (1000 * 60);

  return diffMinutes <= maxMinutes;
}

function matchesGenderPreference(currentUser: User, candidateUser: User): boolean {
  return currentUser.preferences.genderPreference.includes(candidateUser.gender);
}

function matchesAgePreference(currentUser: User, candidateUser: User): boolean {
  return (
    candidateUser.age >= currentUser.preferences.ageMin &&
    candidateUser.age <= currentUser.preferences.ageMax
  );
}

export function shouldShowInFeed(currentUser: User, candidateUser: User): boolean {
  if (currentUser._id === candidateUser._id) return false;

  if (!currentUser.locationEnabled || !candidateUser.locationEnabled) return false;

  if (!isLocationFresh(candidateUser)) return false;

  const distance = calculateDistanceMeters(
    currentUser.location.coordinates,
    candidateUser.location.coordinates
  );

  const withinCurrentUserRadius =
    distance <= currentUser.preferences.maxDistanceMeters;

  const withinCandidateUserRadius =
    distance <= candidateUser.preferences.maxDistanceMeters;

  if (!withinCurrentUserRadius || !withinCandidateUserRadius) return false;

  if (!matchesGenderPreference(currentUser, candidateUser)) return false;
  if (!matchesAgePreference(currentUser, candidateUser)) return false;

  return true;
}

export function getVisibleProfiles(currentUser: User, allUsers: User[]): User[] {
  return allUsers.filter((user) => shouldShowInFeed(currentUser, user));
}