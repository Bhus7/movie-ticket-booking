"use client";

// This component shows movie posters in a simple auto slider.

import { useEffect, useState } from "react";

type Movie = {
  movie_id?: number;
  title: string;
  genre?: string;
  duration?: string;
  poster_url?: string;
  description?: string;
};

type HeroSliderProps = {
  movies?: Movie[];
};

export default function HeroSlider({ movies = [] }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // This default movie is used when no movie data is available.
  const defaultMovies: Movie[] = [
    {
      title: "Book your movie experience now",
      genre: "Now Showing",
      description:
        "Choose your favorite movie, select your seats, and enjoy the show with a simple booking experience.",
      poster_url:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // This line uses backend movies if available, otherwise it uses default movie data.
  const sliderMovies = movies.length > 0 ? movies : defaultMovies;

  // This effect changes slider image every 3 seconds.
  useEffect(() => {
    if (sliderMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderMovies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderMovies]);

  // This effect resets the slider index when movie data changes.
  useEffect(() => {
    setCurrentIndex(0);
  }, [movies]);

  const currentMovie = sliderMovies[currentIndex];

  // This fallback image is used if poster_url is missing.
  const imageUrl =
    currentMovie.poster_url ||
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";

  return (
    <div
      style={{
        height: "560px",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        padding: "60px",
        position: "relative",
      }}
    >
      {/* This overlay makes the text easier to read. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.88), rgba(0,0,0,0.45), rgba(0,0,0,0.75))",
        }}
      ></div>

      {/* This container holds the hero text content. */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "560px",
          color: "white",
          marginTop: "60px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#ff4d4d",
            marginBottom: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {currentMovie.genre || "Now Showing"}
        </p>

        <h1
          style={{
            fontSize: "54px",
            fontWeight: "bold",
            lineHeight: "1.1",
            marginBottom: "18px",
          }}
        >
          {currentMovie.title}
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#d1d5db",
            lineHeight: "1.7",
            marginBottom: "10px",
          }}
        >
          {currentMovie.description ||
            "Book your tickets with a smooth and simple movie ticket booking system."}
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "#f3f4f6",
            marginBottom: "24px",
          }}
        >
          Duration: {currentMovie.duration ? `${currentMovie.duration} min` : "N/A"}
        </p>

        <button
          style={{
            padding: "12px 22px",
            backgroundColor: "#ff4d4d",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Get Ticket
        </button>

        {/* This small row shows simple slider indicators. */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "28px",
          }}
        >
          {sliderMovies.map((_, index) => (
            <span
              key={index}
              style={{
                width: currentIndex === index ? "24px" : "10px",
                height: "10px",
                borderRadius: "999px",
                backgroundColor:
                  currentIndex === index ? "#ff4d4d" : "rgba(255,255,255,0.45)",
                display: "inline-block",
                transition: "0.3s",
              }}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}