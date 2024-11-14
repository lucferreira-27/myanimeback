import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { AnimeDetails, HistoricalData } from '../../types/anime';

interface HistoricalPerformanceProps {
  anime: AnimeDetails;
  historicalData: HistoricalData;
}

export const HistoricalPerformance = ({ anime, historicalData }: HistoricalPerformanceProps) => {
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const getLastTwoMonths = (data: number[]) => {
    return [data[data.length - 2], data[data.length - 1]];
  };

  const [prevScore, currentScore] = getLastTwoMonths(historicalData.scores);
  const [prevRank, currentRank] = getLastTwoMonths(historicalData.ranks);
  const [prevMembers, currentMembers] = getLastTwoMonths(historicalData.members);
  const [prevFavorites, currentFavorites] = getLastTwoMonths(historicalData.favorites);

  const peakScore = Math.max(...historicalData.scores);
  const peakRank = Math.min(...historicalData.ranks);
  const peakMembers = Math.max(...historicalData.members);
  const peakFavorites = Math.max(...historicalData.favorites);

  const getPeakDate = (data: number[], peak: number) => {
    const index = data.indexOf(peak);
    return historicalData.dates[index];
  };

  return (
    <>
      {/* Score Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="text-sm text-gray-400">Score Performance</div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">{currentScore}</div>
            <div
              className={`flex items-center text-sm ${
                Number(calculateChange(currentScore, prevScore)) >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {Number(calculateChange(currentScore, prevScore)) >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(Number(calculateChange(currentScore, prevScore)))}%
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-400 text-sm">
              <TrophyIcon className="w-3 h-3 mr-1" />
              {peakScore}
            </div>
            <div className="text-xs text-gray-400">
              {getPeakDate(historicalData.scores, peakScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Rank Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="text-sm text-gray-400">Rank Performance</div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">#{currentRank}</div>
            <div
              className={`flex items-center text-sm ${
                Number(calculateChange(prevRank, currentRank)) >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {Number(calculateChange(prevRank, currentRank)) >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(Number(calculateChange(prevRank, currentRank)))}%
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-400 text-sm">
              <TrophyIcon className="w-3 h-3 mr-1" />#{peakRank}
            </div>
            <div className="text-xs text-gray-400">
              {getPeakDate(historicalData.ranks, peakRank)}
            </div>
          </div>
        </div>
      </div>

      {/* Member Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="text-sm text-gray-400">Member Growth</div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">{(currentMembers / 1000).toFixed(1)}K</div>
            <div
              className={`flex items-center text-sm ${
                Number(calculateChange(currentMembers, prevMembers)) >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {Number(calculateChange(currentMembers, prevMembers)) >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(Number(calculateChange(currentMembers, prevMembers)))}%
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-400 text-sm">
              <TrophyIcon className="w-3 h-3 mr-1" />
              {(peakMembers / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-gray-400">
              {getPeakDate(historicalData.members, peakMembers)}
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="text-sm text-gray-400">Favorites</div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">{(currentFavorites / 1000).toFixed(1)}K</div>
            <div
              className={`flex items-center text-sm ${
                Number(calculateChange(currentFavorites, prevFavorites)) >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {Number(calculateChange(currentFavorites, prevFavorites)) >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(Number(calculateChange(currentFavorites, prevFavorites)))}%
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-400 text-sm">
              <TrophyIcon className="w-3 h-3 mr-1" />
              {(peakFavorites / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-gray-400">
              {getPeakDate(historicalData.favorites, peakFavorites)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
