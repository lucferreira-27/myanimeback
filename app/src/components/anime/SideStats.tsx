import {
  UsersIcon,
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  ChartBarIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid';
import { AnimeDetails, HistoricalData } from '../../types/anime';

interface ArchiveMetadata {
  snapshotCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  sources: string[];
  lastAnalysis: string;
  dataQuality: 'High' | 'Medium' | 'Low';
}

interface SideStatsProps {
  anime: AnimeDetails;
  historicalData: HistoricalData;
  archiveMetadata?: ArchiveMetadata;
}

export const SideStats = ({
  anime,
  historicalData,
  archiveMetadata = {
    snapshotCount: 24,
    dateRange: {
      start: '2023-01',
      end: '2023-12',
    },
    sources: ['MyAnimeList', 'Wayback Machine'],
    lastAnalysis: '2024-03-15',
    dataQuality: 'High',
  },
}: SideStatsProps) => {
  const latestReviews = historicalData.reviews[historicalData.reviews.length - 1];
  const previousReviews = historicalData.reviews[historicalData.reviews.length - 2];
  const totalReviews = latestReviews.positive + latestReviews.negative;
  const positivePercentage = ((latestReviews.positive / totalReviews) * 100).toFixed(1);

  // Calculate review trends
  const reviewTrend = {
    positive: latestReviews.positive - previousReviews.positive,
    negative: latestReviews.negative - previousReviews.negative,
  };

  // Find peak review period
  const getTotalReviews = (review: { positive: number; negative: number }) =>
    review.positive + review.negative;

  const peakReviewIndex = historicalData.reviews.reduce(
    (maxIndex, review, index, array) =>
      getTotalReviews(review) > getTotalReviews(array[maxIndex]) ? index : maxIndex,
    0
  );

  const peakReviews = historicalData.reviews[peakReviewIndex];

  return (
    <div className="space-y-6">
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
              +{((historicalData.members[11] - historicalData.members[10]) / 1000).toFixed(1)}K
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

      {/* Review Sentiment */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center mb-4">
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold">Review Analysis</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Current Sentiment</span>
            <span className="text-green-400">{positivePercentage}% Positive</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${positivePercentage}%` }}
            ></div>
          </div>

          {/* Review Trends */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-400">Positive</div>
              <div className="text-lg font-semibold text-green-400">
                {latestReviews.positive}
                <span
                  className={`text-sm ml-1 ${
                    reviewTrend.positive >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ({reviewTrend.positive >= 0 ? '+' : ''}
                  {reviewTrend.positive})
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Negative</div>
              <div className="text-lg font-semibold text-red-400">
                {latestReviews.negative}
                <span
                  className={`text-sm ml-1 ${
                    reviewTrend.negative <= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ({reviewTrend.negative >= 0 ? '+' : ''}
                  {reviewTrend.negative})
                </span>
              </div>
            </div>
          </div>

          {/* Peak Review Period */}
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center text-yellow-400 text-sm mb-2">
              <TrophyIcon className="w-4 h-4 mr-1" />
              Peak Review Period
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Total Reviews:</span>
                <span>{getTotalReviews(peakReviews)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Positive Ratio:</span>
                <span className="text-green-400">
                  {((peakReviews.positive / getTotalReviews(peakReviews)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span>{historicalData.dates[peakReviewIndex]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Information section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center mb-4">
          <InformationCircleIcon className="w-5 h-5 text-yellow-400 mr-2" />
          <h3 className="text-lg font-semibold">Information</h3>
        </div>
        <div className="space-y-6">
          {/* Archive Metadata */}
          <div>
            <div className="text-sm text-gray-400 mb-3">Archive Details</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Snapshots:</span>
                <span className="text-sm">{archiveMetadata.snapshotCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Date Range:</span>
                <span className="text-sm">
                  {archiveMetadata.dateRange.start} - {archiveMetadata.dateRange.end}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Last Analysis:</span>
                <span className="text-sm">{archiveMetadata.lastAnalysis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Data Quality:</span>
                <span
                  className={`text-sm ${
                    archiveMetadata.dataQuality === 'High'
                      ? 'text-green-400'
                      : archiveMetadata.dataQuality === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {archiveMetadata.dataQuality}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="text-sm text-gray-400 mb-3">Data Sources</div>
            <div className="flex flex-wrap gap-2">
              {archiveMetadata.sources.map(source => (
                <span key={source} className="px-2 py-1 bg-gray-700/50 rounded-full text-sm">
                  {source}
                </span>
              ))}
            </div>
          </div>

          {/* Studios and Genres sections remain the same */}
          <div className="border-t border-gray-700 pt-4">
            <div className="text-sm text-gray-400 mb-3">Studios</div>
            <div className="flex flex-wrap gap-2">
              {anime.studios.map(studio => (
                <span key={studio.name} className="px-2 py-1 bg-gray-700/50 rounded-full text-sm">
                  {studio.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-3">Genres</div>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map(genre => (
                <span key={genre.name} className="px-2 py-1 bg-gray-700/50 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
