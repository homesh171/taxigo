import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff } from 'lucide-react'
import { api } from '../api'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data = await api.register({ ...form, role: 'customer' })
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } else {
      setError(data.message || 'Registration failed')
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Book your first airport transfer today</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Smith' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+44 7700 900000' },
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

            <p className="text-gray-500 text-xs">
              By registering you agree to our{' '}
              <a href="#" className="text-yellow-500 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-yellow-500 hover:underline">Privacy Policy</a>
            </p>

            <button type="submit" disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition">
              {loading ? 'Creating account...' : 'Create Account →'}
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

export default Register