import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchMovies } from "../api/omdb";
import type { Movie, MovieSearchResponse } from "../types/movie";

// ---- Dark Mode Toggle ----
function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // ---- Favorites handling ----
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFav = (id: string) => favorites.includes(id);

  // ---- Search effect ----
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setError(null);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res: MovieSearchResponse = await searchMovies(query, page);

        if (res.Response === "True" && res.Search) {
          setMovies(res.Search);
          setError(null);
        } else {
          setMovies([]);
          setError(res.Error ?? "Unknown error");
        }
      } catch (err) {
        setMovies([]);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [query, page]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🎬 Movie Explorer</h1>
      {/*   <DarkModeToggle /> */}
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Search Bar */}
        <div className="flex items-center max-w-md w-full mx-auto mb-6 relative">
          <span className="absolute pl-3 text-gray-400">🔍</span>
          <input
            className="w-full pl-10 pr-4 py-2 rounded-full border shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1); // reset page on new search
            }}
            placeholder="Search movies..."
          />
        </div>

        {/* Empty State */}
        {!query && (
          <p className="text-center text-gray-500 mt-10">
            Start typing to search movies 🎬
          </p>
        )}

        {/* Error State */}
        {error && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center my-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && movies.length > 0 && (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow"
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                  alt={movie.Title}
                  className="h-72 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {movie.Title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {movie.Year}
                  </p>
                  <div className="flex justify-between mt-3">
                    <Link
                      to={`/movie/${movie.imdbID}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => toggleFavorite(movie.imdbID)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        isFav(movie.imdbID)
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {isFav(movie.imdbID) ? "★ Fav" : "☆ Fav"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {movies.length > 0 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
