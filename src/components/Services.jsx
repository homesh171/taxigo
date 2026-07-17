import { Car, Users, Briefcase, Bus } from 'lucide-react'

const vehicles = [
  { icon: Car, name: 'Saloon', desc: 'Up to 4 passengers', price: 'From £25', eg: 'Toyota Prius, VW Passat' },
  { icon: Users, name: 'MPV', desc: 'Up to 6 passengers', price: 'From £35', eg: 'Ford Galaxy, VW Sharan' },
  { icon: Briefcase, name: 'Executive', desc: 'Up to 4 passengers', price: 'From £55', eg: 'Mercedes E-Class, BMW 5' },
  { icon: Bus, name: 'Minibus', desc: 'Up to 8 passengers', price: 'From £65', eg: 'Mercedes Vito, Ford Transit' },
]

function Services() {
  return (
    <section id="services" className="bg-gray-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-yellow-500 text-xs uppercase tracking-widest mb-3">Our Fleet</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">Choose Your Ride</h2>
          <p className="text-gray-400 max-w-xl mx-auto">All vehicles are fully licensed, insured, and driven by professional chauffeurs across the UK.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map(({ icon: Icon, name, desc, price, eg }) => (
            <div key={name} className="group border border-gray-800 hover:border-yellow-500 bg-gray-900 rounded-2xl p-6 transition-all hover:-translate-y-2 cursor-pointer">
              <div className="bg-yellow-500 bg-opacity-10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:bg-yellow-500 transition-all">
                <Icon size={24} className="text-yellow-500 group-hover:text-black transition-all" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
              <p className="text-gray-400 text-sm mb-2">{desc}</p>
              <p className="text-gray-500 text-xs mb-4">{eg}</p>
              <p className="text-yellow-500 font-bold text-lg">{price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services