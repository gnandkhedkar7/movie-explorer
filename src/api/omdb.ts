import type { MovieDetails, MovieSearchResponse } from "../types/movie";
import { fetchJson } from "./http";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query: string, page = 1): Promise<MovieSearchResponse> {
  return fetchJson<MovieSearchResponse>(
    `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
  );
}

export async function getMovieById(id: string): Promise<MovieDetails> {
  return fetchJson<MovieDetails>(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
}
