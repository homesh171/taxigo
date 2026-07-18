import { ArrowRight, Star, Shield, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="min-h-screen bg-black flex items-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: '500px', height: '500px',
          background: 'rgba(234, 179, 8, 0.08)',
          borderRadius: '50%', filter: 'blur(100px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%',
          width: '300px', height: '300px',
          background: 'rgba(234, 179, 8, 0.05)',
          borderRadius: '50%', filter: 'blur(80px)'
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(234,179,8,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-yellow-500 text-xs font-semibold tracking-widest uppercase">UK's Premium Airport Transfer</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Your Ride,<br />
              <span className="text-yellow-500">On Time.</span><br />
              Every Time.
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Professional airport transfers across the UK. Fixed prices, licensed drivers, 
              and 24/7 support — so you never miss a flight.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/booking" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105">
                Book Your Transfer <ArrowRight size={18} />
              </Link>
              <a href="#services" className="flex items-center gap-2 border border-gray-700 hover:border-yellow-500 text-white px-8 py-4 rounded-full text-base transition-all">
                Our Services
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Star, text: '4.9★ Rated Service' },
                { icon: Shield, text: 'Licensed & Insured' },
                { icon: Clock, text: '24/7 Available' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-400 text-sm">
                  <Icon size={16} className="text-yellow-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Booking Preview Card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(234,179,8,0.2)',
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(20px)'
          }}>
            <h3 className="text-white font-bold text-xl mb-6">Get an Instant Quote</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g. Heathrow Airport, London"
                  className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Drop-off Location</label>
                <input
                  type="text"
                  placeholder="e.g. Central London Hotel"
                  className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Date</label>
                  <input
                    type="date"
                    className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Time</label>
                  <input
                    type="time"
                    className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Passengers</label>
                <select className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition">
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <Link to="/booking" className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl text-center transition-all hover:scale-105">
                Search Available Cars →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-gray-800">
          {[
            { value: '50,000+', label: 'Happy Customers' },
            { value: '200+', label: 'Licensed Drivers' },
            { value: '30+', label: 'UK Airports Covered' },
            { value: '99.8%', label: 'On-time Rate' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-yellow-500 mb-1">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero