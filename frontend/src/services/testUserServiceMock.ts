import { mockUsers } from "../data/mockUsers";

export async function resetMockUsers(): Promise<void> {
  for (const user of mockUsers) {
    user.location = {
      type: "Point",
      coordinates: [0, 0],
    };

    user.lastLocationUpdatedAt = new Date(0).toISOString();
  }
}