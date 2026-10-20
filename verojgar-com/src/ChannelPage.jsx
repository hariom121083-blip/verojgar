
import React, { useState } from "react";

export default function ChannelPage({
  user,
  profile,
  videos = [],
  onBack,
  onUpload,
  onEditProfile,
  onOpenVideo,
}) {
  const [activeTab, setActiveTab] = useState("Home");

  const name = profile?.name || user?.email?.split("@")[0] || "Verojgar Creator";
  const handle = profile?.handle || name.toLowerCase().replace(/\s+/g, "");
  const avatar = profile?.avatar_url;

  const channelVideos = videos.filter(
    (video) => video.creator_id === user?.id
  );

  const shorts = channelVideos.filter(
    (video) => video.video_type === "short"
  );

  const longVideos = channelVideos.filter(
    (video) => video.video_type !== "short"
  );

  const tabs = ["Home", "Videos", "Shorts", "Posts"];

  const buttonStyle = {
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "10px 16px",
    background: "#1e293b",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: 600,
  };

  const cards = activeTab === "Shorts" ? shorts :
    activeTab === "Videos" ? longVideos : channelVideos;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080d19",
      color: "#f8fafc",
      padding: "28px",
    }}>
      <button style={buttonStyle} onClick={onBack}>← Back</button>

      <section style={{
        marginTop: 24,
        padding: 24,
        borderRadius: 22,
        background: "linear-gradient(120deg,#111c35,#172554)",
        border: "1px solid #263449",
      }}>
        <div style={{
          height: 140,
          borderRadius: 16,
          background: "linear-gradient(120deg,#2563eb,#7c3aed,#0891b2)",
          marginBottom: 24,
        }} />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}>
          {avatar ? (
            <img src={avatar} alt="Profile" style={{
              width: 100, height: 100, borderRadius: "50%",
              objectFit: "cover", border: "3px solid #38bdf8",
            }} />
          ) : (
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: "linear-gradient(135deg,#38bdf8,#6366f1)",
              display: "grid", placeItems: "center",
              fontSize: 38, fontWeight: 800,
            }}>
              {name[0]?.toUpperCase()}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 30 }}>{name}</h1>
            <p style={{ color: "#94a3b8", margin: "0 0 8px" }}>
              @{handle} · {channelVideos.length} videos
            </p>
            <p style={{ color: "#cbd5e1", margin: 0 }}>
              {profile?.bio || "अपनी skills सीखें, सिखाएँ और दुनिया से जुड़ें।"}
            </p>
            {profile?.city && (
              <p style={{ color: "#94a3b8" }}>
                {profile.city}{profile?.state ? `, ${profile.state}` : ""}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={{
              ...buttonStyle, background: "#2563eb", border: 0,
            }} onClick={onEditProfile}>
              ✎ Edit Profile
            </button>
            <button style={{
              ...buttonStyle, background: "#0891b2", border: 0,
            }} onClick={onUpload}>
              ＋ Upload Video
            </button>
          </div>
        </div>
      </section>

      <nav style={{
        display: "flex", gap: 10, margin: "24px 0",
        borderBottom: "1px solid #263449", flexWrap: "wrap",
      }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            ...buttonStyle,
            border: 0,
            borderRadius: "10px 10px 0 0",
            background: activeTab === tab ? "#1d4ed8" : "transparent",
          }}>
            {tab}
          </button>
        ))}
      </nav>

      <h2 style={{ fontSize: 22 }}>
        {activeTab === "Home" ? "My Videos" : activeTab}
      </h2>

      {activeTab === "Posts" ? (
        <p style={{ color: "#94a3b8" }}>
          Posts सुविधा अगले चरण में जोड़ी जाएगी।
        </p>
      ) : cards.length === 0 ? (
        <div style={{
          padding: 36, textAlign: "center",
          background: "#111827", borderRadius: 18,
          border: "1px solid #263449",
        }}>
          <h3>अभी कोई वीडियो नहीं है</h3>
          <p style={{ color: "#94a3b8" }}>
            अपना पहला वीडियो अपलोड करके चैनल शुरू करें।
          </p>
          <button style={buttonStyle} onClick={onUpload}>
            Upload your first video
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))",
          gap: 20,
        }}>
          {cards.map((video) => (
            <article key={video.id} style={{
              background: "#111827",
              border: "1px solid #263449",
              borderRadius: 16,
              padding: 12,
              cursor: "pointer",
            }} onClick={() => onOpenVideo?.(video)}>
              <div style={{
                height: 145, borderRadius: 10,
                background: "linear-gradient(135deg,#1e3a8a,#312e81)",
                display: "grid", placeItems: "center",
                fontSize: 32,
              }}>▶</div>
              <h3 style={{ fontSize: 16 }}>{video.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                {video.video_type === "short" ? "Short" : "Long Video"}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
