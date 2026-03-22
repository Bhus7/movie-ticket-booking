"use client";

// This component shows a simple booking filter bar below the hero section.

import { useState } from "react";

export default function BookingBar() {
  const [location, setLocation] = useState("Kathmandu");
  const [date, setDate] = useState("");
  const [movie, setMovie] = useState("Spider-Man");
  const [people, setPeople] = useState("2");
  const [isHovered, setIsHovered] = useState(false);

  // This function handles the book button click.
  const handleBookNow = () => {
    alert(
      `Location: ${location}\nDate: ${date || "Not selected"}\nMovie: ${movie}\nPeople: ${people}`
    );
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "-40px auto 0 auto",
        backgroundColor: "#15151d",
        padding: "20px 24px",
        borderRadius: "14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        position: "relative",
        zIndex: 5,
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        flexWrap: "wrap",
      }}
    >
      {/* This field selects the location. */}
      <div style={{ minWidth: "180px" }}>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "6px" }}>
          Location
        </p>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#22222b",
            color: "white",
            border: "1px solid #333",
            borderRadius: "8px",
            outline: "none",
          }}
        >
          <option value="Kathmandu">Kathmandu</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Butwal">Butwal</option>
          <option value="Biratnagar">Biratnagar</option>
        </select>
      </div>

      {/* This field selects the date. */}
      <div style={{ minWidth: "180px" }}>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "6px" }}>
          Date
        </p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#22222b",
            color: "white",
            border: "1px solid #333",
            borderRadius: "8px",
            outline: "none",
          }}
        />
      </div>

      {/* This field selects the movie. */}
      <div style={{ minWidth: "180px" }}>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "6px" }}>
          Movie
        </p>
        <select
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#22222b",
            color: "white",
            border: "1px solid #333",
            borderRadius: "8px",
            outline: "none",
          }}
        >
          <option value="Spider-Man">Spider-Man</option>
          <option value="Guardians of the Galaxy">Guardians of the Galaxy</option>
          <option value="Batman">Batman</option>
          <option value="Avatar">Avatar</option>
        </select>
      </div>

      {/* This field selects the number of people. */}
      <div style={{ minWidth: "140px" }}>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "6px" }}>
          People
        </p>
        <select
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#22222b",
            color: "white",
            border: "1px solid #333",
            borderRadius: "8px",
            outline: "none",
          }}
        >
          <option value="1">1 Person</option>
          <option value="2">2 People</option>
          <option value="3">3 People</option>
          <option value="4">4 People</option>
          <option value="5">5 People</option>
        </select>
      </div>

      {/* This button starts the booking action. */}
      <button
        onClick={handleBookNow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? "#3d68db" : "#4f7cff",
          color: "white",
          border: "none",
          padding: "14px 22px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          minWidth: "140px",
          marginTop: "24px",
          transition: "all 0.2s ease",
          transform: isHovered ? "translateY(-2px)" : "translateY(0px)",
          boxShadow: isHovered
            ? "0 8px 18px rgba(79,124,255,0.35)"
            : "none",
        }}
      >
        Book Now
      </button>
    </div>
  );
}