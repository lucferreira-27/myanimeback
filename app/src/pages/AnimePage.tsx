import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { AnimeHero } from '../components/anime/AnimeHero';

import { QuickStats } from '../components/anime/QuickStats';

import { HistoricalPerformance } from '../components/anime/HistoricalPerformance';

import { ChartSection } from '../components/anime/ChartSection';

import { SideStats } from '../components/anime/SideStats';

import { AnimeDetails, HistoricalData, AnalysisSettings } from '../types/anime';

import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import { UsersIcon, HeartIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface KitsuAnimeImages {
  coverImage?: {
    large?: string;
    original?: string;
  };
  posterImage?: {
    large?: string;
    original?: string;
  };
}

const AnimePage = () => {
  const { id } = useParams<{ id: string }>();

  const [anime, setAnime] = useState<AnimeDetails | null>(null);

  const [kitsuImages, setKitsuImages] = useState<KitsuAnimeImages | null>(null);

  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAnimeData = async () => {
      setLoading(true);

      try {
        // Fetch MAL data
        const malResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        const malData = await malResponse.json();

        // Fetch Kitsu data
        try {
          // First get the Kitsu anime ID using MAL ID
          const kitsuMappingResponse = await fetch(
            `https://kitsu.io/api/edge/mappings?filter[externalSite]=myanimelist/anime&filter[externalId]=${id}`,
            {
              headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
              },
            }
          );
          const kitsuMappingData = await kitsuMappingResponse.json();

          // Extract the Kitsu anime ID from the mapping response
          const kitsuId = kitsuMappingData.data?.[0]?.relationships?.item?.data?.id;

          if (kitsuId) {
            // Then fetch the actual anime data using Kitsu ID
            const kitsuAnimeResponse = await fetch(
              `https://kitsu.io/api/edge/anime/${kitsuId}?fields[anime]=coverImage,posterImage`,
              {
                headers: {
                  Accept: 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json',
                },
              }
            );
            const kitsuAnimeData = await kitsuAnimeResponse.json();

            // Extract image data from Kitsu response
            const attributes = kitsuAnimeData.data?.attributes;
            if (attributes) {
              setKitsuImages({
                coverImage: {
                  large: attributes.coverImage?.large || null,
                  original: attributes.coverImage?.original || null,
                },
                posterImage: {
                  large: attributes.posterImage?.large || null,
                  original: attributes.posterImage?.original || null,
                },
              });
            }
          }
        } catch (kitsuError) {
          console.warn('Failed to fetch Kitsu data:', kitsuError);
          // Continue with MAL images if Kitsu fails
        }

        setAnime(malData.data);

        // Simulate historical data
        const dates = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });

        setHistoricalData({
          dates,
          scores: Array.from(
            { length: 12 },
            (_, i) => +(Math.random() * 0.5 + (malData.data.score - 0.5)).toFixed(2)
          ),
          ranks: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 1),
          members: Array.from({ length: 12 }, (_, i) =>
            Math.floor(malData.data.members * (0.7 + (i * 0.3) / 11))
          ),
          favorites: Array.from({ length: 12 }, (_, i) =>
            Math.floor(malData.data.favorites * (0.7 + (i * 0.3) / 11))
          ),
          reviews: Array.from({ length: 12 }, () => ({
            positive: Math.floor(Math.random() * 1000),
            negative: Math.floor(Math.random() * 200),
          })),
        });
      } catch (err) {
        setError('Failed to load anime data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeData();
    }
  }, [id]);

  const handleStartAnalysis = async (config: AnalysisSettings) => {
    setIsAnalyzing(true);

    try {
      console.log('Starting analysis with config:', config);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !anime || !historicalData) {
    return <ErrorState error={error} />;
  }

  // Merge MAL and Kitsu images, preferring Kitsu when available
  const images = {
    webp: {
      image_url: kitsuImages?.posterImage?.large || anime.images.webp.image_url,
      large_image_url: kitsuImages?.coverImage?.original || anime.images.webp.large_image_url,
    },
    kitsu: kitsuImages, // Store the original Kitsu images
  };

  const animeWithImages = {
    ...anime,
    images,
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AnimeHero
        anime={animeWithImages}
        onStartAnalysis={handleStartAnalysis}
        isAnalyzing={isAnalyzing}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <div className="grid grid-cols-7 gap-6">
          {/* Main content - 5 columns */}
          <div className="col-span-5 space-y-6">
            {/* Historical Performance row - 4 items */}
            <div className="grid grid-cols-4 gap-4">
              <HistoricalPerformance anime={animeWithImages} historicalData={historicalData} />
            </div>

            {/* Charts */}
            <div className="space-y-6">
              <ChartSection historicalData={historicalData} />
            </div>
          </div>

          {/* Side stats - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Member Growth */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-4">
                <UsersIcon className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold">Member Growth</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Members</div>
                  <div className="text-2xl font-bold">{(anime.members / 1000000).toFixed(2)}M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Monthly Growth</div>
                  <div className="text-lg">
                    +{((historicalData.members[11] - historicalData.members[10]) / 1000).toFixed(1)}
                    K
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Growth Rate</div>
                  <div className="text-sm">
                    {(
                      ((historicalData.members[11] - historicalData.members[0]) /
                        historicalData.members[0]) *
                      100
                    ).toFixed(1)}
                    % over last year
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Growth */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-4">
                <HeartIcon className="w-5 h-5 text-red-400 mr-2" />
                <h3 className="text-lg font-semibold">Favorites Growth</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Favorites</div>
                  <div className="text-2xl font-bold">{(anime.favorites / 1000).toFixed(1)}K</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Monthly Growth</div>
                  <div className="text-lg">
                    +
                    {((historicalData.favorites[11] - historicalData.favorites[10]) / 1000).toFixed(
                      1
                    )}
                    K
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Growth Rate</div>
                  <div className="text-sm">
                    {(
                      ((historicalData.favorites[11] - historicalData.favorites[0]) /
                        historicalData.favorites[0]) *
                      100
                    ).toFixed(1)}
                    % over last year
                  </div>
                </div>
              </div>
            </div>

            {/* Information section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-4">
                <InformationCircleIcon className="w-5 h-5 text-yellow-400 mr-2" />
                <h3 className="text-lg font-semibold">Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Studios</div>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.map(studio => (
                      <span
                        key={studio.name}
                        className="px-2 py-1 bg-gray-700/50 rounded-full text-sm"
                      >
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Genres</div>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map(genre => (
                      <span
                        key={genre.name}
                        className="px-2 py-1 bg-gray-700/50 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
