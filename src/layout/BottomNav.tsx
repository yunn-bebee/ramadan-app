import { NavLink } from 'react-router-dom'
import { HiHome, HiHeart, HiBookOpen, HiPencilAlt, HiCog } from 'react-icons/hi'

export default function BottomNav() {
  const baseClasses =
    "flex flex-col items-center text-xs transition-colors"

  const activeClasses = "text-night font-medium"
  const inactiveClasses = "text-neutral-500 hover:text-night"

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 flex items-center justify-around shadow-lg z-50">
      
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <HiHome size={22} className="mb-1" />
        Home
      </NavLink>

      <NavLink
        to="/ibadah"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <HiHeart size={22} className="mb-1" />
        Ibadah
      </NavLink>

      <NavLink
        to="/quran"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <HiBookOpen size={22} className="mb-1" />
        Quran
      </NavLink>

      <NavLink
        to="/journal"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <HiPencilAlt size={22} className="mb-1" />
        Journal
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        <HiCog size={22} className="mb-1" />
        Settings
      </NavLink>

    </nav>
  )
}
