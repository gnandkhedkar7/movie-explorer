import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import type { Movie } from "../types/movie";

export function MovieCard({ movie }: { movie: Movie }) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(movie.imdbID);

  return (
    <div className="border p-2 rounded-md shadow-sm">
      <img src={movie.Poster} alt={movie.Title} className="h-64 w-full object-cover" />
      <h3 className="text-lg font-semibold">{movie.Title}</h3>
      <p>{movie.Year}</p>
      <div className="flex justify-between mt-2">
        <Link to={`/movie/${movie.imdbID}`} className="text-blue-500 underline">
          Details
        </Link>
        <button
          aria-pressed={isFav}
          onClick={() => toggleFavorite(movie.imdbID)}
          className="px-2 py-1 border rounded"
        >
          {isFav ? "★ Fav" : "☆ Fav"}
        </button>
      </div>
    </div>
  );
}
