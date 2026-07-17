import { useState } from 'react'
import { Car, Menu, X, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

function DashboardLayout({ children, navItems, user, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-yellow-500 p-1.5 rounded-lg">
              <Car size={18} className="text-black" />
            </div>
            <span className="font-extrabold text-lg">Taxi<span className="text-yellow-500">Go</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {subtitle && (
          <div className="px-6 py-2 border-b border-gray-800">
            <p className="text-xs text-yellow-500 font-semibold">{subtitle}</p>
          </div>
        )}

        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1">
          {navItems.map(({ id, label, icon: Icon, onClick, active }) => (
            <button key={id} onClick={onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition mb-1 ${active ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-1.5 rounded-lg">
              <Car size={16} className="text-black" />
            </div>
            <span className="font-extrabold">Taxi<span className="text-yellow-500">Go</span></span>
          </div>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout