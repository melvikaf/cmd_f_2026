import type { User } from "../types/user";

export async function discoverProfiles(currentUserId: string): Promise<User[]> {
  const response = await fetch(
    `/api/discover?userId=${encodeURIComponent(currentUserId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch nearby profiles");
  }

  const data: User[] = await response.json();
  return data;
}