import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function formatPrice(price) {
  return price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? ''
}

/* ── Mobile: horizontal row ── */
function MobileCard({ item, onToggle, onEdit }) {
  return (
    <div
      className="bg-white rounded-xl p-3 flex items-center gap-2 shadow-card transition-all w-full overflow-hidden"
      style={{ opacity: item.checked ? 0.6 : 1, transform: item.checked ? 'scale(0.98)' : 'scale(1)' }}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
        {item.img ? (
          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
            <span className="material-symbols-outlined text-on-surface-variant">image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <h4 className="text-label-md font-label text-on-surface truncate">{item.name}</h4>
        <p className="text-label-sm font-label text-on-surface-variant truncate">
          {item.qty} un{item.size ? ` • ${item.size}` : ''}{item.detail ? ` • ${item.detail}` : ''}
        </p>
      </div>

      {/* Edit button */}
      <button
        onClick={onEdit}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-primary-container/30 transition-colors active:scale-95"
        aria-label="Editar item"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
      </button>

      {/* Checkbox */}
      <Checkbox checked={item.checked} onToggle={onToggle} />
    </div>
  )
}

/* ── Desktop: vertical card with image ── */
function DesktopCard({ item, onToggle, onEdit }) {
  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-soft group hover:-translate-y-1 transition-all duration-300"
      style={{ opacity: item.checked ? 0.7 : 1 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl">image</span>
          </div>
        )}

        {/* Edit button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={onEdit}
            className="bg-white/80 backdrop-blur-md p-2 rounded-full text-on-surface hover:text-primary hover:bg-white transition-colors active:scale-95"
            aria-label="Editar item"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow min-w-0 pr-2">
            <h3 className="text-label-md font-label text-on-surface mb-1 truncate">{item.name}</h3>
            <p className="text-[12px] text-on-surface-variant truncate">
              {[item.size, item.detail].filter(Boolean).join(' • ') || null}
            </p>
          </div>
          <Checkbox checked={item.checked} onToggle={onToggle} />
        </div>
        <div className="flex items-center justify-between mt-4">
          {item.price && (
            <span className="text-primary font-bold" style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px' }}>
              {formatPrice(item.price)}
            </span>
          )}
          <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-lg ml-auto">
            <span className="text-[12px] font-bold text-on-surface-variant">Qtd: {item.qty}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Shared checkbox ── */
function Checkbox({ checked, onToggle }) {
  return (
    <label className="relative flex items-center justify-center w-touch-target h-touch-target cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      <div
        className="w-6 h-6 border-2 rounded-md transition-all flex items-center justify-center"
        style={{
          backgroundColor: checked ? '#7b5455' : 'transparent',
          borderColor: checked ? '#7b5455' : '#d4c2c2',
        }}
      >
        {checked && (
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'wght' 700", fontSize: '14px' }}
          >
            check
          </span>
        )}
      </div>
    </label>
  )
}

/* ── Default export ── */
export default function ItemCard({ item }) {
  const { toggleItem } = useApp()
  const navigate = useNavigate()

  const onToggle = () => toggleItem(item.id)
  const onEdit = () => navigate(`/edit/${item.id}`)

  return (
    <>
      <div className="md:hidden">
        <MobileCard item={item} onToggle={onToggle} onEdit={onEdit} />
      </div>
      <div className="hidden md:block">
        <DesktopCard item={item} onToggle={onToggle} onEdit={onEdit} />
      </div>
    </>
  )
}
