import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const error = await signIn(email, password)

    setLoading(false)

    if (error) {
      setErrorMsg(translateError(error.message))
      return
    }

    navigate('/dashboard')
  }

  async function handleGoogle() {
    setErrorMsg('')
    const error = await signInWithGoogle()
    if (error) setErrorMsg(translateError(error.message))
  }

  return (
    <div className="min-h-screen flex font-body text-on-surface bg-background">

      {/* ── LEFT: Hero (desktop only) ── */}
      <section className="hidden lg:block lg:w-7/12 relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-[10000ms] hover:scale-110"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVuYhQuKpvBDLcyOieN5I0NvMsvFqpvNiBB_lG6l7IQ2ec-Ydf6l_N791nzsaicMMNnBmDsy7uKKZtry8MY5_EPCqfytimDKCYq8sLsZcVkq3OnDcu5mgjz21p3ahB2goLQJDTX03YUsLoRcUY-_C2ZbGjR_2V5hAmfJjGtnvSQ3GSxFCtkO5Q3c9pBHEjTla7vv_N5IHvdKsMYzZ8G2THNF1WMWcB0-eXKQcUZ8B42xz9btN2d2x3')`,
            }}
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
        </div>
        <div className="absolute top-12 left-12 z-20">
          <h1 className="text-headline-md text-on-primary" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
            Enxoval Letícia
          </h1>
        </div>
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <p className="text-display-lg text-on-primary leading-tight" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
            Cada detalhe, preparado com amor.
          </p>
          <p className="text-body-lg text-primary-fixed mt-4 opacity-90">
            Organize o enxoval completo da sua filha com calma e confiança.
          </p>
        </div>
      </section>

      {/* ── RIGHT: Form panel ── */}
      <section className="w-full lg:w-5/12 bg-surface flex flex-col relative">

        {/* Mobile: hero image + overlay */}
        <div className="lg:hidden relative w-full h-[280px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/95 z-10" />
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVuYhQuKpvBDLcyOieN5I0NvMsvFqpvNiBB_lG6l7IQ2ec-Ydf6l_N791nzsaicMMNnBmDsy7uKKZtry8MY5_EPCqfytimDKCYq8sLsZcVkq3OnDcu5mgjz21p3ahB2goLQJDTX03YUsLoRcUY-_C2ZbGjR_2V5hAmfJjGtnvSQ3GSxFCtkO5Q3c9pBHEjTla7vv_N5IHvdKsMYzZ8G2THNF1WMWcB0-eXKQcUZ8B42xz9btN2d2x3')`,
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-container-padding pb-stack-md z-20">
            <h1 className="text-headline-lg-mobile text-on-surface" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
              Bem-vindo ao Monta Enxoval
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">Organize cada detalhe com amor.</p>
          </div>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-0 left-0 right-0 z-50 h-touch-target px-container-padding flex items-center glass-header bg-surface/80">
          <div className="text-headline-md text-primary font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>Enxoval Letícia</div>
        </div>

        {/* Form wrapper */}
        <div className="flex-grow flex items-center justify-center p-container-padding lg:px-16">
          <div className="w-full max-w-[440px] space-y-stack-lg">

            {/* Desktop header */}
            <div className="hidden lg:block space-y-stack-sm">
              <h2 className="text-headline-lg text-on-surface" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
                Bem-vinda de volta
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Continue preparando seu enxoval.
              </p>
            </div>

            <form className="space-y-stack-md" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1">
                <label className="text-label-md font-label text-on-surface-variant ml-1 block" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant lg:hidden" style={{ fontSize: '20px' }}>mail</span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full h-[56px] pl-11 lg:pl-6 pr-4 rounded-xl border-none bg-surface-container-low text-body-md text-on-surface placeholder:text-outline/50 transition-all focus:outline-none focus:ring-1 focus:ring-primary"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center px-1">
                  <label className="text-label-md font-label text-on-surface-variant" htmlFor="password">Senha</label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[56px] px-6 pr-12 rounded-xl border-none bg-surface-container-low text-body-md text-on-surface placeholder:text-outline/50 transition-all focus:outline-none focus:ring-1 focus:ring-primary"
                    style={{ fontSize: '16px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant p-2"
                    onClick={() => setShowPassword(v => !v)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error text-label-md">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  {errorMsg}
                </div>
              )}

              <div className="pt-2 space-y-stack-md">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-active w-full h-[56px] bg-primary text-on-primary text-label-md font-label rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : 'Entrar'}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-surface-container-highest" />
                  <span className="flex-shrink mx-4 text-label-sm font-label text-outline uppercase tracking-widest">ou</span>
                  <div className="flex-grow border-t border-surface-container-highest" />
                </div>

                {/* Google button */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="btn-active w-full h-[56px] bg-white border border-surface-container-highest text-on-surface rounded-full text-label-md font-label shadow-sm flex items-center justify-center space-x-3 hover:bg-surface-container-lowest transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continuar com Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>

<div className="hidden lg:flex absolute bottom-8 right-8 items-center space-x-6">
          <a href="#" className="text-label-sm font-label text-outline hover:text-on-surface transition-colors">Privacidade</a>
          <a href="#" className="text-label-sm font-label text-outline hover:text-on-surface transition-colors">Termos</a>
        </div>
      </section>
    </div>
  )
}

function translateError(msg) {
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (msg.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (msg.includes('Password should be')) return 'A senha deve ter no mínimo 6 caracteres.'
  return msg
}