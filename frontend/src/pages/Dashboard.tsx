import { useEffect, useState } from "react";
import type { User } from "../types/user";
import LocationDebugger from "../components/LocationDebugger";
import ProfileCard from "../components/ProfileCard";
import { discoverProfiles } from "../services/discoverService";

const CURRENT_USER_ID = "user123";

export default function Dashboard() {
  const [profiles, setProfiles] = useState<User[]>([]);

  useEffect(() => {
    async function loadProfiles() {
      const visibleProfiles = await discoverProfiles(CURRENT_USER_ID);
      setProfiles(visibleProfiles);
    }

    loadProfiles();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5EFE6",
        padding: "24px",
      }}
    >
      <h1>LoveSignal Dashboard</h1>

      <LocationDebugger />

      <h2>Nearby Profiles</h2>

      {profiles.length === 0 ? (
        <p>No nearby profiles right now.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {profiles.map((profile) => (
            <ProfileCard key={profile._id} user={profile} />
          ))}
        </div>
      )}
    </div>
  );
}