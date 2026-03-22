"use client";

// This component shows one movie card on the home page.

import { useState } from "react";

export default function MovieCard({ movie }: any) {
  // This fallback image is used if poster image fails to load.
  const fallbackImage =
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba";

  // This state stores the current image source.
  const [imageSrc, setImageSrc] = useState(movie.poster_url || fallbackImage);

  return (
    <div
      style={{
        backgroundColor: "#15151d",
        borderRadius: "12px",
        overflow: "hidden",
        color: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <img
        src={imageSrc}
        alt={movie.title}
        // This changes image to fallback if original image fails.
        onError={() => setImageSrc(fallbackImage)}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "16px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          {movie.title}
        </h3>

        <p style={{ marginBottom: "6px", color: "#bdbdbd" }}>
          Genre: {movie.genre || "Not added"}
        </p>

        <p style={{ marginBottom: "6px", color: "#bdbdbd" }}>
          Duration: {movie.duration ? `${movie.duration} min` : "Not added"}
        </p>

        <button
          style={{
            marginTop: "10px",
            padding: "10px 16px",
            backgroundColor: "#ff4d4d",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}