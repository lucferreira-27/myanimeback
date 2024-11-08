import SearchBar from '../components/SearchBar'
import BackgroundPattern from '../components/BackgroundPattern'
import TrendingAnime from '../components/TrendingAnime'
import TimelinePreview from '../components/TimelinePreview'
import { SparklesIcon, ClockIcon, ChartBarIcon, ArrowPathIcon, UserGroupIcon, DocumentChartBarIcon, ArchiveBoxIcon, ArrowsRightLeftIcon, ExclamationTriangleIcon, ChartPieIcon } from '@heroicons/react/24/solid'

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-blue-900/20 pointer-events-none" />
      <BackgroundPattern />
      
      {/* Hero section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6 space-x-2">
            <SparklesIcon className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-medium">Time Travel Through Anime History</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8">
            Track Your Favorite Anime's{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Journey Through Time
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Discover how anime ratings, popularity, and reviews have evolved over time. 
            MyAnimeBack lets you explore historical data from MyAnimeList, revealing the complete 
            story of your favorite series.
          </p>
          
          <div className="flex justify-center mb-20">
            <SearchBar />
          </div>

          {/* Trending Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8">Trending Anime</h2>
            <TrendingAnime />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 mb-4 mx-auto">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Rating Evolution</h3>
              <p className="text-gray-400">Track how anime ratings have changed over time, from premiere to present day</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 text-purple-400 mb-4 mx-auto">
                <ArrowPathIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Historical Timeline</h3>
              <p className="text-gray-400">View snapshots of MyAnimeList pages throughout different time periods</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-pink-500/10 text-pink-400 mb-4 mx-auto">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-400">Analyze how community reception and popularity have evolved</p>
            </div>
          </div>

          {/* Timeline Preview Section */}
          <div className="mb-20">
            <div className="flex items-center justify-center mb-8">
              <DocumentChartBarIcon className="w-8 h-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold">Timeline Analysis</h2>
            </div>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              Track the complete history of any anime on MyAnimeList. See how scores evolved, 
              when major changes occurred, and understand the impact of different events on its popularity.
            </p>
            <TimelinePreview />
          </div>

          {/* Advanced Features Showcase */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Dive deep into anime statistics with our advanced tracking and comparison tools
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Comparison Tool */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <ArrowsRightLeftIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Title Comparison</h3>
                    <p className="text-gray-400 text-sm">Compare ratings, popularity, and trends between different titles</p>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="h-32 flex items-center justify-center">
                    <span className="text-gray-500">Comparison charts preview coming soon</span>
                  </div>
                </div>
              </div>

              {/* Controversy Tracker */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Controversy Tracker</h3>
                    <p className="text-gray-400 text-sm">Track polarizing titles and community reactions</p>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="h-32 flex items-center justify-center">
                    <span className="text-gray-500">Controversy metrics preview coming soon</span>
                  </div>
                </div>
              </div>

              {/* Historical Rankings */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <ArchiveBoxIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Historical Rankings</h3>
                    <p className="text-gray-400 text-sm">Track rank changes and popularity shifts over time</p>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="h-32 flex items-center justify-center">
                    <span className="text-gray-500">Ranking timeline preview coming soon</span>
                  </div>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <ChartPieIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
                    <p className="text-gray-400 text-sm">Comprehensive analytics and visualization tools</p>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="h-32 flex items-center justify-center">
                    <span className="text-gray-500">Analytics preview coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home