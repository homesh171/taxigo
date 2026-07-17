import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'

function CTA() {
  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div style={{
          background: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.05))',
          border: '1px solid rgba(234,179,8,0.2)',
          borderRadius: '32px',
          padding: '64px 48px'
        }}>
          <p className="text-yellow-500 text-xs uppercase tracking-widest mb-4">Ready to Travel?</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Book Your Airport<br />Transfer Today
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Fixed prices, professional drivers, and 24/7 support across all major UK airports.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/booking" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-full transition-all hover:scale-105">
              Book Now <ArrowRight size={18} />
            </Link>
            <a href="tel:+441234567890" className="flex items-center gap-2 border border-gray-700 hover:border-yellow-500 text-white px-8 py-4 rounded-full transition-all">
              <Phone size={18} className="text-yellow-500" /> Call Us Now
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-6">No booking fees · Instant confirmation · Free cancellation up to 24hrs</p>
        </div>
      </div>
    </section>
  )
}

export default CTA