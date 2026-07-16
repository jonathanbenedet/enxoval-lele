import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'

export default function HouseholdSetup() {
  const { createHousehold, joinHousehold, selectHousehold, signOut, household } = useApp()
  const navigate = useNavigate()

  const [existing, setExisting] = useState([])
  const [loadingExisting, setLoadingExisting] = useState(true)

  const [tab, setTab] = useState('create')
  const [householdName, setHouseholdName] = useState('Nosso Enxoval')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [codeCopied, setCodeCopied] = useState(false)

  function copyInviteCode() {
    navigator.clipboard.writeText(household?.invite_code ?? '')
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  useEffect(() => {
    supabase
      .from('household_members')
      .select('role, households(id, name, invite_code)')
      .then(({ data }) => {
        if (data && data.length > 0)
          setExisting(data.map(d => ({ ...d.households, role: d.role })))
        setLoadingExisting(false)
      })
  }, [])

  function handleSelect(h) {
    selectHousehold(h)
    navigate('/dashboard')
  }

  async function handleCreate(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const error = await createHousehold(householdName.trim() || 'Nosso Enxoval')
    setLoading(false)
    if (error) { setErrorMsg(error.message); return }
    navigate('/dashboard')
  }

  async function handleJoin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const error = await joinHousehold(inviteCode.trim())
    setLoading(false)
    if (error) {
      setErrorMsg(error.message.includes('inválido') ? 'Código de convite inválido.' : error.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background font-body text-on-surface px-4 py-8">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
              child_care
            </span>
          </div>
          <h1 className="text-headline-lg text-on-surface" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
            Bem-vinda ao enxoval
          </h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Selecione um enxoval existente ou crie um novo.
          </p>
        </div>

        {existing.length > 0 && (
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-1 text-label-sm font-label text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </button>
        )}

        <button
          onClick={signOut}
          className="absolute top-4 right-4 flex items-center gap-1 text-label-sm font-label text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          <span className="hidden sm:inline">Sair</span>
        </button>

        {/* Existing households */}
        {!loadingExisting && existing.length > 0 && (
          <div className="space-y-2">
            <p className="text-label-sm font-label text-on-surface-variant uppercase tracking-widest px-1">
              Enxovais que você já faz parte
            </p>
            {existing.map(h => (
              <button
                key={h.id}
                onClick={() => handleSelect(h)}
                className="w-full flex items-center justify-between bg-surface-container-lowest rounded-2xl px-4 py-4 shadow-soft hover:bg-primary-container/20 transition-colors group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
                      home
                    </span>
                  </div>
                  <div>
                    <p className="text-label-md font-label text-on-surface font-semibold">{h.name}</p>
                    <p className="text-label-sm font-label text-on-surface-variant capitalize">{h.role === 'owner' ? 'Criado por você' : 'Membro'}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </button>
            ))}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/30" />
              <span className="flex-shrink mx-4 text-label-sm font-label text-outline uppercase tracking-widest">ou</span>
              <div className="flex-grow border-t border-outline-variant/30" />
            </div>
          </div>
        )}

        {/* Invite code for current household */}
        {household?.invite_code && (
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-soft">
            <p className="text-label-sm font-label text-on-surface-variant uppercase tracking-widest mb-3">
              Código de convite
            </p>
            <p className="text-label-sm font-label text-on-surface-variant mb-3">
              Compartilhe com seu parceiro para acessar o enxoval juntos.
            </p>
            <button
              onClick={copyInviteCode}
              className="w-full flex items-center justify-between bg-primary-container/20 hover:bg-primary-container/40 active:scale-95 transition-all rounded-xl px-4 py-3"
            >
              <span className="text-headline-md text-primary tracking-widest font-bold" style={{ fontFamily: 'monospace' }}>
                {household.invite_code}
              </span>
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                {codeCopied ? 'check' : 'content_copy'}
              </span>
            </button>
            {codeCopied && (
              <p className="text-label-sm font-label text-primary mt-2 text-center">Copiado!</p>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-surface-container-low rounded-full p-1">
          <button
            onClick={() => { setTab('create'); setErrorMsg('') }}
            className={`flex-1 py-2 rounded-full text-label-md font-label transition-all ${
              tab === 'create' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Criar enxoval
          </button>
          <button
            onClick={() => { setTab('join'); setErrorMsg('') }}
            className={`flex-1 py-2 rounded-full text-label-md font-label transition-all ${
              tab === 'join' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Entrar com convite
          </button>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft">
          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-label-md font-label text-on-surface-variant ml-1 block">
                  Nome do enxoval
                </label>
                <input
                  type="text"
                  value={householdName}
                  onChange={e => setHouseholdName(e.target.value)}
                  placeholder="Ex: Enxoval da Sofia"
                  className="w-full h-[52px] px-4 rounded-xl border-none bg-surface-container-low text-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <p className="text-label-sm font-label text-on-surface-variant">
                Um código de convite será gerado automaticamente para compartilhar com seu parceiro.
              </p>
              {errorMsg && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error text-label-md">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  {errorMsg}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-primary text-on-primary text-label-md font-label rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
              >
                {loading
                  ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  : <><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_home</span>Criar enxoval</>
                }
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-label-md font-label text-on-surface-variant ml-1 block">
                  Código de convite
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Ex: A1B2C3"
                  maxLength={6}
                  className="w-full h-[52px] px-4 rounded-xl border-none bg-surface-container-low text-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all tracking-widest text-center font-bold"
                  style={{ fontSize: '20px' }}
                />
              </div>
              <p className="text-label-sm font-label text-on-surface-variant">
                Peça o código de 6 letras para quem criou o enxoval.
              </p>
              {errorMsg && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error text-label-md">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  {errorMsg}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || inviteCode.length < 6}
                className="w-full h-[52px] bg-primary text-on-primary text-label-md font-label rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
              >
                {loading
                  ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  : <><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>group_add</span>Entrar no enxoval</>
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
