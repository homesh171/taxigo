import { useState, useEffect } from 'react'
import { Car, Users, Clock, User, Star, Trash2, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import DashboardLayout from '../components/DashboardLayout'

const statusColors = {
  confirmed: 'bg-green-500 bg-opacity-10 text-green-400 border-green-500',
  completed: 'bg-blue-500 bg-opacity-10 text-blue-400 border-blue-500',
  pending: 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-yellow-500',
  cancelled: 'bg-red-500 bg-opacity-10 text-red-400 border-red-500',
}

function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const [bookings, setBookings] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [driverForm, setDriverForm] = useState({ name: '', email: '', phone: '', password: '', license: '', vehicle: '' })
  const [driverLoading, setDriverLoading] = useState(false)
  const [driverError, setDriverError] = useState('')

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [bookingsData, driversData] = await Promise.all([
      api.getAllBookings(token),
      api.getDrivers(token)
    ])
    setBookings(Array.isArray(bookingsData) ? bookingsData : [])
    setDrivers(Array.isArray(driversData) ? driversData : [])
    setLoading(false)
  }

  const assignDriver = async (bookingId, driverId) => {
    await api.assignDriver(bookingId, driverId, token)
    fetchData()
  }

  const handleAddDriver = async (e) => {
    e.preventDefault()
    setDriverLoading(true)
    setDriverError('')
    try {
      const registerRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: driverForm.name,
          email: driverForm.email,
          phone: driverForm.phone,
          password: driverForm.password,
          role: 'driver'
        })
      })
      const registerData = await registerRes.json()

      if (!registerData.token) {
        setDriverError(registerData.message || 'Failed to create driver account')
        setDriverLoading(false)
        return
      }

      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          user: registerData.user.id,
          license: driverForm.license,
          vehicle: driverForm.vehicle,
        })
      })

      setShowAddDriver(false)
      setDriverForm({ name: '', email: '', phone: '', password: '', license: '', vehicle: '' })
      fetchData()
    } catch (err) {
      setDriverError('Something went wrong!')
    }
    setDriverLoading(false)
  }

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('Are you sure you want to remove this driver?')) return
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/drivers/${driverId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchData()
    } catch (err) {
      console.log('Delete error:', err)
    }
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0)

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Star, active: active === 'overview', onClick: () => setActive('overview') },
    { id: 'bookings', label: 'All Bookings', icon: Car, active: active === 'bookings', onClick: () => setActive('bookings') },
    { id: 'drivers', label: 'Manage Drivers', icon: Users, active: active === 'drivers', onClick: () => setActive('drivers') },
  ]

  return (
    <DashboardLayout navItems={navItems} user={user} subtitle="Admin Panel">

      {/* Overview */}
      {active === 'overview' && (
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: bookings.length, icon: Car, color: 'text-yellow-500' },
              { label: 'Total Revenue', value: `£${totalRevenue}`, icon: Star, color: 'text-green-400' },
              { label: 'Total Drivers', value: drivers.length, icon: Users, color: 'text-blue-400' },
              { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: Clock, color: 'text-orange-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
                <Icon size={24} className={`${color} mb-3`} />
                <p className="text-2xl lg:text-3xl font-extrabold mb-1">{value}</p>
                <p className="text-gray-400 text-xs lg:text-sm">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
            {loading ? (
              <p className="text-gray-400 text-center py-6">Loading...</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map(b => (
                  <div key={b._id} className="flex justify-between items-center border border-gray-800 rounded-xl p-3 lg:p-4">
                    <div>
                      <p className="text-yellow-500 text-xs font-bold">#{b._id.slice(-6).toUpperCase()}</p>
                      <p className="text-white text-sm">{b.customer?.name}</p>
                      <p className="text-gray-400 text-xs">{b.pickup} → {b.dropoff}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-500 font-bold">£{b.price}</p>
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Bookings */}
      {active === 'bookings' && (
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-6">All Bookings</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            {loading ? (
              <p className="text-gray-400 text-center py-10">Loading...</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b._id} className="border border-gray-800 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-yellow-500 font-bold text-xs">#{b._id.slice(-6).toUpperCase()}</p>
                        <p className="text-white font-semibold text-sm">{b.customer?.name}</p>
                        <p className="text-gray-400 text-xs">{b.pickup} → {b.dropoff}</p>
                        <p className="text-gray-500 text-xs mt-1">📅 {b.date} 🕐 {b.time} 🚗 {b.vehicle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-500 font-bold">£{b.price}</p>
                        <span className={`text-xs border px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-800">
                      <span className="text-gray-400 text-xs">
                        Driver: <span className="text-white">{b.driver?.name || 'Unassigned'}</span>
                      </span>
                      {!b.driver && drivers.length > 0 && (
                        <select onChange={(e) => assignDriver(b._id, e.target.value)}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs outline-none"
                          defaultValue="">
                          <option value="" disabled>Assign Driver</option>
                          {drivers.map(d => (
                            <option key={d._id} value={d.user?._id}>{d.user?.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manage Drivers */}
      {active === 'drivers' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Manage Drivers</h2>
            <button onClick={() => setShowAddDriver(true)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-full text-sm transition">
              <Plus size={16} /> <span className="hidden sm:block">Add Driver</span>
            </button>
          </div>

          {/* Add Driver Modal */}
          {showAddDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Add New Driver</h3>
                  <button onClick={() => setShowAddDriver(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleAddDriver} className="space-y-4">
                  {[
                    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Smith' },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'john@example.com' },
                    { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+44 7700 900000' },
                    { label: 'Password', name: 'password', type: 'password', placeholder: 'Min 8 characters' },
                    { label: 'License Number', name: 'license', type: 'text', placeholder: 'e.g. SMITH123456' },
                    { label: 'Vehicle', name: 'vehicle', type: 'text', placeholder: 'e.g. Mercedes E-Class' },
                  ].map(field => (
                    <div key={field.name}>
                      <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">{field.label}</label>
                      <input type={field.type} name={field.name} value={driverForm[field.name]}
                        onChange={(e) => setDriverForm({ ...driverForm, [e.target.name]: e.target.value })}
                        placeholder={field.placeholder} required
                        className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition" />
                    </div>
                  ))}
                  {driverError && <p className="text-red-400 text-sm">{driverError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddDriver(false)}
                      className="flex-1 border border-gray-700 text-white font-bold py-3 rounded-xl transition hover:border-gray-500">
                      Cancel
                    </button>
                    <button type="submit" disabled={driverLoading}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition">
                      {driverLoading ? 'Adding...' : 'Add Driver'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 lg:p-6">
            {loading ? (
              <p className="text-gray-400 text-center py-10">Loading...</p>
            ) : drivers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🚗</p>
                <p className="text-gray-400">No drivers added yet!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {drivers.map(d => (
                  <div key={d._id} className="border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{d.user?.name}</p>
                        <p className="text-gray-400 text-xs">{d.user?.phone} · {d.license}</p>
                        <p className="text-gray-500 text-xs">{d.vehicle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-white font-bold text-sm">{d.totalRides} rides</p>
                        <p className="text-yellow-500 text-xs">{d.rating}★</p>
                      </div>
                      <button onClick={() => handleDeleteDriver(d._id)} className="text-red-400 hover:text-red-300 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AdminDashboard