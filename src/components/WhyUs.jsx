import { Shield, Clock, CreditCard, Phone, Star, Car } from 'lucide-react'

function WhyUs() {
  const features = [
    { icon: Clock, title: 'Flight Monitoring', desc: 'We track your flight in real-time and adjust pickup time if your flight is delayed — at no extra charge.' },
    { icon: Shield, title: 'Fully Licensed', desc: 'All our drivers are fully licensed, DBS checked, and insured to the highest UK standards.' },
    { icon: CreditCard, title: 'Fixed Prices', desc: 'No surge pricing, no hidden fees. The price you see is the price you pay — always.' },
    { icon: Phone, title: '24/7 Support', desc: 'Our support team is available around the clock via phone, email, and live chat.' },
    { icon: Star, title: 'Meet & Greet', desc: 'Your driver will meet you at arrivals with a name board and help with your luggage.' },
    { icon: Car, title: 'Premium Fleet', desc: 'Choose from Saloon, MPV, Executive, and Minibus — all modern, clean, and comfortable.' },
  ]

  return (
    <section id="why" className="bg-gray-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-yellow-500 text-xs uppercase tracking-widest mb-3">Why Choose Us</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">The TaxiGo Difference</h2>
          <p className="text-gray-400 max-w-xl mx-auto">We're not just another taxi company. We're a premium airport transfer service built around your needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group bg-gray-900 border border-gray-800 hover:border-yellow-500 rounded-2xl p-6 transition-all hover:-translate-y-1">
              <div className="bg-yellow-500 bg-opacity-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-all">
                <Icon size={22} className="text-yellow-500 group-hover:text-black transition-all" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs