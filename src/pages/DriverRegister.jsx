import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff } from 'lucide-react'

function DriverRegister() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', license: '', vehicle: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Register user as driver
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: 'driver'
        })
      })
      const data = await res.json()
      if (data.token) {
        // Also create driver profile
        await fetch('http://localhost:5000/api/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.token}` },
          body: JSON.stringify({
            user: data.user.id,
            license: form.license,
            vehicle: form.vehicle,
          })
        })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/driver')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch {
      setError('Something went wrong!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Car size={22} className="text-black" />
            </div>
            <span className="text-white font-extrabold text-2xl">Taxi<span className="text-yellow-500">Go</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Driver Registration</h1>
          <p className="text-gray-400 text-sm mt-1">Join our team of professional drivers</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Smith' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+44 7700 900000' },
              { label: 'Driving License Number', name: 'license', type: 'text', placeholder: 'e.g. SMITH123456' },
              { label: 'Vehicle (Make & Model)', name: 'vehicle', type: 'text', placeholder: 'e.g. Mercedes E-Class' },
            ].map(field => (
              <div key={field.name}>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">{field.label}</label>
                <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange}
                  placeholder={field.placeholder} required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" />
              </div>
            ))}

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min 8 characters" required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition">
              {loading ? 'Registering...' : 'Register as Driver →'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-500 hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DriverRegister