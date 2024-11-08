import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

const SearchBar = () => {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', query)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-12 py-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
            placeholder="Search for anime..."
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default SearchBar 