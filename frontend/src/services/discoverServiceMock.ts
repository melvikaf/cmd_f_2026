import { mockUsers } from "../data/mockUsers";
import type { User } from "../types/user";
import { getVisibleProfiles } from "../utils/feedFilters";

export async function discoverProfiles(currentUserId: string): Promise<User[]> {
  const currentUser = mockUsers.find((u) => u._id === currentUserId);

  if (!currentUser) {
    throw new Error("Current user not found");
  }

  return getVisibleProfiles(currentUser, mockUsers);
}