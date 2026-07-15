import { useState, useEffect } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const CATEGORIES = [
  { value: 'clothing', label: 'Roupas' },
  { value: 'nursery', label: 'Quarto' },
  { value: 'feeding', label: 'Alimentação' },
  { value: 'hygiene', label: 'Higiene' },
  { value: 'travel', label: 'Passeio' },
]

const PRIORITIES = [
  { id: 'optional', label: 'Opcional', icon: 'star_outline' },
  { id: 'essential', label: 'Essencial', icon: 'star', filled: true },
  { id: 'gift', label: 'Presente', icon: 'priority_high', filled: true },
]

const DESKTOP_NAV = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/add', label: 'Add', icon: 'add_circle' },
  { to: '/dashboard', label: 'Settings', icon: 'settings' },
]

export default function AddItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addItem, updateItem, getItem, uploadImage, progress, itemsLoading } = useApp()

  const isEdit = Boolean(id)
  const existing = isEdit ? getItem(id) : null

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [qty, setQty] = useState(existing?.qty ?? 1)
  const [priority, setPriority] = useState(
    existing ? (existing.essential ? 'essential' : 'optional') : 'essential'
  )
  const [form, setForm] = useState({
    name: existing?.name ?? '',
    category: existing?.category ?? '',
    notes: existing?.detail ?? '',
  })
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(existing?.img ?? null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  // If navigated directly with an id that doesn't exist, go back
  useEffect(() => {
    if (isEdit && !itemsLoading && existing === null) navigate('/dashboard', { replace: true })
  }, [isEdit, itemsLoading, existing, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    let imgUrl = existing?.img ?? null
    if (imgFile) {
      const { url } = await uploadImage(imgFile)
      if (url) imgUrl = url
    }

    const data = {
      name: form.name || 'Novo Item',
      category: form.category || 'clothing',
      qty,
      detail: form.notes,
      essential: priority === 'essential',
      img: imgUrl,
    }
    if (isEdit) {
      await updateItem(id, data)
    } else {
      await addItem(data)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate('/dashboard'), 800)
  }

  const pageTitle = isEdit ? 'Editar Produto' : 'Adicionar Produto'
  const desktopTitle = isEdit ? 'Editar Item' : 'Adicionar ao Enxoval'
  const submitLabel = isEdit ? 'Salvar Alterações' : 'Salvar Produto'
  const desktopSubmitLabel = isEdit ? 'Salvar Alterações' : 'Salvar Item'

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">

      {/* ── Header ── */}
      <header className="bg-surface/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 flex justify-between items-center px-container-padding h-touch-target w-full">
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-8 h-8 rounded-full overflow-hidden border border-primary/20">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY1QMUUnm6PUzwb1OTMi4HDb8DLrtsxzFFYb62FLJ4pNK8wYu3Avy-GbyDV-EXYzYDzjoD0AZnk6py5mKVzHonuTaR5XhH53kUoDWRnOf6nPTFaqZVU6jC_sdjHrEtenGAmUbNi02g4EwKK_0qWU-m_b20X5PxXHmauJvUnZoPBj6iuZInm-sIc9fpwOF15KdKhDdx88aG2WamFLOyK3RbhI87NQTXWzq1eh5RB718dnZ7hWvVpXx5"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="md:hidden p-2 -ml-2 text-primary active:scale-95 transition-transform"
            onClick={() => navigate(-1)}
          >
            <span className="material-symbols-outlined">
              {isEdit ? 'arrow_back' : 'close'}
            </span>
          </button>
          <h1
            className="text-headline-md text-primary"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}
          >
            Enxoval Letícia
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8">
            {DESKTOP_NAV.map(({ to, label, icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-label-md font-label transition-opacity ${
                    isActive && label === 'Add'
                      ? 'text-primary bg-primary-container/30 rounded-full px-4 py-1'
                      : 'text-on-surface-variant hover:opacity-80'
                  }`
                }
              >
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>
          <button className="hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow flex items-start md:items-center justify-center p-container-padding md:min-h-[calc(100vh-88px)]">
        <div className="w-full max-w-4xl bg-surface-container-lowest rounded-[32px] shadow-soft overflow-hidden flex flex-col md:flex-row">

          {/* Left: image / thumbnail */}
          <div className="w-full md:w-5/12 bg-surface-container p-stack-lg flex flex-col items-center justify-center relative min-h-[180px] md:min-h-[420px]">
            {/* Show preview when image selected or already exists */}
            {imgPreview ? (
              <div className="relative w-full h-full min-h-[180px] md:min-h-[320px]">
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 flex items-end justify-center pb-4 rounded-2xl bg-gradient-to-t from-black/30 to-transparent">
                  <label className="cursor-pointer flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-label-sm font-label text-on-surface hover:bg-white transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>photo_camera</span>
                    Trocar foto
                    <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center text-center p-8 hover:bg-surface-variant/30 transition-colors cursor-pointer group min-h-[180px]">
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-primary mb-4">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
                  >
                    cloud_upload
                  </span>
                </div>
                <h3
                  className="hidden md:block text-headline-md text-primary mb-2"
                  style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}
                >
                  Foto do Produto
                </h3>
                <span className="md:hidden text-label-md font-label text-on-surface-variant">Adicionar Foto</span>
                <p className="text-body-md text-on-surface-variant max-w-[200px] mt-1 hidden md:block">
                  Arraste uma imagem ou clique para buscar.
                </p>
                <span className="md:hidden text-[10px] uppercase tracking-wider text-outline mt-1 font-bold">
                  JPEG, PNG ou HEIC
                </span>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
              </div>
            )}

            {/* Desktop info tip */}
            {!isEdit && (
              <div className="mt-stack-lg w-full hidden md:block">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <p className="text-label-sm font-label text-secondary">
                    Uma boa foto ajuda a organizar o enxoval visualmente.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: form */}
          <div className="w-full md:w-7/12 p-stack-lg flex flex-col">
            {/* Title block */}
            <div className="mb-stack-lg">
              <div className="flex items-center gap-2 mb-1">
                {isEdit && (
                  <span className="inline-flex items-center gap-1 bg-primary-container/40 text-primary text-label-sm font-label px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                    Editando
                  </span>
                )}
              </div>
              <h1
                className="hidden md:block text-headline-lg text-primary"
                style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}
              >
                {desktopTitle}
              </h1>
              <h2
                className="md:hidden text-headline-lg-mobile text-on-surface"
                style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}
              >
                {pageTitle}
              </h2>
              <p className="text-body-md text-on-surface-variant mt-1">
                {isEdit ? 'Atualize os detalhes do item.' : 'Complete os detalhes para o seu enxoval.'}
              </p>
            </div>

            <form id="add-product-form" className="space-y-stack-md flex-grow" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="space-y-1">
                <label className="text-label-md font-label text-on-surface-variant ml-1 block">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Macacão de Algodão Orgânico"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full h-12 px-4 bg-tertiary-fixed/30 rounded-xl border-none text-body-md text-on-surface transition-all focus:outline-none focus:ring-1 focus:ring-secondary-fixed-dim"
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Category + Quantity */}
              <div className="grid grid-cols-2 gap-stack-md">
                <div className="space-y-1">
                  <label className="text-label-md font-label text-on-surface-variant ml-1 block">Categoria</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full h-12 px-4 bg-tertiary-fixed/30 rounded-xl border-none text-body-md text-on-surface appearance-none focus:outline-none focus:ring-1 focus:ring-secondary-fixed-dim pr-10"
                      style={{ fontSize: '16px' }}
                    >
                      <option value="" disabled>Selecione</option>
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-label-md font-label text-on-surface-variant ml-1 block">Quantidade</label>
                  <div className="flex items-center h-12 bg-tertiary-fixed/30 rounded-xl overflow-hidden px-2">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary-container/30 rounded-lg transition-colors"
                      onClick={() => setQty(v => Math.max(1, v - 1))}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="flex-grow text-center text-body-md font-semibold">{qty}</span>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary-container/30 rounded-lg transition-colors"
                      onClick={() => setQty(v => v + 1)}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-label-md font-label text-on-surface-variant ml-1 block">Prioridade</label>
                <div className="flex gap-3">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className={`flex-1 py-2 px-2 rounded-full text-label-sm font-label flex items-center justify-center gap-1 active:scale-95 transition-all ${
                        priority === p.id
                          ? 'bg-primary-container/50 border border-primary/20 font-semibold text-primary'
                          : 'border border-outline-variant text-on-surface-variant hover:bg-secondary-container/20'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '16px',
                          ...(p.filled && priority === p.id ? { fontVariationSettings: "'FILL' 1" } : {}),
                        }}
                      >
                        {p.icon}
                      </span>
                      <span className="hidden sm:inline">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-label-md font-label text-on-surface-variant ml-1 block">Observações</label>
                <textarea
                  rows={3}
                  placeholder="Cores, tamanhos, links..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full p-4 bg-tertiary-fixed/30 rounded-xl border-none text-body-md text-on-surface resize-none focus:outline-none focus:ring-1 focus:ring-secondary-fixed-dim"
                  style={{ fontSize: '16px', minHeight: '80px' }}
                />
              </div>

              {/* Desktop action buttons */}
              <div className="hidden md:flex items-center gap-stack-md pt-stack-md">
                <button
                  type="button"
                  className="flex-1 h-touch-target text-label-md font-label border-2 border-primary/10 text-primary rounded-full hover:bg-primary-container/20 transition-colors active:scale-95"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || saved}
                  className="flex-1 h-touch-target text-label-md font-label bg-primary text-on-primary rounded-full hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-80"
                >
                  {saving ? (
                    <><span className="material-symbols-outlined animate-spin">progress_activity</span> Salvando...</>
                  ) : saved ? (
                    <><span className="material-symbols-outlined">check_circle</span> Salvo!</>
                  ) : (
                    <><span className="material-symbols-outlined">check_circle</span> {desktopSubmitLabel}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ── Mobile: bottom action bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-container-padding bg-surface/80 backdrop-blur-xl border-t border-surface-variant/20 z-40">
        <div className="flex flex-col gap-3">
          <button
            form="add-product-form"
            type="submit"
            disabled={saving || saved}
            className="w-full h-touch-target rounded-full text-label-md font-label shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-80"
            style={{ backgroundColor: saved ? '#5f5f59' : '#7b5455', color: '#fff' }}
          >
            {saving ? (
              <><span className="material-symbols-outlined animate-spin">progress_activity</span> Salvando...</>
            ) : saved ? (
              <><span className="material-symbols-outlined">check_circle</span> Salvo!</>
            ) : submitLabel}
          </button>
          <button
            type="button"
            className="w-full h-touch-target bg-transparent text-on-surface-variant rounded-full text-label-md font-label flex items-center justify-center active:scale-[0.97]"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* ── Desktop: sticky footer progress bar ── */}
      <footer className="hidden md:block fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl p-4 z-40 border-t border-outline-variant/10">
        <div className="max-w-4xl mx-auto w-full px-container-padding">
          <div className="flex justify-between items-center mb-1">
            <span className="text-label-sm font-label text-on-surface-variant">Status do enxoval</span>
            <span className="text-label-sm font-label text-primary font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-secondary-fixed rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(123,84,85,0.4)' }}
            />
          </div>
          <p className="text-center text-label-sm font-label text-tertiary mt-2">
            {isEdit
              ? 'Atualize os detalhes e salve as alterações.'
              : 'Quase lá! Adicione mais itens essenciais para completar o enxoval.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
