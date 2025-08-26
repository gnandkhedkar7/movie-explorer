import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { MovieDetails } from "../types/movie";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // ---- Favorites handling ----
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFav = (id: string) => favorites.includes(id);

  // ---- Load movie details ----
  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getMovieDetails(id);
        if (res.Response === "True") {
          setMovie(res);
          setError(null);
        } else {
          setMovie(null);
          setError(res.Error ?? "Movie not found");
        }
      } catch (err) {
        setMovie(null);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!movie) {
    return <p className="text-center text-gray-500 mt-10">No movie found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-block mb-6 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ← Back
        </Link>

        {/* Movie Layout */}
        <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
              alt={movie.Title}
              className="w-64 h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {movie.Year} • {movie.Runtime} • {movie.Genre}
              </p>

              <p className="mb-4">{movie.Plot}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-semibold">Director:</span>{" "}
                  {movie.Director}
                </p>
                <p>
                  <span className="font-semibold">Writer:</span> {movie.Writer}
                </p>
                <p>
                  <span className="font-semibold">Actors:</span> {movie.Actors}
                </p>
                <p>
                  <span className="font-semibold">Language:</span>{" "}
                  {movie.Language}
                </p>
                <p>
                  <span className="font-semibold">Awards:</span> {movie.Awards}
                </p>
                <p>
                  <span className="font-semibold">IMDB Rating:</span>{" "}
                  ⭐ {movie.imdbRating}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => toggleFavorite(movie.imdbID)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isFav(movie.imdbID)
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {isFav(movie.imdbID) ? "★ Favorited" : "☆ Add to Favorites"}
              </button>
              {movie.Website && movie.Website !== "N/A" && (
                <a
                  href={movie.Website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
