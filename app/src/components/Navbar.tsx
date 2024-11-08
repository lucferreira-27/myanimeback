import { Link } from 'react-router-dom'
import { HomeIcon, ClockIcon } from '@heroicons/react/24/solid'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              MyAnimeBack
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link to="/history" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <ClockIcon className="w-5 h-5" />
              <span>History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 