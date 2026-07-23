import { useState, useEffect } from 'react'
import { Menu, X, Car } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/')
  }

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
    { href: '/manage-booking', label: 'Manage Booking' },
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-50 transition-all duration-500 bg-black bg-opacity-90 backdrop-blur-md border-b border-yellow-500 border-opacity-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">

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
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-gray-300 hover:text-yellow-500 transition text-sm font-medium">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'driver' ? '/driver' : '/dashboard'}
                className="text-gray-300 hover:text-yellow-500 text-sm font-medium transition">
                My Account
              </Link>
              <button onClick={logout}
                className="border border-gray-700 hover:border-red-500 text-gray-300 hover:text-red-400 font-medium px-4 py-2 rounded-full text-sm transition">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login"
              className="text-gray-300 hover:text-yellow-500 text-sm font-medium transition">
              Login
            </Link>
          )}
          <Link to="/booking"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-full text-sm transition">
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
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="block text-gray-300 hover:text-yellow-500 transition text-sm">
              {l.label}
            </a>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" className="block text-gray-300 hover:text-yellow-500 text-sm">My Account</Link>
              <button onClick={logout} className="block text-red-400 text-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block text-gray-300 hover:text-yellow-500 text-sm">Login</Link>
          )}
          <Link to="/booking"
            className="block bg-yellow-500 text-black font-bold px-5 py-2 rounded-full text-sm text-center">
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar