import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/dashboard', icon: 'home', label: 'Home' },
  { to: '/add', icon: 'add_circle', label: 'Add' },
  { to: '/setup', icon: 'swap_horiz', label: 'Enxovais' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl rounded-t-xl shadow-nav px-4 py-2 flex justify-around items-center">
      {NAV.map(({ to, icon, label }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors active:scale-95 ${
              isActive && label !== 'Settings'
                ? 'text-primary bg-primary-container/30 active-nav-item'
                : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span className="text-label-md font-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
