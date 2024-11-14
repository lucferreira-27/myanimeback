import { useState } from 'react';

import {
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

interface AnalysisConfigProps {
  onStartAnalysis: (config: AnalysisSettings) => void;

  isLoading: boolean;
}

interface AnalysisSettings {
  startDate: string;

  endDate: string;

  snapshotInterval: 'daily' | 'weekly' | 'monthly';

  dataPoints: string[];

  depth: 'basic' | 'detailed' | 'comprehensive';
}

const AnalysisConfig = ({ onStartAnalysis, isLoading }: AnalysisConfigProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [settings, setSettings] = useState<AnalysisSettings>({
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    endDate: new Date().toISOString().split('T')[0],

    snapshotInterval: 'monthly',

    dataPoints: ['score', 'rank', 'members', 'reviews'],

    depth: 'detailed',
  });

  const handleStartAnalysis = () => {
    onStartAnalysis(settings);

    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}

      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg text-white"
      >
        <ClockIcon className="w-5 h-5" />

        <span>New Historical Analysis</span>
      </button>

      {/* Config Modal */}

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800/90 rounded-xl border border-gray-700/50 p-6 max-w-2xl w-full mx-4 relative">
            {/* Close Button */}

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AdjustmentsHorizontalIcon className="w-6 h-6 mr-2 text-blue-400" />
              Analysis Configuration
            </h2>

            <div className="space-y-6">
              {/* Time Range */}

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Time Range
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      value={settings.startDate}
                      onChange={e => setSettings({ ...settings, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="date"
                      value={settings.endDate}
                      onChange={e => setSettings({ ...settings, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Snapshot Interval */}

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center">
                  <ArrowPathIcon className="w-4 h-4 mr-1" />
                  Snapshot Interval
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map(interval => (
                    <button
                      key={interval}
                      onClick={() => setSettings({ ...settings, snapshotInterval: interval })}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        settings.snapshotInterval === interval
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Points */}

              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center">
                  <ChartBarIcon className="w-4 h-4 mr-1" />
                  Data Points to Track
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {['score', 'rank', 'members', 'reviews'].map(point => (
                    <label
                      key={point}
                      className="flex items-center space-x-2 bg-gray-700/50 p-2 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={settings.dataPoints.includes(point)}
                        onChange={e => {
                          const newDataPoints = e.target.checked
                            ? [...settings.dataPoints, point]
                            : settings.dataPoints.filter(p => p !== point);

                          setSettings({ ...settings, dataPoints: newDataPoints });
                        }}
                        className="rounded text-blue-500 bg-gray-700 border-gray-600"
                      />

                      <span className="capitalize">{point}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Analysis Depth */}

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Analysis Depth</label>

                <div className="grid grid-cols-3 gap-2">
                  {(['basic', 'detailed', 'comprehensive'] as const).map(depth => (
                    <button
                      key={depth}
                      onClick={() => setSettings({ ...settings, depth })}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        settings.depth === depth
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {depth}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleStartAnalysis}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center space-x-2

                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />

                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <ChartBarIcon className="w-5 h-5" />

                    <span>Start Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisConfig;
