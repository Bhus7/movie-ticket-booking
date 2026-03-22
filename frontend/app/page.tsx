// This imports Navbar component.
import Navbar from "./components/Navbar";

// This imports HeroSlider component.
import HeroSlider from "./components/HeroSlider";

// This imports BookingBar component.
import BookingBar from "./components/BookingBar";

// This imports MovieCard component.
import MovieCard from "./components/MovieCard";

// This function fetches movies from backend.
async function getMovies() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLLIC_API_URL}/api/movies`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.log("Backend is not running:", error);
    return [];
  }
}

// This component shows the home page layout.
export default async function HomePage() {
  const movies = await getMovies();

  return (
    <main
      style={{
        backgroundColor: "#0b0b0f",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* This section contains navbar and hero slider together */}
      <div style={{ position: "relative" }}>
        <Navbar />
        <HeroSlider movies={movies} />
      </div>

      {/* This section shows the booking filter bar below hero */}
      <BookingBar />

      {/* This section shows movies list */}
      <section
        style={{
          padding: "60px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Movies Now Playing
        </h2>

        {/* This condition checks if movies exist */}
        {movies.length === 0 ? (
          <p>No movies found right now.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {movies.map((movie: any) => (
              <MovieCard key={movie.movie_id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}