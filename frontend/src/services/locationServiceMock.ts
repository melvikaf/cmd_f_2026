import { mockUsers } from "../data/mockUsers";

export async function updateUserLocation(
  userId: string,
  coordinates: [number, number]
): Promise<void> {
  const user = mockUsers.find((u: { _id: string; }) => u._id === userId);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  user.location = {
    type: "Point",
    coordinates,
  };

  user.lastLocationUpdatedAt = new Date().toISOString();
}