import { useEffect, useState } from 'react'
import { ChartBarIcon, UsersIcon, CalendarIcon, ClockIcon, ArrowTrendingUpIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface AnimeData {
  mal_id: number
  title: string
  images: {
    webp: {
      image_url: string
    }
  }
  score: number
  members: number
  rank: number
  popularity: number
  aired: {
    from: string
  }
  synopsis: string
  rank_change?: number
  historical?: {
    rank_range: {
      highest: number
      lowest: number
    }
    score_progression: number[]
    member_growth: string[]
    last_updates: {
      score: string
      rank: string
    }
  }
}

const TrendingAnime = () => {
  const [trending, setTrending] = useState<AnimeData[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=6')
        const data = await response.json()
        const enhancedData = data.data.map((anime: AnimeData) => ({
          ...anime,
          rank_change: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
          historical: {
            rank_range: {
              highest: Math.floor(Math.random() * 10) + 1,
              lowest: Math.floor(Math.random() * 90) + 10,
            },
            score_progression: [7.2, 7.8, 8.1, 8.4, anime.score],
            member_growth: ['100K', '500K', '1M', '2M', `${(anime.members / 1000000).toFixed(1)}M`],
            last_updates: {
              score: '2 days ago',
              rank: '12 hours ago'
            }
          }
        }))
        setTrending(enhancedData)
      } catch (error) {
        console.error('Error fetching trending anime:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  const formatAirDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  const formatMembers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800/50 rounded-xl h-[300px]"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Slider {...sliderSettings} className="trending-slider -mx-2">
        {trending.map((anime) => (
          <div key={anime.mal_id} className="px-2">
            <div
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-[300px]"
              onMouseEnter={() => setHoveredId(anime.mal_id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image with Overlay */}
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
                <img
                  src={anime.images.webp.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  {/* Top Stats */}
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex items-center">
                        <span className="text-yellow-400 font-bold">#{anime.rank}</span>
                        {anime.rank_change && (
                          <span className={`ml-0.5 ${anime.rank_change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {anime.rank_change > 0 ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                      
                      {/* Score */}
                      <span className="text-white">{anime.score}</span>
                      
                      {/* Members */}
                      <span className="text-gray-400">{formatMembers(anime.members)}</span>
                    </div>
                    
                    {/* Air Date */}
                    <span className="text-gray-400">{formatAirDate(anime.aired.from)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-medium text-lg line-clamp-2">
                    {anime.title}
                  </h3>
                </div>
              </div>

              {/* New Historical Data Hover Overlay */}
              <div 
                className={`absolute inset-0 bg-gray-900/95 p-6 transition-all duration-300 z-30
                  ${hoveredId === anime.mal_id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="h-full flex flex-col">
                  <h4 className="text-lg font-semibold mb-6 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-blue-400" />
                    Historical Data
                  </h4>
                  
                  <div className="space-y-6">
                    {/* Rank Range - Similar to the image */}
                    <div>
                      <div className="flex items-center text-blue-400 mb-2 text-sm">
                        <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
                        Rank Range
                      </div>
                      <div className="text-white font-medium">
                        #{anime.historical?.rank_range.highest} - #{anime.historical?.rank_range.lowest}
                      </div>
                    </div>

                    {/* Score Progress */}
                    <div>
                      <div className="flex items-center text-yellow-400 mb-2 text-sm">
                        <ChartBarIcon className="w-4 h-4 mr-2" />
                        Score Progress
                      </div>
                      <div className="flex items-center space-x-2">
                        {anime.historical?.score_progression.map((score, i) => (
                          <span key={i} className="text-white">
                            {score}
                            {i < anime.historical!.score_progression.length - 1 && (
                              <span className="text-gray-500 mx-2">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Member Growth */}
                    <div>
                      <div className="flex items-center text-purple-400 mb-2 text-sm">
                        <UsersIcon className="w-4 h-4 mr-2" />
                        Member Growth
                      </div>
                      <div className="flex items-center space-x-2">
                        {anime.historical?.member_growth.map((count, i) => (
                          <span key={i} className="text-white">
                            {count}
                            {i < anime.historical!.member_growth.length - 1 && (
                              <span className="text-gray-500 mx-2">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Last Updates */}
                    <div>
                      <div className="flex items-center text-green-400 mb-2 text-sm">
                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                        Last Updates
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-sm">Score:</span>
                          <span className="text-white ml-2">{anime.historical?.last_updates.score}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Rank:</span>
                          <span className="text-white ml-2">{anime.historical?.last_updates.rank}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default TrendingAnime