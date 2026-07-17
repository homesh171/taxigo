import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff } from 'lucide-react'
import { api } from '../api'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  const data = await api.login(form)
  if (data.token) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    // Use ACTUAL role from database, not the selected button
    if (data.user.role === 'customer') navigate('/dashboard')
    else if (data.user.role === 'driver') navigate('/driver')
    else if (data.user.role === 'admin') navigate('/admin')
    else navigate('/dashboard')
  } else {
    setError(data.message || 'Login failed')
  }
  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Car size={22} className="text-black" />
            </div>
            <span className="text-white font-extrabold text-2xl">Taxi<span className="text-yellow-500">Go</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition" />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-500 hover:underline font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login