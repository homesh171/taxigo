import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../api'
import AddressInput from '../components/AddressInput'

const vehicles = [
  { id: 1, name: 'Saloon', desc: 'Up to 4 passengers', price: 25, eg: 'Toyota Prius, VW Passat' },
  { id: 2, name: 'MPV', desc: 'Up to 6 passengers', price: 35, eg: 'Ford Galaxy, VW Sharan' },
  { id: 3, name: 'Executive', desc: 'Up to 4 passengers', price: 55, eg: 'Mercedes E-Class, BMW 5' },
  { id: 4, name: 'Minibus', desc: 'Up to 8 passengers', price: 65, eg: 'Mercedes Vito, Ford Transit' },
]

function Booking() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [bookingType, setBookingType] = useState(null) // 'guest' or 'login'
  const [form, setForm] = useState({
    pickup: searchParams.get('pickup') || '',
    dropoff: searchParams.get('dropoff') || '',
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
    passengers: searchParams.get('passengers') || 1,
    flight: '',
    vehicle: null,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isLoggedIn = !!token && !!user

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isLoggedIn) {
      const data = await api.createBooking({
        pickup: form.pickup,
        dropoff: form.dropoff,
        date: form.date,
        time: form.time,
        passengers: form.passengers,
        flight: form.flight,
        vehicle: form.vehicle.name,
        price: form.vehicle.price,
      }, token)
      if (data._id) {
        setConfirmed(data)
      } else {
        setError(data.message || 'Booking failed!')
      }
    } else {
      const data = await api.createGuestBooking({
        pickup: form.pickup,
        dropoff: form.dropoff,
        date: form.date,
        time: form.time,
        passengers: form.passengers,
        flight: form.flight,
        vehicle: form.vehicle.name,
        price: form.vehicle.price,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
      })
      if (data._id) {
        setConfirmed(data)
      } else {
        setError(data.message || 'Booking failed!')
      }
    }
    setLoading(false)
  }

  // Show booking confirmed page
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-extrabold mb-3">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-8">Thank you for choosing TaxiGo. Your transfer has been booked successfully.</p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left mb-8">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-1">Booking Reference</p>
              <p className="text-3xl font-extrabold text-yellow-500">{confirmed.bookingReference}</p>
              <p className="text-gray-500 text-xs mt-2">Save this reference to manage your booking</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">From</span><span className="text-white">{confirmed.pickup}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">To</span><span className="text-white">{confirmed.dropoff}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date & Time</span><span className="text-white">{confirmed.date} at {confirmed.time}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Vehicle</span><span className="text-white">{confirmed.vehicle}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Passengers</span><span className="text-white">{confirmed.passengers}</span></div>
              <div className="flex justify-between border-t border-gray-800 pt-3">
                <span className="text-white font-bold">Total</span>
                <span className="text-yellow-500 font-bold text-lg">£{confirmed.price}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {isLoggedIn ? (
              <button onClick={() => navigate('/dashboard')}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-full transition">
                View My Bookings →
              </button>
            ) : (
              <button onClick={() => navigate('/manage-booking')}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-full transition">
                Manage My Booking →
              </button>
            )}
            <button onClick={() => navigate('/')}
              className="border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-full transition">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">

        {/* Progress */}
        <div className="flex items-center gap-3 mb-12">
          {['Journey Details', 'Choose Vehicle', 'Your Details'].map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-yellow-500 text-black' : step === i + 1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${step === i + 1 ? 'text-yellow-500 font-semibold' : 'text-gray-500'}`}>{s}</span>
              {i < 2 && <div className="flex-1 h-px bg-gray-800" />}
            </div>
          ))}
        </div>

        {/* Step 1 - Journey Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-6">Journey Details</h2>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Pickup Location</label>
              <AddressInput name="pickup" value={form.pickup}
                onChange={(name, value) => setForm({ ...form, [name]: value })}
                placeholder="e.g. Heathrow Terminal 5, London" />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Drop-off Location</label>
              <AddressInput name="dropoff" value={form.dropoff}
                onChange={(name, value) => setForm({ ...form, [name]: value })}
                placeholder="e.g. Central London Hotel" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Time</label>
                <input type="time" name="time" value={form.time} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Passengers</label>
                <select name="passengers" value={form.passengers} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Flight Number (Optional)</label>
                <input type="text" name="flight" value={form.flight} onChange={handleChange}
                  placeholder="e.g. BA123"
                  className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" />
              </div>
            </div>
            <button onClick={() => setStep(2)}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition mt-4">
              Continue to Vehicle Selection →
            </button>
          </div>
        )}

        {/* Step 2 - Choose Vehicle */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Your Vehicle</h2>
            <div className="space-y-4 mb-6">
              {vehicles.map(v => (
                <div key={v.id} onClick={() => setForm({ ...form, vehicle: v })}
                  className={`border rounded-xl p-5 cursor-pointer transition-all ${form.vehicle?.id === v.id ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{v.name}</h3>
                      <p className="text-gray-400 text-sm">{v.desc}</p>
                      <p className="text-gray-500 text-xs mt-1">{v.eg}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-500 font-bold text-xl">£{v.price}</p>
                      <p className="text-gray-500 text-xs">Starting from</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-bold py-4 rounded-xl transition">← Back</button>
              <button onClick={() => setStep(3)} disabled={!form.vehicle}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3 - Your Details */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-6">Your Details</h2>

            {/* If not logged in show options */}
            {!isLoggedIn && !bookingType && (
              <div className="space-y-4 mb-6">
                <p className="text-gray-400 text-sm text-center">How would you like to continue?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setBookingType('guest')}
                    className="border border-gray-700 hover:border-yellow-500 rounded-xl p-5 text-left transition group">
                    <div className="text-2xl mb-3">👤</div>
                    <h3 className="font-bold text-white mb-1">Continue as Guest</h3>
                    <p className="text-gray-400 text-xs">No account needed. Get a booking reference by email.</p>
                  </button>
                  <button onClick={() => navigate('/login')}
                    className="border border-gray-700 hover:border-yellow-500 rounded-xl p-5 text-left transition group">
                    <div className="text-2xl mb-3">🔐</div>
                    <h3 className="font-bold text-white mb-1">Login / Register</h3>
                    <p className="text-gray-400 text-xs">Sign in to save bookings to your account.</p>
                  </button>
                </div>
              </div>
            )}

            {/* Guest form */}
            {!isLoggedIn && bookingType === 'guest' && (
              <div className="space-y-4">
                <p className="text-yellow-500 text-sm font-semibold">Guest Booking</p>
                {[
                  { label: 'Full Name', name: 'guestName', type: 'text', placeholder: 'John Smith' },
                  { label: 'Email Address', name: 'guestEmail', type: 'email', placeholder: 'john@example.com' },
                  { label: 'Phone Number', name: 'guestPhone', type: 'tel', placeholder: '+44 7700 900000' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">{field.label}</label>
                    <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange}
                      placeholder={field.placeholder} required
                      className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" />
                  </div>
                ))}
              </div>
            )}

            {/* Logged in user info */}
            {isLoggedIn && (
              <div className="bg-gray-900 border border-yellow-500 border-opacity-30 rounded-xl p-4">
                <p className="text-yellow-500 text-sm font-semibold mb-1">✅ Logged in as {user.name}</p>
                <p className="text-gray-400 text-xs">Your booking will be saved to your account.</p>
              </div>
            )}

            {/* Summary */}
            {(isLoggedIn || bookingType === 'guest') && (
              <>
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                  <h4 className="font-bold mb-4 text-yellow-500">Booking Summary</h4>
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex justify-between"><span>From</span><span className="text-white">{form.pickup}</span></div>
                    <div className="flex justify-between"><span>To</span><span className="text-white">{form.dropoff}</span></div>
                    <div className="flex justify-between"><span>Date & Time</span><span className="text-white">{form.date} at {form.time}</span></div>
                    <div className="flex justify-between"><span>Passengers</span><span className="text-white">{form.passengers}</span></div>
                    <div className="flex justify-between"><span>Vehicle</span><span className="text-white">{form.vehicle?.name}</span></div>
                    {form.flight && <div className="flex justify-between"><span>Flight</span><span className="text-white">{form.flight}</span></div>}
                    <div className="flex justify-between border-t border-gray-700 pt-3">
                      <span className="font-bold text-white">Total</span>
                      <span className="font-bold text-yellow-500 text-xl">£{form.vehicle?.price}</span>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-3">
                  <button onClick={() => { setStep(2); setBookingType(null) }}
                    className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-bold py-4 rounded-xl transition">← Back</button>
                  <button onClick={handleSubmit} disabled={loading}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition">
                    {loading ? 'Confirming...' : `Confirm Booking £${form.vehicle?.price} →`}
                  </button>
                </div>
              </>
            )}

            {/* Back button when showing options */}
            {!isLoggedIn && !bookingType && (
              <button onClick={() => setStep(2)}
                className="w-full border border-gray-700 hover:border-gray-500 text-white font-bold py-4 rounded-xl transition">
                ← Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Booking