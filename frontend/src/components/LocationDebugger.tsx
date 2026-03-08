import { useEffect, useState } from "react";
import {
  getCurrentBrowserLocation,
  stopWatchingBrowserLocation,
  watchBrowserLocation,
  type BrowserLocation,
} from "../services/locationService";

export default function LocationDebugger() {
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [error, setError] = useState<string>("");
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    let watchId: number | null = null;

    async function loadInitialLocation() {
      try {
        const currentLocation = await getCurrentBrowserLocation();
        setLocation(currentLocation);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Could not get your location.");
      }
    }

    loadInitialLocation();

    watchId = watchBrowserLocation(
      (newLocation) => {
        setLocation(newLocation);
        setWatching(true);
        setError("");
      },
      (watchError) => {
        console.error(watchError);
        setError("Location tracking failed or permission was denied.");
        setWatching(false);
      }
    );

    return () => {
      stopWatchingBrowserLocation(watchId);
    };
  }, []);

  return (
    <div
      style={{
        background: "#EEE6D8",
        padding: "16px",
        borderRadius: "12px",
        marginBottom: "24px",
        color: "#2E2B28",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Your Current Location</h2>

      {error && <p style={{ color: "#9E2A2B" }}>{error}</p>}

      {!error && !location && <p>Getting your location...</p>}

      {!error && location && (
        <>
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
          <p>
            <strong>Accuracy:</strong> {location.accuracy.toFixed(2)} meters
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {watching ? "Watching for changes" : "Location loaded"}
          </p>
        </>
      )}
    </div>
  );
}