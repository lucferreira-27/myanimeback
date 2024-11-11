import { UsersIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';
import { AnimeDetails, HistoricalData } from '../../types/anime';

interface SideStatsProps {
  anime: AnimeDetails;
  historicalData: HistoricalData;
}

export const SideStats = ({ anime, historicalData }: SideStatsProps) => {
  return (
    <div className="space-y-8">
      {/* Member Growth, Review Sentiment, and Information sections... */}
    </div>
  );
}; 