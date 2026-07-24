import { useState, useEffect } from 'react'
import { Car, Clock, CheckCircle, User, Plus, Mail, Phone, Edit2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import DashboardLayout from '../components/DashboardLayout'

const statusColors = {
  confirmed: 'bg-green-500 bg-opacity-10 text-green-400 border-green-500',
  completed: 'bg-blue-500 bg-opacity-10 text-blue-400 border-blue-500',
  pending: 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-yellow-500',
  cancelled: 'bg-red-500 bg-opacity-10 text-red-400 border-red-500',
}

function CustomerDashboard() {
  const [active, setActive] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const data = await api.getMyBookings(token)
    // Sort newest first
    const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []
    setBookings(sorted)
    setLoading(false)
  }

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
  const completedBookings = bookings.filter(b => b.status === 'completed')

  const navItems = [
    { id: 'bookings', label: 'My Bookings', icon: Car, active: active === 'bookings', onClick: () => setActive('bookings') },
    { id: 'upcoming', label: 'Upcoming Rides', icon: Clock, active: active === 'upcoming', onClick: () => setActive('upcoming') },
    { id: 'profile', label: 'My Profile', icon: User, active: active === 'profile', onClick: () => setActive('profile') },
  ]

  const BookingCard = ({ booking }) => (
    <div className="border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-sm text-yellow-500">#{booking.bookingReference || booking._id.slice(-6).toUpperCase()}</p>
          <p className="text-white font-semibold mt-1 text-sm">{booking.pickup}</p>
          <p className="text-gray-400 text-xs">→ {booking.dropoff}</p>
        </div>
        <span className={`text-xs border px-2 py-1 rounded-full font-semibold ${statusColors[booking.status]}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        <span>📅 {booking.date}</span>
        <span>🕐 {booking.time}</span>
        <span>🚗 {booking.vehicle}</span>
        <span>👥 {booking.passengers}</span>
        <span className="text-yellow-500 font-bold">£{booking.price}</span>
      </div>
      {booking.driver && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-green-400 text-xs">🚗 Driver: {booking.driver.name} · {booking.driver.phone}</p>
        </div>
      )}
    </div>
  )

  return (
    <DashboardLayout navItems={navItems} user={user}>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: Car, color: 'text-yellow-500' },
          { label: 'Upcoming', value: upcomingBookings.length, icon: Clock, color: 'text-blue-400' },
          { label: 'Completed', value: completedBookings.length, icon: CheckCircle, color: 'text-green-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            <Icon size={24} className={`${color} mb-3`} />
            <p className="text-2xl lg:text-3xl font-extrabold mb-1">{value}</p>
            <p className="text-gray-400 text-xs lg:text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* My Bookings */}
      {active === 'bookings' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-xl font-bold">My Bookings</h2>
            <Link to="/booking" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-full text-sm transition">
              <Plus size={16} /> <span className="hidden sm:block">New Booking</span>
            </Link>
          </div>
          {loading ? (
            <p className="text-gray-400 text-center py-10">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">✈️</p>
              <p className="text-gray-400 mb-4">No bookings yet!</p>
              <Link to="/booking" className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-full text-sm">
                Book Your First Transfer
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => <BookingCard key={booking._id} booking={booking} />)}
            </div>
          )}
        </div>
      )}

      {/* Upcoming Rides */}
      {active === 'upcoming' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-6">Upcoming Rides</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-10">Loading...</p>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🗓️</p>
              <p className="text-gray-400 mb-4">No upcoming rides!</p>
              <Link to="/booking" className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-full text-sm">
                Book a Transfer
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking._id} className="border border-yellow-500 border-opacity-30 bg-yellow-500 bg-opacity-5 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-sm text-yellow-500">#{booking.bookingReference || booking._id.slice(-6).toUpperCase()}</p>
                      <p className="text-white font-semibold mt-1">{booking.pickup}</p>
                      <p className="text-gray-400 text-xs">→ {booking.dropoff}</p>
                    </div>
                    <span className={`text-xs border px-2 py-1 rounded-full font-semibold ${statusColors[booking.status]}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                    <span>📅 {booking.date}</span>
                    <span>🕐 {booking.time}</span>
                    <span>🚗 {booking.vehicle}</span>
                    <span className="text-yellow-500 font-bold">£{booking.price}</span>
                  </div>
                  {booking.driver ? (
                    <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-3">
                      <p className="text-green-400 text-xs font-semibold">✅ Driver Assigned</p>
                      <p className="text-white text-sm mt-1">{booking.driver.name}</p>
                      <p className="text-gray-400 text-xs">{booking.driver.phone}</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-3">
                      <p className="text-yellow-400 text-xs">⏳ Driver will be assigned soon</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Profile */}
      {active === 'profile' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg lg:text-xl font-bold">My Profile</h2>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black font-extrabold text-2xl">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{user.name}</p>
                <p className="text-gray-400 text-sm">Customer Account</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-4">
                <User size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Full Name</p>
                  <p className="text-white text-sm font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-4">
                <Mail size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Email Address</p>
                  <p className="text-white text-sm font-medium">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Booking Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total', value: bookings.length, color: 'text-white' },
                { label: 'Upcoming', value: upcomingBookings.length, color: 'text-yellow-500' },
                { label: 'Completed', value: completedBookings.length, color: 'text-green-400' },
              ].map(item => (
                <div key={item.label} className="text-center bg-gray-800 rounded-xl p-4">
                  <p className={`text-2xl font-extrabold ${item.color}`}>{item.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default CustomerDashboard