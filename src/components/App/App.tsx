import { ComponentType, useEffect, useState } from 'react'
import SearchBar from "../SearchBar/SearchBar";
import css from './App.module.css'
import { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { searchMovies } from '../../services/movieService';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginateModule, { ReactPaginateProps } from 'react-paginate';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;


export default function App() {
  const [query, setQuery] = useState('');
  const [selectMovie, setSelectMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);


  const { data, isError, isLoading } = useQuery({
    queryKey: ['movie', query, currentPage],
    queryFn: () => searchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newMovie: string) => {
    setCurrentPage(1);
    setQuery(newMovie);
  }

  useEffect(() => {
  if (data && data.results.length === 0) {
    toast.error("No movies found for your request");
  }
}, [data]);

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <Toaster
      position="top-center"
      reverseOrder={true}
      />
      <SearchBar onSubmit={handleSearch} />
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Loader isLoading={isLoading}/>
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && <MovieGrid movies={data.results} onSelect={(movie) => setSelectMovie(movie)} />} 
      {selectMovie && <MovieModal movie={selectMovie} onClose={() => setSelectMovie(null)} />}
    </div>  
  )
}

