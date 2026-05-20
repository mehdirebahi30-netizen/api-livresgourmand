import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function GiftListPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [code, setCode] = useState('')
  const [listName, setListName] = useState('')
  const [myLists, setMyLists] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) api.get('/listes').then(res => setMyLists(res.data || [])).catch(() => {})
  }, [])

  const handleCreateList = async e => {
    e.preventDefault()
    if (!token) { navigate('/connexion'); return }
    setLoading(true); setError(null)
    try {
      const res = await api.post('/listes', { nom: listName })
      setSuccess(`Liste créée ! Code : ${res.data.code_partage}`)
      setListName('')
      setMyLists(prev => [...prev, res.data])
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la création')
    } finally { setLoading(false) }
  }

  const handleAccessList = e => {
    e.preventDefault()
    if (!code.trim()) { setError('Veuillez entrer un code'); return }
    alert(`Accès à la liste avec le code : ${code}`)
  }

  return (
    <div className="page">
      <p className="page-label">Listes de cadeaux</p>
      <div className="gold-line" />

      <div className="grid-2" style={{ maxWidth: '860px' }}>

        {/* ACCÉDER */}
        <div className="card card-body">
          <p className="page-label">Accéder</p>
          <h2 style={{ fontSize: '24px', marginBottom: '0.5rem' }}>Consulter une liste</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            Entrez le code reçu par e-mail pour accéder à la liste.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleAccessList}>
            <label className="input-label">Code de partage</label>
            <input
              className="input"
              placeholder="EX: 4F2A9B12"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              maxLength={8}
              style={{ marginBottom: '12px', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '16px', fontWeight: '700', textAlign: 'center' }}
            />
            <button type="submit" className="btn-gold btn-full">Accéder à la liste</button>
          </form>
        </div>

        {/* CRÉER */}
        <div className="card card-body">
          <p className="page-label">Créer</p>
          <h2 style={{ fontSize: '24px', marginBottom: '0.5rem' }}>Créer ma liste</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            {token ? 'Créez une liste et partagez-la avec vos proches.' : 'Connectez-vous pour créer une liste.'}
          </p>

          {success && <div className="alert alert-success">{success}</div>}

          {token ? (
            <form onSubmit={handleCreateList}>
              <label className="input-label">Nom de la liste</label>
              <input
                className="input"
                placeholder="Ex: Noël 2026..."
                value={listName}
                onChange={e => setListName(e.target.value)}
                required
                style={{ marginBottom: '12px' }}
              />
              <button type="submit" className="btn-gold btn-full" disabled={loading}>
                {loading ? 'Création...' : 'Créer ma liste'}
              </button>
            </form>
          ) : (
            <button className="btn-gold btn-full" onClick={() => navigate('/connexion')}>
              Se connecter pour créer une liste
            </button>
          )}
        </div>
      </div>

      {/* MES LISTES */}
      {token && myLists.length > 0 && (
        <div style={{ marginTop: '2rem', maxWidth: '860px' }}>
          <div className="section-title">Mes listes</div>
          <div className="grid-4">
            {myLists.map((list, i) => (
              <div key={i} className="card card-body-sm">
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', marginBottom: '6px' }}>{list.nom}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Code : <strong style={{ color: 'var(--gold)', letterSpacing: '2px' }}>{list.code_partage}</strong>
                </p>
                <button className="btn-outline btn-full" style={{ fontSize: '12px' }}>Voir la liste</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftListPage