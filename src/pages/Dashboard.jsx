import { useState } from 'react'
import { useApp } from '../context/AppContext'
import BottomNav from '../components/BottomNav'
import Sidebar from '../components/Sidebar'
import ItemCard from '../components/ItemCard'
import { useNavigate } from 'react-router-dom'

const MOBILE_CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'clothing', label: 'Vestuário' },
  { id: 'hygiene', label: 'Higiene' },
  { id: 'nursery', label: 'Quarto' },
  { id: 'feeding', label: 'Alimentação' },
]

const FILTER_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'bought', label: 'Comprados' },
]

const CATEGORY_LABELS = {
  clothing: 'Vestuário', hygiene: 'Higiene', nursery: 'Quarto', feeding: 'Alimentação', travel: 'Passeio',
}

const CATEGORY_STATS = [
  { label: 'Roupas', pct: 85 },
  { label: 'Higiene', pct: 42 },
  { label: 'Quarto', pct: 12 },
]

export default function Dashboard() {
  const { items, activeCategory, setActiveCategory, activeFilter, setActiveFilter, progress, checkedCount, totalItems, signOut } = useApp()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const q = searchQuery.trim().toLowerCase()

  const byCat = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)
  const byStatus = activeFilter === 'pending' ? byCat.filter(i => !i.checked)
    : activeFilter === 'bought' ? byCat.filter(i => i.checked) : byCat
  const filtered = q
    ? byStatus.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.detail?.toLowerCase().includes(q) ||
        (CATEGORY_LABELS[i.category] ?? i.category).toLowerCase().includes(q)
      )
    : byStatus

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="bg-background text-on-surface min-h-screen">

      {/* ── Top AppBar ── */}
      <header className="bg-surface/80 backdrop-blur-xl z-50 sticky top-0 w-full flex justify-between items-center px-container-padding h-touch-target shadow-sm">
        <div className="flex items-center gap-stack-md">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg4HXM2J9gRpaOZt7yXP1JFhEP4FdGU5hTpJI98yXKXpRQmrucdVHH-OWAyeEGZiBeehaYAe4n9m7KgvrzKN7vhyVynV3sEWRcShkEP3BpmURGIJcJHq2qjlZeS_MlRRSM22-IJWVJTPCrin9lCHgKfcaFhZJqnAJ0V8osT8AzFVUwzcgFzMabo6v42pXmi1ViAIyKIuRTPILcT-Qk-_1qEQPuAh4tEgbPTXdWWisG34URLALYTI3a"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-headline-md text-primary" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
            Enxoval Letícia
          </h1>
        </div>

        {/* Desktop: search bar */}
        <div className="flex-1 max-w-xl px-stack-lg hidden md:block">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar no enxoval..."
              className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-9 text-body-md focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              style={{ fontSize: '16px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-stack-md">
          {/* Desktop: Add Item button */}
          <button
            onClick={() => navigate('/add')}
            className="hidden md:flex bg-primary text-on-primary text-label-md font-label px-6 py-2 rounded-full hover:opacity-90 transition-all active:scale-95 items-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
            <span>Novo item</span>
          </button>
          <button className="hover:opacity-80 transition-opacity p-2 rounded-full active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <button
            onClick={signOut}
            title="Sair"
            className="hover:opacity-80 transition-opacity p-2 rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface-variant">logout</span>
          </button>
        </div>
      </header>

      {/* ── Layout shell ── */}
      <div className="flex min-h-[calc(100vh-44px)]">
        <Sidebar />

        {/* ── Main content ── */}
        <main className="flex-1 md:ml-64 p-container-padding pb-24 md:pb-8">

          {/* Mobile: welcome + chips */}
          <div className="md:hidden space-y-stack-md mb-stack-lg">
            <div>
              <h2 className="text-headline-lg-mobile text-on-surface" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                Olá, Mamãe
              </h2>
              <p className="text-body-md text-on-surface-variant">Sua jornada está {progress}% concluída.</p>
            </div>
            {/* Mobile progress card */}
            <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-soft">
              <div className="flex justify-between items-end mb-stack-sm">
                <div>
                  <span className="text-headline-md text-primary" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                    {progress}% Completo
                  </span>
                  <p className="text-label-md font-label text-on-surface-variant mt-1">
                    {checkedCount} de {totalItems} itens comprados
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '32px' }}>child_care</span>
              </div>
              <div className="h-2 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
            {/* Mobile category chips */}
            <div className="overflow-x-auto hide-scrollbar -mx-container-padding px-container-padding">
              <div className="flex gap-stack-sm">
                {MOBILE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-stack-md py-2 rounded-full text-label-md font-label transition-all active:scale-95 whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary-container/50 text-on-surface-variant hover:bg-secondary-container'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '20px' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar no enxoval..."
                className="w-full bg-surface-container-low border-none rounded-full py-3 pl-10 pr-9 text-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                style={{ fontSize: '16px' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                </button>
              )}
            </div>
          </div>

          {/* Desktop: hero progress card */}
          <section className="hidden md:block mb-stack-lg">
            <div className="bg-white rounded-[32px] p-8 shadow-soft flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/20 rounded-full blur-3xl" />
              <div className="w-full md:w-1/3 text-center md:text-left z-10">
                <h1 className="text-headline-lg-mobile text-primary mb-2" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                  Quase lá, Papais!
                </h1>
                <p className="text-body-md text-on-surface-variant">
                  Seu enxoval está {progress}% completo. Faltam apenas alguns itens essenciais.
                </p>
              </div>
              <div className="w-full md:w-2/3 z-10">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-label-md font-label text-primary">Progresso Geral</span>
                  <span className="text-headline-md text-primary" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                    {progress}%
                  </span>
                </div>
                <div className="h-4 w-full bg-secondary-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%`, boxShadow: '0 0 15px rgba(123,84,85,0.2)' }}
                  />
                </div>
                <div className="flex gap-stack-md mt-6 overflow-x-auto hide-scrollbar pb-2">
                  {CATEGORY_STATS.map(s => (
                    <div key={s.label} className="flex flex-col gap-1 items-center bg-surface-container-low px-4 py-2 rounded-2xl min-w-[100px]">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant opacity-60">{s.label}</span>
                      <span className="text-label-md font-label text-primary">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Filter tabs */}
          <div className="flex items-center justify-between mb-stack-md">
            <div className="flex gap-2">
              {FILTER_TABS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-1 rounded-full text-label-md font-label transition-all hover:opacity-80 ${
                    activeFilter === f.id
                      ? 'bg-primary-container/30 text-primary'
                      : 'bg-white text-on-surface-variant shadow-sm hover:bg-surface-container-high'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-1 text-on-surface-variant text-label-md font-label hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
              <span>Filtrar</span>
            </button>
          </div>

          {/* ── Item list (mobile) / Grid (desktop) ── */}
          <div className="md:hidden space-y-stack-md">
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category} className="space-y-stack-md">
                <div className="flex items-center justify-between pt-stack-md first:pt-0">
                  <h3 className="text-label-md font-label text-primary uppercase tracking-wider">
                    {CATEGORY_LABELS[category] || category}
                  </h3>
                  <span className="text-label-sm font-label text-on-surface-variant">{categoryItems.length} itens</span>
                </div>
                {categoryItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ))}
            {filtered.length === 0 && <EmptyState query={searchQuery} />}
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-stack-md">
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full">
                <EmptyState query={searchQuery} />
              </div>
            )}
          </div>

          {/* Load more */}
          <div className="mt-stack-lg flex justify-center py-8">
            <button className="border border-outline text-on-surface-variant text-label-md font-label px-8 py-3 rounded-full hover:bg-surface-variant/20 transition-colors active:scale-95">
              Ver mais itens
            </button>
          </div>
        </main>
      </div>

      {/* FAB – mobile only */}
      <button
        onClick={() => navigate('/add')}
        className="md:hidden fixed right-6 bottom-24 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>

      <BottomNav />
    </div>
  )
}

function EmptyState({ query }) {
  return (
    <div className="text-center py-16 text-on-surface-variant">
      <span className="material-symbols-outlined text-5xl mb-3 block">
        {query ? 'search_off' : 'inbox'}
      </span>
      <p className="text-body-md">
        {query ? `Nenhum resultado para "${query}"` : 'Nenhum item nessa categoria'}
      </p>
    </div>
  )
}
