import { AnimeDetails, HistoricalData } from '../../types/anime';

interface HistoricalPerformanceProps {
  anime: AnimeDetails;
  historicalData: HistoricalData;
}

export const HistoricalPerformance = ({ anime, historicalData }: HistoricalPerformanceProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-semibold mb-6">Historical Performance</h3>
      {/* ... rest of the historical performance content ... */}
    </div>
  );
}; 