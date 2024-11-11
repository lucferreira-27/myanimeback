import { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchResults from './SearchResults';
import { useNavigate } from 'react-router-dom';

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
      small_image_url: string;
    };
  };
  type: string;
  score: number;
  year: number;
  synopsis: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceTimeout = useRef<NodeJS.Timeout>();

  const searchAnime = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error searching anime:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query) {
      debounceTimeout.current = setTimeout(() => {
        searchAnime(query);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, searchAnime]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  const handleResultClick = (result: AnimeResult) => {
    navigate(`/anime/${result.mal_id}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="w-full max-w-3xl relative">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setShowResults(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowResults(true)}
            onKeyDown={handleKeyDown}
            className="w-full px-12 py-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
            placeholder="Search for anime..."
            role="combobox"
            aria-expanded={showResults}
            aria-controls="search-results"
            aria-activedescendant={
              selectedIndex >= 0 ? `result-${results[selectedIndex]?.mal_id}` : undefined
            }
          />
        </div>
      </div>

      {showResults && (
        <SearchResults
          results={results}
          loading={loading}
          selectedIndex={selectedIndex}
          onResultClick={handleResultClick}
          onMouseEnter={setSelectedIndex}
        />
      )}
    </div>
  );
};

export default SearchBar;
