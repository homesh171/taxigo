function Airports() {
  const airports = [
    { name: 'Heathrow Airport', code: 'LHR', terminals: '5 Terminals', city: 'London' },
    { name: 'Gatwick Airport', code: 'LGW', terminals: '2 Terminals', city: 'London' },
    { name: 'Manchester Airport', code: 'MAN', terminals: '3 Terminals', city: 'Manchester' },
    { name: 'Birmingham Airport', code: 'BHX', terminals: '1 Terminal', city: 'Birmingham' },
    { name: 'Stansted Airport', code: 'STN', terminals: '1 Terminal', city: 'London' },
    { name: 'Edinburgh Airport', code: 'EDI', terminals: '1 Terminal', city: 'Edinburgh' },
    { name: 'Bristol Airport', code: 'BRS', terminals: '1 Terminal', city: 'Bristol' },
    { name: 'Leeds Bradford', code: 'LBA', terminals: '1 Terminal', city: 'Leeds' },
  ]

  return (
    <section id="airports" className="bg-gray-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-yellow-500 text-xs uppercase tracking-widest mb-3">Coverage</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">Airports We Cover</h2>
          <p className="text-gray-400 max-w-xl mx-auto">We provide transfers to and from all major UK airports, 24 hours a day, 7 days a week.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {airports.map(airport => (
            <div key={airport.code} className="group bg-gray-900 border border-gray-800 hover:border-yellow-500 rounded-2xl p-5 transition-all hover:-translate-y-1 cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-yellow-500 bg-opacity-10 text-yellow-500 font-bold text-sm px-2 py-1 rounded-lg">{airport.code}</span>
                <span className="text-gray-500 text-xs">{airport.terminals}</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{airport.name}</h3>
              <p className="text-gray-400 text-xs">{airport.city}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Airports