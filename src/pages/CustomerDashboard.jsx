import { useState, useEffect } from 'react'
import { Car, Clock, CheckCircle, User, Plus } from 'lucide-react'
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
    setBookings(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const navItems = [
    { id: 'bookings', label: 'My Bookings', icon: Car, active: active === 'bookings', onClick: () => setActive('bookings') },
    { id: 'upcoming', label: 'Upcoming Rides', icon: Clock, active: active === 'upcoming', onClick: () => setActive('upcoming') },
    { id: 'profile', label: 'My Profile', icon: User, active: active === 'profile', onClick: () => setActive('profile') },
  ]

  return (
    <DashboardLayout navItems={navItems} user={user}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: Car, color: 'text-yellow-500' },
          { label: 'Upcoming', value: bookings.filter(b => b.status === 'confirmed').length, icon: Clock, color: 'text-blue-400' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: CheckCircle, color: 'text-green-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            <Icon size={24} className={`${color} mb-3`} />
            <p className="text-2xl lg:text-3xl font-extrabold mb-1">{value}</p>
            <p className="text-gray-400 text-xs lg:text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Bookings */}
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
            {bookings.map(booking => (
              <div key={booking._id} className="border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-sm text-yellow-500">#{booking._id.slice(-6).toUpperCase()}</p>
                    <p className="text-white font-semibold mt-1 text-sm">{booking.pickup} → {booking.dropoff}</p>
                  </div>
                  <span className={`text-xs border px-2 py-1 rounded-full font-semibold ${statusColors[booking.status]}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span>📅 {booking.date}</span>
                  <span>🕐 {booking.time}</span>
                  <span>🚗 {booking.vehicle}</span>
                  <span className="text-yellow-500 font-bold">£{booking.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CustomerDashboard