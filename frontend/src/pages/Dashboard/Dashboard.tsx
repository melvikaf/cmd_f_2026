import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

import "./Dashboard.css";
import Card from "../../components/Card/Card";
import NavBar from "../../components/NavBar/NavBar";

type NearbyUser = {
  _id: string;
  username: string;
  age: number;
  bio: string;
  profilePhoto: string;
};

type NearbyResponse = {
  message?: string;
  users?: NearbyUser[];
  error?: string;
};

const SWIPE_THRESHOLD = 110;
const LIKE_EFFECT_DELAY = 260;
const SWIPE_OUT_DURATION = 320;

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<NearbyUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [flyDirection, setFlyDirection] = useState<"left" | "right" | "">("");
  const [showLikeEffect, setShowLikeEffect] = useState(false);

  const startXRef = useRef(0);
  const isFetchingRef = useRef(false);

  const currentUser = users[currentIndex];

  const nextProfile = () => {
    if (users.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % users.length);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimatingOut || showLikeEffect || !currentUser) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isAnimatingOut) return;

    const deltaX = e.clientX - startXRef.current;
    const clampedX = Math.max(-180, Math.min(deltaX, 180));
    setDragX(clampedX);
  };

  const resetCard = () => {
    setIsDragging(false);
    setDragX(0);
  };

  const finishSwipeOut = (direction: "left" | "right") => {
    setFlyDirection(direction);
    setIsAnimatingOut(true);

    setTimeout(() => {
      nextProfile();
      setDragX(0);
      setFlyDirection("");
      setIsAnimatingOut(false);
      setShowLikeEffect(false);
    }, SWIPE_OUT_DURATION);
  };

  const completeSwipe = (direction: "left" | "right") => {
    setIsDragging(false);

    if (direction === "right") {
      setShowLikeEffect(true);

      setTimeout(() => {
        finishSwipeOut("right");
      }, LIKE_EFFECT_DELAY);

      return;
    }

    finishSwipeOut("left");
  };

  const handlePointerUp = () => {
    if (!isDragging || isAnimatingOut) return;

    if (dragX > SWIPE_THRESHOLD) {
      completeSwipe("right");
      return;
    }

    if (dragX < -SWIPE_THRESHOLD) {
      completeSwipe("left");
      return;
    }

    resetCard();
  };

  const handlePointerLeave = () => {
    if (!isDragging || isAnimatingOut) return;
    handlePointerUp();
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id || parsedUser._id;

    if (!userId) return;

    const updateLocationAndFetchNearby = () => {
        if (isFetchingRef.current) return;

      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }

        isFetchingRef.current = true;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

            console.log("Dashboard browser location:", { latitude, longitude });

          try {
            const locationResponse = await fetch(
                "http://localhost:3000/api/location/update",
                {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                latitude,
                longitude,
              }),
                }
            );

            const locationRaw = await locationResponse.text();
            console.log("Location update status:", locationResponse.status);
            console.log("Location update response:", locationRaw);

            const nearbyResponse = await fetch(
              `http://localhost:3000/api/match/nearby/${userId}`
            );

            const nearbyRaw = await nearbyResponse.text();
            console.log("Nearby fetch status:", nearbyResponse.status);
            console.log("Nearby fetch raw response:", nearbyRaw);

            let nearbyData: NearbyResponse = {};
            try {
                nearbyData = JSON.parse(nearbyRaw) as NearbyResponse;
            } catch {
                console.error("Nearby response was not valid JSON");
                setUsers([]);
                return;
            }

            if (nearbyResponse.ok) {
                const fetchedUsers = nearbyData.users || [];
                setUsers(fetchedUsers);

                setCurrentIndex((prev) => {
                if (fetchedUsers.length === 0) return 0;
                if (prev >= fetchedUsers.length) return 0;
                return prev;
                });
            } else {
                console.error(
                nearbyData.message || nearbyData.error || "Failed to fetch nearby users"
                );
                setUsers([]);
            }
          } catch (error) {
            console.error("Error updating/fetching location data:", error);
            } finally {
            isFetchingRef.current = false;
          }
        },
            isFetchingRef.current = false;
        (error) => {
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    updateLocationAndFetchNearby();

    const interval = setInterval(() => {
      updateLocationAndFetchNearby();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const rotation = dragX * 0.05;
  const heartOpacity = showLikeEffect
    ? 1
    : Math.max(0, Math.min(dragX / 120, 1));

  const style: React.CSSProperties = isAnimatingOut
    ? {}
    : {
        transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "transform 0.25s ease",
      };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Discover</h1>
        <p className="dashboard__subtitle">Find your perfect match</p>
      </div>

      <div className="centerCard">
        {!currentUser ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            No nearby profiles found
          </div>
        ) : (
          <div
            className={`dashboard__cardContainer ${
              flyDirection ? `dashboard__cardContainer--${flyDirection}` : ""
            } ${showLikeEffect ? "dashboard__cardContainer--liked" : ""}`}
            style={style}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerUp}
          >
            <Card
              name={currentUser.username}
              age={currentUser.age}
              distance="Nearby"
              description={currentUser.bio || "No bio yet"}
              image={
                currentUser.profilePhoto ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
              }
              tags={[]}
            />

            <div
              className={`dashboard__likeGlow ${
                showLikeEffect ? "dashboard__likeGlow--active" : ""
              }`}
            />

            <div
              className={`dashboard__heartOverlay ${
                showLikeEffect ? "dashboard__heartOverlay--active" : ""
              }`}
              style={{ opacity: heartOpacity }}
            >
              <Heart size={96} fill="currentColor" />
            </div>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Dashboard;