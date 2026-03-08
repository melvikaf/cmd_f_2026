// import { useEffect, useState } from "react";
// import ProfileCard from "../components/ProfileCard";
// import { discoverProfiles } from "../services/discoverService";
// import {
//   watchBrowserLocation,
//   stopWatchingBrowserLocation,
//   sendLocationToBackend,
//   type BrowserLocation,
// } from "../services/locationService";
// import type { User } from "../types/user";

// type TestUserId = "userA" | "userB";

// export default function Dashboard() {
//   const [selectedUserId, setSelectedUserId] = useState<TestUserId>("userA");
//   const [location, setLocation] = useState<BrowserLocation | null>(null);
//   const [profiles, setProfiles] = useState<User[]>([]);
//   const [error, setError] = useState<string>("");
//   const [status, setStatus] = useState<string>("Starting location tracking...");

//   useEffect(() => {
//     let watchId: number | null = null;

//     async function refreshEverything(
//       currentUserId: string,
//       newLocation: BrowserLocation
//     ) {
//       setStatus("Sending location to backend...");

//       await sendLocationToBackend(currentUserId, newLocation);

//       setStatus("Fetching nearby profiles...");

//       const nearbyProfiles = await discoverProfiles(currentUserId);
//       setProfiles(nearbyProfiles);

//       setStatus("Live location tracking active");
//     }

//     try {
//       watchId = watchBrowserLocation(
//         async (newLocation) => {
//           try {
//             setLocation(newLocation);
//             setError("");

//             await refreshEverything(selectedUserId, newLocation);
//           } catch (err) {
//             console.error(err);
//             setError("Failed to update location or load nearby profiles.");
//             setStatus("Error");
//           }
//         },
//         (err) => {
//           console.error(err);
//           setError("Location permission denied or unavailable.");
//           setStatus("Location unavailable");
//         }
//       );
//     } catch (e) {
//       console.error(e);
//       setError("Geolocation not supported by this browser.");
//       setStatus("Geolocation unsupported");
//     }

//     return () => {
//       stopWatchingBrowserLocation(watchId);
//     };
//   }, [selectedUserId]);

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#F5EFE6",
//         padding: "24px",
//       }}
//     >
//       <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
//         <h1 style={{ color: "#2E2B28", marginBottom: "8px" }}>
//           LoveSignal Dashboard
//         </h1>

//         <p style={{ color: "#8B8176", marginBottom: "20px" }}>
//           Select a test user on each phone, allow location, and see if nearby
//           profiles appear.
//         </p>

//         <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
//           <button
//             onClick={() => setSelectedUserId("userA")}
//             style={{
//               padding: "10px 16px",
//               borderRadius: "10px",
//               border: "none",
//               background: selectedUserId === "userA" ? "#9E2A2B" : "#D6C4A2",
//               color: selectedUserId === "userA" ? "white" : "#2E2B28",
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//           >
//             Use User A
//           </button>

//           <button
//             onClick={() => setSelectedUserId("userB")}
//             style={{
//               padding: "10px 16px",
//               borderRadius: "10px",
//               border: "none",
//               background: selectedUserId === "userB" ? "#9E2A2B" : "#D6C4A2",
//               color: selectedUserId === "userB" ? "white" : "#2E2B28",
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//           >
//             Use User B
//           </button>
//         </div>

//         <div
//           style={{
//             background: "#EEE6D8",
//             padding: "16px",
//             borderRadius: "12px",
//             marginBottom: "24px",
//             color: "#2E2B28",
//           }}
//         >
//           <p>
//             <strong>Current Test User:</strong> {selectedUserId}
//           </p>
//           <p>
//             <strong>Status:</strong> {status}
//           </p>

//           {error && <p style={{ color: "#9E2A2B" }}>{error}</p>}

//           {!error && !location && <p>Getting your location...</p>}

//           {!error && location && (
//             <>
//               <p>
//                 <strong>Latitude:</strong> {location.latitude}
//               </p>
//               <p>
//                 <strong>Longitude:</strong> {location.longitude}
//               </p>
//               <p>
//                 <strong>Accuracy:</strong> {location.accuracy.toFixed(2)} meters
//               </p>
//             </>
//           )}
//         </div>

//         <h2 style={{ color: "#2E2B28", marginBottom: "16px" }}>
//           Nearby Profiles
//         </h2>

//         {profiles.length === 0 ? (
//           <p style={{ color: "#8B8176" }}>No nearby profiles right now.</p>
//         ) : (
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: "20px",
//             }}
//           >
//             {profiles.map((profile) => (
//               <ProfileCard key={profile._id} user={profile} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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

type TestUserId = "userA" | "userB";

export default function Dashboard() {
  const [selectedUserId, setSelectedUserId] = useState<TestUserId>("userA");
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("Starting location tracking...");

  useEffect(() => {
    let watchId: number | null = null;

    async function refreshEverything(
      currentUserId: string,
      newLocation: BrowserLocation
    ) {
      setStatus("Updating mock location...");

      await updateUserLocation(currentUserId, [
        newLocation.longitude,
        newLocation.latitude,
      ]);

      setStatus("Loading nearby mock profiles...");

      const nearbyProfiles = await discoverProfiles(currentUserId);
      setProfiles(nearbyProfiles);

      setStatus("Mock test mode active");
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

        <p style={{ color: "#8B8176", marginBottom: "20px" }}>
          Mock test mode for proximity logic.
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button onClick={() => setSelectedUserId("userA")}>Use User A</button>
          <button onClick={() => setSelectedUserId("userB")}>Use User B</button>
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
            <strong>Current Test User:</strong> {selectedUserId}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>

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
            </>
          )}
        </div>

        <h2 style={{ color: "#2E2B28", marginBottom: "16px" }}>
          Nearby Profiles
        </h2>

        {profiles.length === 0 ? (
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