import { Fragment } from 'react';



import { StarIcon, CalendarIcon, FilmIcon } from '@heroicons/react/24/solid';



interface AnimeResult {

  mal_id: number;



  title: string;



  images: {

    webp: {

      image_url: string;



      small_image_url: string;

    };

  };



  type: string;



  score: number;



  year: number;



  synopsis: string;

}



interface SearchResultsProps {

  results: AnimeResult[];



  loading: boolean;



  selectedIndex: number;



  onResultClick: (result: AnimeResult) => void;



  onMouseEnter: (index: number) => void;

}



const SearchResults = ({

  results,



  loading,



  selectedIndex,



  onResultClick,



  onMouseEnter,

}: SearchResultsProps) => {

  if (!results.length && !loading) return null;



  return (

    <div className="absolute top-full left-0 right-0 mt-2" style={{ zIndex: 100 }}>

      <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-xl overflow-hidden">

        {/* Gradient borders */}



        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>



        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>



        {/* Scrollable content */}



        <div

          className="max-h-[348px] overflow-y-auto scroll-smooth"

          style={{

            scrollbarWidth: 'thin',



            scrollbarColor: 'rgb(59 130 246 / 0.5) transparent',

          }}

        >

          <div className="py-2">

            {loading

              ? // Loading skeletons - always show 3



                [...Array(3)].map((_, i) => (

                  <div key={i} className="px-4">

                    <div className="flex items-center space-x-4 py-4 animate-pulse">

                      <div className="w-16 h-20 bg-gray-700/50 rounded"></div>



                      <div className="flex-1">

                        <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>



                        <div className="h-3 bg-gray-700/50 rounded w-1/2 mb-2"></div>



                        <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>

                      </div>

                    </div>



                    {i < 2 && <div className="border-t border-gray-700/50"></div>}

                  </div>

                ))

              : results.map((result, index) => (

                  <Fragment key={result.mal_id}>

                    <div className="px-4">

                      <div

                        className={`py-4 hover:bg-gray-700/30 transition-colors cursor-pointer flex space-x-4 rounded-lg ${

                          selectedIndex === index ? 'bg-gray-700/30' : ''

                        }`}

                        onClick={() => onResultClick(result)}

                        onMouseEnter={() => onMouseEnter(index)}

                        role="option"

                        aria-selected={selectedIndex === index}

                      >

                        <img

                          src={result.images.webp.small_image_url}

                          alt={result.title}

                          className="w-16 h-20 object-cover rounded shadow-md"

                        />



                        <div className="flex-1 min-w-0">

                          <h3 className="text-white font-medium mb-1 truncate">{result.title}</h3>



                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">

                            <div className="flex items-center">

                              <FilmIcon className="w-4 h-4 mr-1" />



                              {result.type}

                            </div>



                            {result.score > 0 && (

                              <div className="flex items-center">

                                <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />



                                {result.score}

                              </div>

                            )}



                            {result.year && (

                              <div className="flex items-center">

                                <CalendarIcon className="w-4 h-4 mr-1" />



                                {result.year}

                              </div>

                            )}

                          </div>



                          <p className="text-sm text-gray-400 line-clamp-2">{result.synopsis}</p>

                        </div>

                      </div>

                    </div>



                    {index < results.length - 1 && (

                      <div className="mx-4 border-t border-gray-700/50"></div>

                    )}

                  </Fragment>

                ))}

          </div>

        </div>

      </div>

    </div>

  );

};



export default SearchResults;


