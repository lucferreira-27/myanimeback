import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { AnimeHero } from '../components/anime/AnimeHero';

import { QuickStats } from '../components/anime/QuickStats';

import { HistoricalPerformance } from '../components/anime/HistoricalPerformance';

import { ChartSection } from '../components/anime/ChartSection';

import { SideStats } from '../components/anime/SideStats';

import { AnimeDetails, HistoricalData } from '../types/anime';

const AnimePage = () => {
  const { id } = useParams<{ id: string }>();

  const [anime, setAnime] = useState<AnimeDetails | null>(null);

  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAnimeData = async () => {
      setLoading(true);

      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);

        const data = await response.json();

        setAnime(data.data);

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

            (_, i) => +(Math.random() * 0.5 + (data.data.score - 0.5)).toFixed(2)
          ),

          ranks: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 1),

          members: Array.from({ length: 12 }, (_, i) =>
            Math.floor(data.data.members * (0.7 + (i * 0.3) / 11))
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
      // Here you would implement the actual Wayback Machine analysis

      console.log('Starting analysis with config:', config);

      // Simulate analysis time

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update historical data with new analysis results

      // This is where you'd integrate with the Wayback Machine API
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

  return (
    <div className="min-h-screen bg-gray-900">
      <AnimeHero anime={anime} onStartAnalysis={handleStartAnalysis} isAnalyzing={isAnalyzing} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <QuickStats anime={anime} />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <HistoricalPerformance anime={anime} historicalData={historicalData} />

            <ChartSection historicalData={historicalData} />
          </div>

          <SideStats anime={anime} historicalData={historicalData} />
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
