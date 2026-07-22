import { useState } from 'react'
import { Menu, X, Car } from 'lucide-react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-md border-b border-yellow-500 border-opacity-30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <Car size={22} className="text-black" />
          </div>
          <span className="text-white font-extrabold text-2xl tracking-tight">
            Taxi<span className="text-yellow-500">Go</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Services', 'About', 'Contact'].map(item => (
            <a key={item} href="#" className="text-gray-300 hover:text-yellow-500 transition text-sm font-medium">
              {item}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <Link to="/manage-booking" className="text-gray-300 hover:text-yellow-500 text-sm font-medium transition">
            Manage Booking
          </Link>
        
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-gray-300 hover:text-yellow-500 text-sm font-medium transition">
            Login
          </Link>
          <Link to="/booking" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-full text-sm transition">
            Book Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-yellow-500 border-opacity-20 px-6 py-4 space-y-4">
          {['Home', 'Services', 'About', 'Contact'].map(item => (
            <a key={item} href="#" className="block border rounded-2xl bg-gray-900 border-gray-700  text-center py-3 text-gray-300 hover:text-yellow-500 transition text-sm">
              {item}
            </a>
          ))}
          <Link to="/booking" className="block bg-yellow-500 text-black font-bold px-5 py-2 rounded-full text-sm text-center">
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar