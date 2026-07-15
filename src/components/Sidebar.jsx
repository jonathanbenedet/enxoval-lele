import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const CATEGORIES = [
  { id: 'all',      label: 'Todos',        icon: 'apps' },
  { id: 'clothing', label: 'Vestuário',    icon: 'checkroom' },
  { id: 'hygiene',  label: 'Higiene',      icon: 'bathtub' },
  { id: 'nursery',  label: 'Quarto',       icon: 'crib' },
  { id: 'travel',   label: 'Passeio',      icon: 'stroller' },
  { id: 'feeding',  label: 'Alimentação',  icon: 'restaurant' },
]

export default function Sidebar() {
  const { activeCategory, setActiveCategory, household } = useApp()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(household?.invite_code ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside className="hidden md:flex w-64 flex-col fixed left-0 top-[44px] h-[calc(100vh-44px)] bg-surface-container-low border-r border-outline-variant/10 p-stack-md overflow-y-auto z-40">
      <div className="flex flex-col h-full">
        <div className="space-y-stack-sm mt-stack-md flex-1">
          <div className="px-3 py-2 text-on-tertiary-fixed-variant text-[10px] font-label uppercase tracking-widest">
            Categorias
          </div>
          <nav className="space-y-1">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-label-md font-label transition-colors text-left ${
                    isActive
                      ? 'bg-primary-container/30 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-variant/50'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Switch household */}
        <button
          onClick={() => navigate('/setup')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-label-md font-label text-on-surface-variant hover:bg-surface-variant/50 transition-colors text-left"
        >
          <span className="material-symbols-outlined">swap_horiz</span>
          Trocar enxoval
        </button>

        {/* Invite code */}
        {household?.invite_code && (
          <div className="mt-auto pt-stack-lg border-t border-outline-variant/10">
            <div className="px-3 py-2 text-on-tertiary-fixed-variant text-[10px] font-label uppercase tracking-widest mb-2">
              Código de convite
            </div>
            <div className="bg-surface-container rounded-xl p-3">
              <p className="text-label-sm font-label text-on-surface-variant mb-2">
                Compartilhe com seu parceiro para acessar juntos.
              </p>
              <button
                onClick={copyCode}
                className="w-full flex items-center justify-between bg-primary-container/20 hover:bg-primary-container/40 transition-colors rounded-lg px-3 py-2 group"
              >
                <span className="text-headline-md text-primary tracking-widest font-bold" style={{ fontFamily: 'monospace' }}>
                  {household.invite_code}
                </span>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
              {copied && (
                <p className="text-label-sm font-label text-primary mt-1 text-center">Copiado!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
