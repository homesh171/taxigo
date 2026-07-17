function Testimonials() {
  const reviews = [
    { name: 'James Morrison', location: 'London', rating: 5, text: 'Absolutely brilliant service! Driver was waiting for me at arrivals with a name board. Car was spotless and driver was professional throughout. Will definitely use again.' },
    { name: 'Sarah Thompson', location: 'Manchester', rating: 5, text: 'Used TaxiGo for an early morning Heathrow pickup. Driver was on time, helped with luggage and the car was immaculate. Fixed price meant no surprises. Highly recommend!' },
    { name: 'David Chen', location: 'Birmingham', rating: 5, text: 'Booked an executive car for a business trip. The service was impeccable — smooth booking, professional driver, luxury vehicle. Exactly what you expect from a premium transfer.' },
    { name: 'Emma Williams', location: 'Edinburgh', rating: 5, text: 'TaxiGo saved us when our flight was delayed. They monitored our flight and adjusted the pickup time automatically. No extra charges either. Amazing service!' },
  ]

  return (
    <section id="reviews" className="bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-yellow-500 text-xs uppercase tracking-widest mb-3">Reviews</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-yellow-500 text-xl">★★★★★</span>
            <span className="text-white font-bold">4.9/5</span>
            <span className="text-gray-400 text-sm">from 2,400+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500 transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{review.name}</p>
                  <p className="text-gray-400 text-xs">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials