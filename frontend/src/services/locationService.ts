export type BrowserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export function watchBrowserLocation(
  onSuccess: (location: BrowserLocation) => void,
  onError: (error: GeolocationPositionError) => void
): number | null {
  if (!navigator.geolocation) {
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      onError(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

export function stopWatchingBrowserLocation(watchId: number | null) {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

export async function sendLocationToBackend(
  userId: string,
  location: BrowserLocation
): Promise<void> {
  const response = await fetch("/api/location/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user location");
  }
}