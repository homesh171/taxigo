function HowItWorks() {
  const steps = [
    { num: '01', title: 'Book Online', desc: 'Fill in your journey details, choose your vehicle and confirm your booking in minutes.', icon: '📱' },
    { num: '02', title: 'Get Confirmed', desc: 'Receive instant confirmation via email with your driver details and booking reference.', icon: '✅' },
    { num: '03', title: 'Track Your Driver', desc: 'On the day, track your driver in real-time so you know exactly when they arrive.', icon: '📍' },
    { num: '04', title: 'Enjoy Your Ride', desc: 'Sit back and relax in a clean, comfortable vehicle driven by a professional chauffeur.', icon: '✈️' },
  ]

  return (
    <section id="how" className="bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-yellow-500 text-xs uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Booking your airport transfer has never been easier. Follow these simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-yellow-500 to-transparent z-10" />
              )}
              <div className="bg-gray-900 border border-gray-800 hover:border-yellow-500 rounded-2xl p-6 transition-all hover:-translate-y-2">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-yellow-500 font-mono text-sm font-bold mb-2">{step.num}</div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks