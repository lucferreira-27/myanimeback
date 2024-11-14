import { ClockIcon, StarIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/solid';
import AnalysisConfig from '../AnalysisConfig';
import { AnimeDetails } from '../../types/anime';

interface AnimeHeroProps {
  anime: AnimeDetails;
  onStartAnalysis: (config: any) => Promise<void>;
  isAnalyzing: boolean;
}

export const AnimeHero = ({ anime, onStartAnalysis, isAnalyzing }: AnimeHeroProps) => {
  return (
    <div className="relative h-[500px]">
      <div className="absolute inset-0">
        <img
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 20%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
        <div className="flex items-end space-x-8 w-full">
          <img
            src={anime.images.webp.image_url}
            alt={anime.title}
            className="w-48 rounded-lg shadow-xl ring-1 ring-gray-700/50 mb-4"
          />
          <div className="flex-1 mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-white mb-4">{anime.title}</h1>
              <AnalysisConfig onStartAnalysis={onStartAnalysis} isLoading={isAnalyzing} />
            </div>
            <div className="flex items-center space-x-6 text-gray-300">
              <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{anime.score}</span>
              </div>
              <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <UsersIcon className="w-5 h-5 text-blue-400 mr-1" />
                <span>{(anime.members / 1000000).toFixed(1)}M members</span>
              </div>
              <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full">
                <CalendarIcon className="w-5 h-5 text-purple-400 mr-1" />
                <span>{anime.year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
