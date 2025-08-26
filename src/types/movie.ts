export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface MovieSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

export interface MovieDetails extends Movie {
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Runtime: string;
}
