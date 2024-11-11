import { AnimeDetails } from '../../types/anime';

interface QuickStatsProps {
  anime: AnimeDetails;
}

export const QuickStats = ({ anime }: QuickStatsProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-8">
      <div className="grid grid-cols-4 divide-x divide-gray-700/50">
        <div className="px-4">
          <div className="text-sm text-gray-400">Current Rank</div>
          <div className="text-xl font-semibold text-white">#{anime.rank}</div>
        </div>
        <div className="px-4">
          <div className="text-sm text-gray-400">Popularity</div>
          <div className="text-xl font-semibold text-white">#{anime.popularity}</div>
        </div>
        <div className="px-4">
          <div className="text-sm text-gray-400">Favorites</div>
          <div className="text-xl font-semibold text-white">{anime.favorites.toLocaleString()}</div>
        </div>
        <div className="px-4">
          <div className="text-sm text-gray-400">Season</div>
          <div className="text-xl font-semibold text-white capitalize">
            {anime.season ? `${anime.season} ${anime.year}` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}; 