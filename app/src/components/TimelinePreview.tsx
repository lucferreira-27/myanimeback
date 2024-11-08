import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  ChartBarIcon, 
  UsersIcon, 
  StarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/solid'

interface TimelinePoint {
  date: string
  title: string
  description: string
  metrics: {
    score: number
    members: string
    rank: string
  }
  icon: string
  colorClass: string
}

const TimelinePreview = () => {
  const timelineData: TimelinePoint[] = [
    {
      date: "Apr 2006",
      title: "Initial Release",
      description: "First appearance on MyAnimeList",
      metrics: {
        score: 7.24,
        members: "10K",
        rank: "#856"
      },
      icon: "🎬",
      colorClass: "bg-blue-500"
    },
    {
      date: "Dec 2010",
      title: "Rising Popularity",
      description: "Entered Top 100 Anime",
      metrics: {
        score: 8.15,
        members: "250K",
        rank: "#86"
      },
      icon: "📈",
      colorClass: "bg-green-500"
    },
    {
      date: "Jul 2015",
      title: "Peak Performance",
      description: "Highest Historical Ranking",
      metrics: {
        score: 8.86,
        members: "750K",
        rank: "#12"
      },
      icon: "🏆",
      colorClass: "bg-yellow-500"
    },
    {
      date: "Present",
      title: "Current Status",
      description: "Maintaining Strong Position",
      metrics: {
        score: 8.92,
        members: "1.2M",
        rank: "#15"
      },
      icon: "⭐",
      colorClass: "bg-purple-500"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <ClockIcon className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Time Machine Analytics
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>

          {/* Timeline Points */}
          <div className="flex justify-between relative px-8">
            {timelineData.map((point, index) => (
              <div key={point.date} className="relative flex flex-col items-center">
                {/* Date */}
                <div className="text-sm text-gray-400 mb-4">{point.date}</div>

                {/* Node */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-6 h-6 rounded-full ${point.colorClass} bg-opacity-20 flex items-center justify-center z-10`}
                >
                  <div className={`w-3 h-3 rounded-full ${point.colorClass}`} />
                </motion.div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute top-16 w-64 -translate-x-1/2 left-1/2"
                >
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="text-lg mb-1">{point.title}</div>
                    <div className="text-sm text-gray-400 mb-4">{point.description}</div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <ChartBarIcon className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                        <div className="text-yellow-400 font-bold">{point.metrics.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <div className="text-center">
                        <UsersIcon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                        <div className="text-purple-400 font-bold">{point.metrics.members}</div>
                        <div className="text-xs text-gray-500">Members</div>
                      </div>
                      <div className="text-center">
                        <StarIcon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <div className="text-blue-400 font-bold">{point.metrics.rank}</div>
                        <div className="text-xs text-gray-500">Rank</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-48 pt-6 border-t border-gray-700/50">
          {[
            { icon: ChartBarIcon, label: 'Rating evolution', color: 'text-yellow-400' },
            { icon: UsersIcon, label: 'Community growth', color: 'text-purple-400' },
            { icon: StarIcon, label: 'User feedback', color: 'text-blue-400' },
            { icon: ArrowTrendingUpIcon, label: 'Rank changes', color: 'text-green-400' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 text-sm"
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-gray-400">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default TimelinePreview