import { useState } from "react"
import { Search, Clock } from "lucide-react"
import { geocodeCountry } from "../../utils/geocode"
import QuickSearchButton from "./QuickSearchButton"

export default function SearchSection({ mapRef }) {
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!search.trim()) return

    setIsSearching(true)
    try {
      const coords = await geocodeCountry(search)
      if (coords && mapRef.current) {
        mapRef.current.setView([coords.lat, coords.lng], 6)
        setSearchHistory((prev) => [
          { query: search, coords, timestamp: Date.now() },
          ...prev.slice(0, 4),
        ])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
      setSearch("")
    }
  }

  return (
    <div className='p-6 space-y-4'>
      <h3 className='font-bold text-slate-800 flex items-center gap-3'>
        <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center'>
          <Search className='w-4 h-4 text-white' />
        </div>
        Location Search
      </h3>

      {/* Input */}
      <div className='relative group'>
        <input
          type='text'
          placeholder='Search countries, cities, regions...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className='w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-slate-200/50 
                     rounded-2xl text-sm shadow-lg transition-all duration-300 
                     focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400'
        />
        <div className='absolute left-4 top-1/2 -translate-y-1/2'>
          <Search className='w-5 h-5 text-slate-400' />
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={isSearching || !search.trim()}
        className='w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl
                   hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300
                   shadow-md hover:shadow-xl flex items-center justify-center gap-3'>
        {isSearching ? (
          <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
        ) : (
          <>
            <Search size={18} />
            <span>Search Location</span>
          </>
        )}
      </button>

      {/* History */}
      {searchHistory.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs text-slate-600 font-medium'>Recent Searches:</p>
          <div className='flex flex-wrap gap-2'>
            {searchHistory.map((item, i) => (
              <QuickSearchButton
                key={i}
                query={item.query}
                coords={item.coords}
                onClick={(coords) =>
                  mapRef.current?.setView([coords.lat, coords.lng], 6)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
