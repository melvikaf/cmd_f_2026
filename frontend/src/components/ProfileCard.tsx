import type { User } from "../types/user";

type ProfileCardProps = {
  user: User;
};

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div
      style={{
        width: "320px",
        border: "1px solid #ddd",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#EEE6D8",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={user.photoUrl}
        alt={user.username}
        style={{
          width: "100%",
          height: "260px",
          objectFit: "cover",
          display: "block",
        }}
      />

      <div style={{ padding: "16px" }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#2E2B28" }}>
          {user.username}, {user.age}
        </h3>

        <p style={{ margin: "0 0 16px 0", color: "#8B8176" }}>{user.bio}</p>

        <button
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "none",
            borderRadius: "10px",
            background: "#9E2A2B",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => {
            alert(`Ping sent to ${user.username}`);
          }}
        >
          Ping
        </button>
      </div>
    </div>
  );
}