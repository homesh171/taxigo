import { Car } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Car size={18} className="text-black" />
            </div>
            <span className="text-white font-extrabold text-xl">Taxi<span className="text-yellow-500">Go</span></span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">UK's most trusted airport transfer service. Available 24/7 across all major airports.</p>
        </div>

        {[
  { title: 'Services', links: [
    { label: 'Airport Transfers', href: '#' },
    { label: 'Executive Cars', href: '#' },
    { label: 'Minibus Hire', href: '#' },
    { label: 'Corporate Travel', href: '#' },
  ]},
  { title: 'Airports', links: [
    { label: 'Heathrow', href: '#' },
    { label: 'Gatwick', href: '#' },
    { label: 'Manchester', href: '#' },
    { label: 'Birmingham', href: '#' },
  ]},
  { title: 'Company', links: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Drive With Us', href: '/driver/register' },
  ]},
].map(col => (
  <div key={col.title}>
    <h4 className="text-white font-bold mb-4">{col.title}</h4>
    <ul className="space-y-2">
      {col.links.map(link => (
        <li key={link.label}>
          <a href={link.href} className="text-gray-400 hover:text-yellow-500 text-sm transition">{link.label}</a>
        </li>
      ))}
    </ul>
  </div>
))}
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TaxiGo. All rights reserved. | UK Airport Transfers
      </div>
    </footer>
  )
}

export default Footer