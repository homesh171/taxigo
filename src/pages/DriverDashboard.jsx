import { useState, useEffect } from 'react'
import { Car, Clock, CheckCircle, MapPin, Phone, User, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import DashboardLayout from '../components/DashboardLayout'

const statusColors = {
  assigned: 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-yellow-500',
  confirmed: 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-yellow-500',
  completed: 'bg-green-500 bg-opacity-10 text-green-400 border-green-500',
  cancelled: 'bg-red-500 bg-opacity-10 text-red-400 border-red-500',
}

function DriverDashboard() {
  const [active, setActive] = useState('rides')
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchRides()
  }, [])

  const fetchRides = async () => {
    setLoading(true)
    const data = await api.getDriverBookings(token)
    const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []
    setRides(sorted)
    setLoading(false)
  }

  const completeRide = async (id) => {
    await api.updateStatus(id, 'completed', token)
    fetchRides()
  }

  const totalEarnings = rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.price, 0)
  const upcomingRides = rides.filter(r => r.status === 'confirmed' || r.status === 'assigned')
  const completedRides = rides.filter(r => r.status === 'completed')

  const navItems = [
    { id: 'rides', label: 'My Rides', icon: Car, active: active === 'rides', onClick: () => setActive('rides') },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, active: active === 'upcoming', onClick: () => setActive('upcoming') },
    { id: 'earnings', label: 'Earnings', icon: Star, active: active === 'earnings', onClick: () => setActive('earnings') },
    { id: 'profile', label: 'My Profile', icon: User, active: active === 'profile', onClick: () => setActive('profile') },
  ]

  const RideCard = ({ ride, showComplete }) => (
    <div className="border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-yellow-500 text-sm">#{ride.bookingReference || ride._id.slice(-6).toUpperCase()}</p>
          <p className="text-white font-semibold mt-1 text-sm">{ride.customer?.name || ride.guestName || 'Guest'}</p>
          {(ride.customer?.phone || ride.guestPhone) && (
            <a href={`tel:${ride.customer?.phone || ride.guestPhone}`}
              className="flex items-center gap-1 text-gray-400 text-xs hover:text-yellow-500 transition mt-1">
              <Phone size={12} /> {ride.customer?.phone || ride.guestPhone}
            </a>
          )}
        </div>
        <span className={`text-xs border px-2 py-1 rounded-full font-semibold ${statusColors[ride.status]}`}>
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </span>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MapPin size={12} className="text-green-400 shrink-0" /> {ride.pickup}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MapPin size={12} className="text-red-400 shrink-0" /> {ride.dropoff}
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-3 text-xs text-gray-400">
          <span>📅 {ride.date}</span>
          <span>🕐 {ride.time}</span>
          <span>👥 {ride.passengers}</span>
          <span className="text-yellow-500 font-bold">£{ride.price}</span>
        </div>
        {showComplete && (ride.status === 'confirmed' || ride.status === 'assigned') && (
          <button onClick={() => completeRide(ride._id)}
            className="bg-green-500 hover:bg-green-400 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition">
            Mark Complete ✓
          </button>
        )}
      </div>
    </div>
  )

  return (
    <DashboardLayout navItems={navItems} user={user} subtitle="Driver Portal">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Rides', value: rides.length, icon: Car, color: 'text-yellow-500' },
          { label: 'Upcoming', value: upcomingRides.length, icon: Clock, color: 'text-blue-400' },
          { label: 'Completed', value: completedRides.length, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Total Earnings', value: `£${totalEarnings}`, icon: Star, color: 'text-yellow-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            <Icon size={24} className={`${color} mb-3`} />
            <p className="text-2xl lg:text-3xl font-extrabold mb-1">{value}</p>
            <p className="text-gray-400 text-xs lg:text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* All Rides */}
      {active === 'rides' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-6">All Rides</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-10">Loading rides...</p>
          ) : rides.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🚗</p>
              <p className="text-gray-400">No rides assigned yet!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map(ride => <RideCard key={ride._id} ride={ride} showComplete={true} />)}
            </div>
          )}
        </div>
      )}

      {/* Upcoming */}
      {active === 'upcoming' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-6">Upcoming Rides</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-10">Loading...</p>
          ) : upcomingRides.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🗓️</p>
              <p className="text-gray-400">No upcoming rides!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingRides.map(ride => <RideCard key={ride._id} ride={ride} showComplete={true} />)}
            </div>
          )}
        </div>
      )}

      {/* Earnings */}
      {active === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
              <p className="text-3xl font-extrabold text-yellow-500">£{totalEarnings}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-2">Completed Rides</p>
              <p className="text-3xl font-extrabold text-green-400">{completedRides.length}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            <h3 className="font-bold mb-4">Completed Rides</h3>
            {completedRides.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No completed rides yet</p>
            ) : (
              <div className="space-y-4">
                {completedRides.map(ride => <RideCard key={ride._id} ride={ride} showComplete={false} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile */}
      {active === 'profile' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg lg:text-xl font-bold mb-6">My Profile</h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black font-extrabold text-2xl">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{user.name}</p>
                <p className="text-gray-400 text-sm">Driver Account</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-4">
                <User size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Full Name</p>
                  <p className="text-white text-sm font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-4">
                <Star size={18} className="text-yellow-500 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-white text-sm font-medium">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Rides', value: rides.length, color: 'text-white' },
                { label: 'Completed', value: completedRides.length, color: 'text-green-400' },
                { label: 'Earnings', value: `£${totalEarnings}`, color: 'text-yellow-500' },
              ].map(item => (
                <div key={item.label} className="text-center bg-gray-800 rounded-xl p-4">
                  <p className={`text-xl font-extrabold ${item.color}`}>{item.value}</p>
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

export default DriverDashboard