import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, MapPin, Clock, Search } from 'lucide-react'
import { api } from '../api'
import Navbar from '../components/Navbar'

const statusColors = {
  confirmed: 'bg-green-500 bg-opacity-10 text-green-400 border-green-500',
  completed: 'bg-blue-500 bg-opacity-10 text-blue-400 border-blue-500',
  pending: 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-yellow-500',
  cancelled: 'bg-red-500 bg-opacity-10 text-red-400 border-red-500',
}

function ManageBooking() {
  const [form, setForm] = useState({ bookingReference: '', email: '' })
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBooking(null)
    const data = await api.findBooking(form.bookingReference.trim().toUpperCase(), form.email.trim())
    if (data._id) {
      setBooking(data)
    } else {
      setError(data.message || 'Booking not found!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold mb-3">Manage Your Booking</h1>
          <p className="text-gray-400">Enter your booking reference and email to find your transfer</p>
        </div>

        {/* Search Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Booking Reference</label>
              <input type="text" value={form.bookingReference}
                onChange={(e) => setForm({ ...form, bookingReference: e.target.value })}
                placeholder="e.g. TG123456ABC"
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition uppercase" />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Email Address</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email used when booking"
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition">
              <Search size={18} />
              {loading ? 'Searching...' : 'Find My Booking'}
            </button>
          </form>
        </div>

        {/* Booking Result */}
        {booking && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-xs mb-1">Booking Reference</p>
                <p className="text-yellow-500 font-extrabold text-xl">{booking.bookingReference}</p>
              </div>
              <span className={`text-xs border px-3 py-1 rounded-full font-semibold ${statusColors[booking.status]}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Pickup</p>
                  <p className="text-white text-sm">{booking.pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Drop-off</p>
                  <p className="text-white text-sm">{booking.dropoff}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Date & Time</p>
                  <p className="text-white text-sm">{booking.date} at {booking.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Car size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">Vehicle</p>
                  <p className="text-white text-sm">{booking.vehicle} · {booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {booking.driver && (
              <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-xl p-4 mb-6">
                <p className="text-green-400 font-semibold text-sm mb-2">🚗 Driver Assigned</p>
                <p className="text-white text-sm">{booking.driver.name}</p>
                <p className="text-gray-400 text-xs">{booking.driver.phone}</p>
              </div>
            )}

            <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Price</span>
              <span className="text-yellow-500 font-extrabold text-xl">£{booking.price}</span>
            </div>
          </div>
        )}

        <p className="text-center text-gray-500 text-sm mt-8">
          Have an account?{' '}
          <Link to="/login" className="text-yellow-500 hover:underline">Sign in</Link>
          {' '}to see all your bookings
        </p>
      </div>
    </div>
  )
}

export default ManageBooking