import React, { useEffect, useState } from "react";
import "./Match.css";

type MatchRevealProps = {
  userOneName?: string;
  userOneAge?: number;
  userOneImage?: string;
  userTwoName?: string;
  userTwoAge?: number;
  userTwoImage?: string;
  initialSeconds?: number;
};

const Match: React.FC<MatchRevealProps> = ({
  userOneName = "Ava",
  userOneAge = 22,
  userOneImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  userTwoName = "Noah",
  userTwoAge = 24,
  userTwoImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  initialSeconds = 30 * 60, // 30 mins
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const timerPercentage = (timeLeft / initialSeconds) * 100;

  return (
    <div className="match-page">
      <div className="match-container">
        <p className="match-badge">Nearby Match Unlocked</p>

        <h1 className="match-title">It’s a Match</h1>
        <p className="match-subtitle">
          You both liked each other and you’re close by right now.
        </p>

        <div className="match-link-area">
          <div className="profile-card">
            <img src={userOneImage} alt={userOneName} className="profile-image" />
            <div className="profile-info">
              <h2>
                {userOneName}, <span>{userOneAge}</span>
              </h2>
              <p>Ready to meet</p>
            </div>
          </div>

          <div className="heart-link-wrapper">
            <div className="heart-line left-line" />
            <div className="heart-center">
              <span className="heart-icon">❤</span>
            </div>
            <div className="heart-line right-line" />
          </div>

          <div className="profile-card">
            <img src={userTwoImage} alt={userTwoName} className="profile-image" />
            <div className="profile-info">
              <h2>
                {userTwoName}, <span>{userTwoAge}</span>
              </h2>
              <p>Also nearby</p>
            </div>
          </div>
        </div>

        <div className="move-card">
          <p className="move-title">You have 30 minutes to make a move</p>
          <p className="move-text">
            Say hi, wave, or start the conversation in real life before the match expires.
          </p>

          <div className="timer-display">{timeLeft > 0 ? formatTime(timeLeft) : "Expired"}</div>

          <div className="timer-bar">
            <div
              className="timer-bar-fill"
              style={{ width: `${Math.max(timerPercentage, 0)}%` }}
            />
          </div>

          <button className="move-button">
            Make Your Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default Match;