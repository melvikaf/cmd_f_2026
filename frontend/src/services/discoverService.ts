import { mockUsers } from "../data/mockUsers";
import type { User } from "../types/user";
import { getVisibleProfiles } from "../utils/feedFilters";

export async function discoverProfiles(currentUserId: string): Promise<User[]> {
  const currentUser = mockUsers.find((user) => user._id === currentUserId);

  if (!currentUser) {
    throw new Error(`User with id ${currentUserId} not found`);
  }

  const visibleProfiles = getVisibleProfiles(currentUser, mockUsers);

  return visibleProfiles;
}