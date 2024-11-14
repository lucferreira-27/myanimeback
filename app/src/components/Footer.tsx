import { HeartIcon, CodeBracketIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  const archiveStats = {
    totalSnapshots: '1.2M',
    animeTracked: '12,450',
    dataPoints: '85M',
    lastUpdate: 'March 15, 2024',
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="col-span-4 md:col-span-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
              MyAnimeBack
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Track your favorite anime's journey through time with historical data and insights
              from MyAnimeList archives.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <HeartIcon className="w-4 h-4 text-red-500 mr-1" />
              <span>Made for anime fans</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/trending"
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Trending
                </a>
              </li>
              <li>
                <a
                  href="/history"
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  History
                </a>
              </li>
              <li>
                <a
                  href="/api"
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Archive Stats */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Archive Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-blue-400 font-semibold">{archiveStats.totalSnapshots}</div>
                <div className="text-gray-500 text-sm">Snapshots</div>
              </div>
              <div>
                <div className="text-purple-400 font-semibold">{archiveStats.animeTracked}</div>
                <div className="text-gray-500 text-sm">Anime Tracked</div>
              </div>
              <div>
                <div className="text-rose-400 font-semibold">{archiveStats.dataPoints}</div>
                <div className="text-gray-500 text-sm">Data Points</div>
              </div>
              <div>
                <div className="text-emerald-400 font-semibold">{archiveStats.lastUpdate}</div>
                <div className="text-gray-500 text-sm">Last Update</div>
              </div>
            </div>
          </div>

          {/* Connect */}
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <CodeBracketIcon className="w-5 h-5" />
              </a>
              {/* Add more social icons as needed */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MyAnimeBack. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-500 hover:text-gray-400 text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-gray-400 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
