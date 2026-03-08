import { useEffect, useState } from "react";
import type { User } from "../types/user";
import ProfileCard from "../components/ProfileCard";
import {
  watchBrowserLocation,
  stopWatchingBrowserLocation,
  type BrowserLocation,
} from "../services/locationService";
import { discoverProfiles } from "../services/discoverServiceMock";
import { updateUserLocation } from "../services/locationServiceMock";
import { resetMockUsers } from "../services/testUserServiceMock";

type TestUserId = "userA" | "userB" | null;

export default function Dashboard() {
  const [selectedUserId, setSelectedUserId] = useState<TestUserId>(null);
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Choose a test user to begin.");

  useEffect(() => {
    if (!selectedUserId) {
      setProfiles([]);
      setStatus("No user assigned.");
      return;
    }

    let watchId: number | null = null;

    async function refreshEverything(
      currentUserId: string,
      newLocation: BrowserLocation
    ) {
      setStatus("Updating selected user's location...");

      await updateUserLocation(currentUserId, [
        newLocation.longitude,
        newLocation.latitude,
      ]);

      setStatus("Checking who is nearby...");

      const nearbyProfiles = await discoverProfiles(currentUserId);
      setProfiles(nearbyProfiles);

      setStatus("Live mock test active");
    }

    try {
      watchId = watchBrowserLocation(
        async (newLocation) => {
          try {
            setLocation(newLocation);
            setError("");
            await refreshEverything(selectedUserId, newLocation);
          } catch (err) {
            console.error(err);
            setError("Failed to update location or load nearby profiles.");
            setStatus("Error");
          }
        },
        (err) => {
          console.error(err);
          setError("Location permission denied or unavailable.");
          setStatus("Location unavailable");
        }
      );
    } catch (e) {
      console.error(e);
      setError("Geolocation not supported by this browser.");
      setStatus("Geolocation unsupported");
    }

    return () => {
      stopWatchingBrowserLocation(watchId);
    };
  }, [selectedUserId]);

    async function handleClearAssignment() {
    await resetMockUsers();
    setSelectedUserId(null);
    setProfiles([]);
    setLocation(null);
    setStatus("Assignments cleared.");
    setError("");
    }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5EFE6",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ color: "#2E2B28", marginBottom: "8px" }}>
          LoveSignal Dashboard
        </h1>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button onClick={() => setSelectedUserId("userA")}>Use User A</button>
          <button onClick={() => setSelectedUserId("userB")}>Use User B</button>
          <button onClick={handleClearAssignment}>Clear Assignment</button>
        </div>

        <div
          style={{
            background: "#EEE6D8",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px",
            color: "#2E2B28",
          }}
        >
          <p>
            <strong>Current Test User:</strong>{" "}
            {selectedUserId ? selectedUserId : "None"}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>

          {error && <p style={{ color: "#9E2A2B" }}>{error}</p>}

          {!error && selectedUserId && !location && <p>Getting your location...</p>}

          {!error && location && selectedUserId && (
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
            </>
          )}
        </div>

        <h2 style={{ color: "#2E2B28", marginBottom: "16px" }}>
          Nearby Profiles
        </h2>

        {!selectedUserId ? (
          <p style={{ color: "#8B8176" }}>No user assigned yet.</p>
        ) : profiles.length === 0 ? (
          <p style={{ color: "#8B8176" }}>No nearby profiles right now.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {profiles.map((profile) => (
              <ProfileCard key={profile._id} user={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}