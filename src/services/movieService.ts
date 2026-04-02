import axios from 'axios';
import { Movie } from '../types/movie';


interface MovieResponse { 
  results: Movie[];
  total_pages: number
}

export const searchMovies = async (query: string, page: number): Promise<MovieResponse> => {

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    } 
  };
    
  const response = await axios.get<MovieResponse>(options.url, { headers: options.headers });      
  
  return response.data;
  
  

  };
