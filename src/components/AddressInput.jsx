import { useState, useEffect, useRef } from 'react'

function AddressInput({ placeholder, value, onChange, name }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  const searchAddress = async (query) => {
    if (query.length < 3) { setSuggestions([]); return }
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${import.meta.env.VITE_LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&countrycodes=gb&limit=5&format=json`
      )
      const data = await res.json()
      setSuggestions(Array.isArray(data) ? data : [])
    } catch {
      setSuggestions([])
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const val = e.target.value
    onChange(name, val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchAddress(val), 400)
    setShowSuggestions(true)
  }

  const handleSelect = (suggestion) => {
    onChange(name, suggestion.display_name)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition border-b border-gray-700 last:border-0"
            >
              <span className="text-yellow-500 mr-2">📍</span>
              {s.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressInput