import { Line, Bar } from 'react-chartjs-2';
import { ChartBarIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HistoricalData } from '../../types/anime';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartSectionProps {
  historicalData: HistoricalData;
}

export const ChartSection = ({ historicalData }: ChartSectionProps) => {
  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(156, 163, 175)',
        borderColor: 'rgba(55, 65, 81, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(55, 65, 81, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(55, 65, 81, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  // Calculate percentage growth for favorites - improved calculation
  const calculateGrowthPercentages = () => {
    const initial = historicalData.favorites[0];
    return historicalData.favorites.map(value => {
      const growth = ((value - initial) / initial) * 100;
      return Number(growth.toFixed(1)); // Ensure clean numbers
    });
  };

  const favoritesGrowth = calculateGrowthPercentages();

  const scoreData = {
    labels: historicalData.dates,
    datasets: [
      {
        data: historicalData.scores,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const rankData = {
    labels: historicalData.dates,
    datasets: [
      {
        data: historicalData.ranks,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const favoritesData = {
    labels: historicalData.dates,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Favorites',
        data: historicalData.favorites,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.5)');
          gradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
          return gradient;
        },
        borderColor: 'rgba(244, 63, 94, 0.8)',
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y',
        order: 2,
        barThickness: 16,
      },
      {
        type: 'line' as const,
        label: 'Growth %',
        data: favoritesGrowth,
        borderColor: 'rgb(251, 113, 133)',
        backgroundColor: 'rgba(251, 113, 133, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: 'rgb(251, 113, 133)',
        pointHoverBorderColor: 'rgb(251, 113, 133)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
        order: 1,
      },
    ],
  };

  const favoritesOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          useBorderRadius: true,
          borderRadius: 2,
          color: 'rgb(156, 163, 175)',
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(156, 163, 175)',
        borderColor: 'rgba(55, 65, 81, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Growth %') {
              return `${label}: +${value.toFixed(1)}%`;
            }
            return `${label}: ${(value / 1000).toFixed(1)}K`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
          },
          maxRotation: 0,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(55, 65, 81, 0.2)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value: number) => `${(value / 1000).toFixed(0)}K`,
          font: {
            size: 11,
          },
          padding: 8,
        },
        title: {
          display: true,
          text: 'Total Favorites',
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
            weight: '400',
          },
          padding: { bottom: 10 },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value: number) => `${value.toFixed(0)}%`,
          font: {
            size: 11,
          },
          padding: 8,
        },
        title: {
          display: true,
          text: 'Growth %',
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
            weight: '400',
          },
          padding: { bottom: 10 },
        },
        min: 0,
        suggestedMax: Math.ceil(Math.max(...favoritesGrowth) * 1.1), // 10% padding
      },
    },
    layout: {
      padding: {
        top: 25,
      },
    },
  };

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold">Score Evolution</h3>
          </div>
          <div className="text-sm text-gray-400">
            Peak: {Math.max(...historicalData.scores).toFixed(2)}
          </div>
        </div>
        <Line options={chartOptions} data={scoreData} height={60} />
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold">Rank History</h3>
          </div>
          <div className="text-sm text-gray-400">Best: #{Math.min(...historicalData.ranks)}</div>
        </div>
        <Line options={chartOptions} data={rankData} height={60} />
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <HeartIcon className="w-5 h-5 text-rose-400 mr-2" />
            <h3 className="text-lg font-semibold">Favorites Growth</h3>
          </div>
          <div className="text-sm text-gray-400">
            Peak Growth: +{Math.max(...favoritesGrowth).toFixed(1)}%
          </div>
        </div>
        <Bar options={favoritesOptions} data={favoritesData} height={60} />
      </div>
    </>
  );
};
