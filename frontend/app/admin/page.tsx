"use client";

// This page shows a simple full admin dashboard in one file.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Movie = {
  movie_id: number;
  title: string;
  genre: string;
  duration: number;
  poster_url: string;
  description: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingMovieId, setEditingMovieId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editPosterUrl, setEditPosterUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // This function checks whether the admin token is valid.
  const checkAdminAccess = () => {
    const token = localStorage.getItem("adminToken");

    // This redirects to login if token is missing.
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const tokenParts = token.split(".");

      // This checks whether token format is correct.
      if (tokenParts.length !== 3) {
        localStorage.removeItem("adminToken");
        router.push("/login");
        return;
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      // This checks whether the role inside token is admin.
      if (payload.role !== "admin") {
        localStorage.removeItem("adminToken");
        router.push("/login");
        return;
      }

      setIsCheckingAdmin(false);
    } catch (error) {
      localStorage.removeItem("adminToken");
      router.push("/login");
    }
  };

  // This effect checks admin access when page opens.
  useEffect(() => {
    checkAdminAccess();
  }, []);

  // This function gets all movies from the backend.
  const fetchMovies = async () => {
    try {
      setMoviesLoading(true);

      const response = await fetch("http://localhost:5001/api/movies");
      const data = await response.json();

      if (response.ok) {
        setMovies(data);
      } else {
        console.log("Failed to fetch movies");
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
    } finally {
      setMoviesLoading(false);
    }
  };

  // This effect loads movies after admin check is complete.
  useEffect(() => {
    if (!isCheckingAdmin) {
      fetchMovies();
    }
  }, [isCheckingAdmin]);

  // This function removes admin token and logs out admin.
  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  // This function sends movie data to the backend.
  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    // This checks if any field is empty.
    if (!title || !genre || !duration || !posterUrl || !description) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // This gets admin token from local storage.
      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://localhost:5001/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          genre,
          duration: Number(duration),
          poster_url: posterUrl,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Movie added successfully.");
        setTitle("");
        setGenre("");
        setDuration("");
        setPosterUrl("");
        setDescription("");
        fetchMovies();
        setActiveSection("movies");
      } else {
        setMessage(data.message || "Failed to add movie.");
      }
    } catch (error) {
      console.log("Error adding movie:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // This function starts movie edit mode.
  const handleStartEdit = (movie: Movie) => {
    setEditingMovieId(movie.movie_id);
    setEditTitle(movie.title);
    setEditGenre(movie.genre);
    setEditDuration(String(movie.duration));
    setEditPosterUrl(movie.poster_url);
    setEditDescription(movie.description);
    setMessage("");
  };

  // This function cancels movie edit mode.
  const handleCancelEdit = () => {
    setEditingMovieId(null);
    setEditTitle("");
    setEditGenre("");
    setEditDuration("");
    setEditPosterUrl("");
    setEditDescription("");
  };

  // This function updates movie data in the backend.
  const handleUpdateMovie = async (movieId: number) => {
    setMessage("");

    // This checks if any edit field is empty.
    if (
      !editTitle ||
      !editGenre ||
      !editDuration ||
      !editPosterUrl ||
      !editDescription
    ) {
      setMessage("Please fill in all edit fields.");
      return;
    }

    try {
      setEditLoading(true);

      // This gets admin token from local storage.
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`http://localhost:5001/api/movies/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          genre: editGenre,
          duration: Number(editDuration),
          poster_url: editPosterUrl,
          description: editDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Movie updated successfully.");
        setEditingMovieId(null);
        fetchMovies();
      } else {
        setMessage(data.message || "Failed to update movie.");
      }
    } catch (error) {
      console.log("Error updating movie:", error);
      setMessage("Something went wrong while updating.");
    } finally {
      setEditLoading(false);
    }
  };

  // This function deletes a movie from the backend.
  const handleDeleteMovie = async (movieId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");

    try {
      // This gets admin token from local storage.
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`http://localhost:5001/api/movies/${movieId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Movie deleted successfully.");
        fetchMovies();

        if (editingMovieId === movieId) {
          handleCancelEdit();
        }
      } else {
        setMessage(data.message || "Failed to delete movie.");
      }
    } catch (error) {
      console.log("Error deleting movie:", error);
      setMessage("Something went wrong while deleting.");
    }
  };

  // This function returns sidebar button styles.
  const getMenuStyle = (sectionName: string) => {
    const isActive = activeSection === sectionName;

    return {
      width: "100%",
      textAlign: "left" as const,
      padding: "12px 14px",
      marginBottom: "10px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      backgroundColor: isActive ? "#ff4d4d" : "transparent",
      color: "white",
      fontSize: "15px",
    };
  };

  // This function renders dashboard content.
  const renderDashboard = () => {
    return (
      <div>
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: "#d1d5db",
            marginBottom: "30px",
          }}
        >
          Welcome to the admin dashboard.
        </p>

        {message && (
          <p
            style={{
              marginBottom: "20px",
              color: message.includes("successfully") ? "#22c55e" : "#f87171",
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              backgroundColor: "#111827",
              padding: "22px",
              borderRadius: "12px",
              border: "1px solid #1f2937",
            }}
          >
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "10px",
              }}
            >
              Total Movies
            </p>

            <h2
              style={{
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              {moviesLoading ? "..." : movies.length}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#111827",
              padding: "22px",
              borderRadius: "12px",
              border: "1px solid #1f2937",
            }}
          >
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "10px",
              }}
            >
              Total Theaters
            </p>

            <h2
              style={{
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              0
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#111827",
              padding: "22px",
              borderRadius: "12px",
              border: "1px solid #1f2937",
            }}
          >
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "10px",
              }}
            >
              Total Shows
            </p>

            <h2
              style={{
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              0
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#111827",
              padding: "22px",
              borderRadius: "12px",
              border: "1px solid #1f2937",
            }}
          >
            <p
              style={{
                color: "#9ca3af",
                marginBottom: "10px",
              }}
            >
              Total Bookings
            </p>

            <h2
              style={{
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              0
            </h2>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#111827",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #1f2937",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Quick Actions
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setActiveSection("addMovie")}
              style={{
                padding: "12px 20px",
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Add Movie
            </button>

            <button
              onClick={() => setActiveSection("movies")}
              style={{
                padding: "12px 20px",
                backgroundColor: "#1f2937",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              View Movies
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#111827",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #1f2937",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Recent Movies
          </h2>

          {moviesLoading ? (
            <p style={{ color: "#d1d5db" }}>Loading movies...</p>
          ) : movies.length === 0 ? (
            <p style={{ color: "#d1d5db" }}>No movies found.</p>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {movies.slice(0, 5).map((movie) => (
                <div
                  key={movie.movie_id}
                  style={{
                    backgroundColor: "#1f2937",
                    padding: "16px",
                    borderRadius: "10px",
                    border: "1px solid #374151",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "6px",
                    }}
                  >
                    {movie.title}
                  </h3>

                  <p style={{ color: "#d1d5db", marginBottom: "4px" }}>
                    Genre: {movie.genre}
                  </p>

                  <p style={{ color: "#d1d5db" }}>
                    Duration: {movie.duration} min
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // This function renders all movies.
  const renderMovies = () => {
    return (
      <div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Movies
        </h1>

        <p
          style={{
            color: "#d1d5db",
            marginBottom: "20px",
          }}
        >
          View, edit, and delete all movies added to the system.
        </p>

        {message && (
          <p
            style={{
              marginBottom: "20px",
              color: message.includes("successfully") ? "#22c55e" : "#f87171",
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            backgroundColor: "#111827",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #1f2937",
          }}
        >
          {moviesLoading ? (
            <p style={{ color: "#d1d5db" }}>Loading movies...</p>
          ) : movies.length === 0 ? (
            <p style={{ color: "#d1d5db" }}>No movies found.</p>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {movies.map((movie) => (
                <div
                  key={movie.movie_id}
                  style={{
                    backgroundColor: "#1f2937",
                    borderRadius: "10px",
                    padding: "18px",
                    border: "1px solid #374151",
                  }}
                >
                  {editingMovieId === movie.movie_id ? (
                    <div>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                          Movie Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #374151",
                            backgroundColor: "#111827",
                            color: "white",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                          Genre
                        </label>
                        <input
                          type="text"
                          value={editGenre}
                          onChange={(e) => setEditGenre(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #374151",
                            backgroundColor: "#111827",
                            color: "white",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                          Duration in minutes
                        </label>
                        <input
                          type="number"
                          value={editDuration}
                          onChange={(e) => setEditDuration(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #374151",
                            backgroundColor: "#111827",
                            color: "white",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                          Poster URL
                        </label>
                        <input
                          type="text"
                          value={editPosterUrl}
                          onChange={(e) => setEditPosterUrl(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #374151",
                            backgroundColor: "#111827",
                            color: "white",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", marginBottom: "8px" }}>
                          Description
                        </label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={5}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #374151",
                            backgroundColor: "#111827",
                            color: "white",
                            outline: "none",
                            resize: "vertical",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginTop: "14px",
                        }}
                      >
                        <button
                          onClick={() => handleUpdateMovie(movie.movie_id)}
                          disabled={editLoading}
                          style={{
                            padding: "10px 18px",
                            backgroundColor: "#22c55e",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          {editLoading ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: "10px 18px",
                            backgroundColor: "#6b7280",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-start",
                      }}
                    >
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        style={{
                          width: "90px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                          }}
                        >
                          {movie.title}
                        </h3>

                        <p
                          style={{
                            color: "#d1d5db",
                            marginBottom: "6px",
                          }}
                        >
                          Genre: {movie.genre}
                        </p>

                        <p
                          style={{
                            color: "#d1d5db",
                            marginBottom: "6px",
                          }}
                        >
                          Duration: {movie.duration} min
                        </p>

                        <p
                          style={{
                            color: "#d1d5db",
                            lineHeight: "1.6",
                            marginBottom: "14px",
                          }}
                        >
                          {movie.description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => handleStartEdit(movie)}
                            style={{
                              padding: "10px 18px",
                              backgroundColor: "#3b82f6",
                              border: "none",
                              borderRadius: "8px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteMovie(movie.movie_id)}
                            style={{
                              padding: "10px 18px",
                              backgroundColor: "#ef4444",
                              border: "none",
                              borderRadius: "8px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // This function renders the add movie form.
  const renderAddMovie = () => {
    return (
      <div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Add Movie
        </h1>

        <p
          style={{
            color: "#d1d5db",
            marginBottom: "30px",
          }}
        >
          Add a new movie to the system.
        </p>

        {message && (
          <p
            style={{
              marginBottom: "20px",
              color: message.includes("successfully") ? "#22c55e" : "#f87171",
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            backgroundColor: "#111827",
            padding: "30px",
            borderRadius: "12px",
            border: "1px solid #1f2937",
            maxWidth: "800px",
          }}
        >
          <form onSubmit={handleAddMovie}>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Movie Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter movie title"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Enter genre"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Duration in minutes
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Poster URL
              </label>
              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="Enter poster image URL"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter movie description"
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "white",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 24px",
                backgroundColor: "#ff4d4d",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {loading ? "Adding..." : "Add Movie"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // This function renders placeholder sections.
  const renderPlaceholder = (title: string) => {
    return (
      <div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          {title}
        </h1>

        <div
          style={{
            backgroundColor: "#111827",
            padding: "30px",
            borderRadius: "12px",
            border: "1px solid #1f2937",
            marginTop: "20px",
          }}
        >
          <p style={{ color: "#d1d5db", fontSize: "16px" }}>
            {title} section coming soon.
          </p>
        </div>
      </div>
    );
  };

  // This function decides which section to show.
  const renderContent = () => {
    if (activeSection === "dashboard") {
      return renderDashboard();
    }

    if (activeSection === "movies") {
      return renderMovies();
    }

    if (activeSection === "addMovie") {
      return renderAddMovie();
    }

    if (activeSection === "theaters") {
      return renderPlaceholder("Theaters");
    }

    if (activeSection === "shows") {
      return renderPlaceholder("Shows");
    }

    if (activeSection === "bookings") {
      return renderPlaceholder("Bookings");
    }

    if (activeSection === "users") {
      return renderPlaceholder("Users");
    }

    return renderDashboard();
  };

  // This shows loading text while admin token is being checked.
  if (isCheckingAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0b0f19",
          color: "white",
          fontSize: "20px",
        }}
      >
        Checking admin access...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#0b0f19",
        color: "white",
      }}
    >
      <div
        style={{
          width: "250px",
          backgroundColor: "#111827",
          padding: "24px 18px",
          borderRight: "1px solid #1f2937",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Admin Panel
        </h2>

        <button
          onClick={() => setActiveSection("dashboard")}
          style={getMenuStyle("dashboard")}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveSection("movies")}
          style={getMenuStyle("movies")}
        >
          Movies
        </button>

        <button
          onClick={() => setActiveSection("addMovie")}
          style={getMenuStyle("addMovie")}
        >
          Add Movie
        </button>

        <button
          onClick={() => setActiveSection("theaters")}
          style={getMenuStyle("theaters")}
        >
          Theaters
        </button>

        <button
          onClick={() => setActiveSection("shows")}
          style={getMenuStyle("shows")}
        >
          Shows
        </button>

        <button
          onClick={() => setActiveSection("bookings")}
          style={getMenuStyle("bookings")}
        >
          Bookings
        </button>

        <button
          onClick={() => setActiveSection("users")}
          style={getMenuStyle("users")}
        >
          Users
        </button>

        <button
          onClick={handleAdminLogout}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "12px 14px",
            marginTop: "20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#dc2626",
            color: "white",
            fontSize: "15px",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}