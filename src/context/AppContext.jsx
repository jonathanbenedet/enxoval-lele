import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

function compressImage(file, maxPx, quality) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
    }
    img.src = url
  })
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(undefined)   // undefined = loading
  const [household, setHousehold] = useState(undefined) // undefined = loading
  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Fetch household when session changes
  useEffect(() => {
    if (session === undefined) return
    if (!session) { setHousehold(null); return }

    supabase
      .from('household_members')
      .select('role, households(id, name, invite_code)')
      .then(({ data }) => {
        if (data && data.length > 0) setHousehold({ ...data[0].households, role: data[0].role })
        else setHousehold(null)
      })
  }, [session])

  // Fetch items when household changes
  const fetchItems = useCallback(async () => {
    if (!household) { setItems([]); setItemsLoading(false); return }
    setItemsLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error) setItems(data)
    setItemsLoading(false)
  }, [household])

  useEffect(() => { fetchItems() }, [fetchItems])

  // Auth actions
  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    return error
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    return error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // Household actions
  async function createHousehold(name = 'Nosso Enxoval') {
    const { data, error } = await supabase.rpc('create_household', { p_name: name })
    if (error) return error
    setHousehold({ id: data.household_id, name: data.name, invite_code: data.invite_code, role: 'owner' })
    return null
  }

  function selectHousehold(h) {
    setHousehold(h)
  }

  async function joinHousehold(code) {
    const { error } = await supabase.rpc('join_household', { p_invite_code: code })
    if (error) return error
    const { data } = await supabase
      .from('household_members')
      .select('role, households(id, name, invite_code)')
      .eq('user_id', session.user.id)
      .single()
    if (data) setHousehold({ ...data.households, role: data.role })
    return null
  }

  // CRUD
  async function toggleItem(id) {
    const item = items.find(i => i.id === id)
    if (!item) return
    const next = !item.checked
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: next } : i))
    await supabase.from('items').update({ checked: next }).eq('id', id)
  }

  async function addItem(newItem) {
    const { data, error } = await supabase
      .from('items')
      .insert({ ...newItem, household_id: household.id })
      .select()
      .single()
    if (!error) setItems(prev => [...prev, data])
  }

  async function updateItem(id, patch) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
    await supabase.from('items').update(patch).eq('id', id)
  }

  async function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
    await supabase.from('items').delete().eq('id', id)
  }

  function getItem(id) {
    return items.find(i => i.id === id) ?? null
  }

  async function uploadImage(file) {
    const compressed = await compressImage(file, 600, 0.65)
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const path = `${household.id}/${id}.jpg`
    const { error } = await supabase.storage
      .from('item-images')
      .upload(path, compressed, { upsert: false, contentType: 'image/jpeg' })
    if (error) return { url: null, error }
    const { data } = supabase.storage.from('item-images').getPublicUrl(path)
    return { url: data.publicUrl, error: null }
  }

  const checkedCount = items.filter(i => i.checked).length
  const totalItems = items.length || 1
  const progress = Math.round((checkedCount / totalItems) * 100)

  return (
    <AppContext.Provider value={{
      session, household,
      items, itemsLoading,
      activeCategory, setActiveCategory,
      activeFilter, setActiveFilter,
      signIn, signUp, signInWithGoogle, signOut,
      createHousehold, joinHousehold, selectHousehold,
      toggleItem, addItem, updateItem, deleteItem, getItem, uploadImage,
      progress, checkedCount, totalItems: items.length,
      fetchItems,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
