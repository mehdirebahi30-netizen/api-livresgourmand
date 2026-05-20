import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import api from '../services/api'

function SearchPage() {
  const [books, setBooks] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [maxPrice, setMaxPrice] = useState(100)
  const [sortBy, setSortBy] = useState('pertinence')

  const categories = ['Tous', 'Roman', 'Philosophie', 'Histoire', 'Poésie', 'Sciences', 'Jeunesse']

  useEffect(() => {
    api.get('/ouvrages')
      .then(res => { setBooks(res.data); setFiltered(res.data); setLoading(false) })
      .catch(() => { setError('Erreur lors du chargement'); setLoading(false) })
  }, [])

  useEffect(() => {
    let result = [...books]
    if (search.trim()) result = result.filter(b => b.titre.toLowerCase().includes(search.toLowerCase()) || b.auteur.toLowerCase().includes(search.toLowerCase()))
    if (category && category !== 'Tous') result = result.filter(b => b.categorie === category)
    result = result.filter(b => parseFloat(b.prix) <= maxPrice)
    if (sortBy === 'prix_asc') result.sort((a, b) => a.prix - b.prix)
    if (sortBy === 'prix_desc') result.sort((a, b) => b.prix - a.prix)
    setFiltered(result)
  }, [search, category, maxPrice, sortBy, books])

  return (
    <div className="page">
      <p className="page-label">Recherche avancée</p>
      <div className="gold-line" />

      <div className="grid-sidebar">
        {/* FILTRES */}
        <div className="card card-body-sm" style={{ alignSelf: 'start', position: 'sticky', top: '80px' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Filtres</h3>

          <label className="input-label">Titre ou auteur</label>
          <input className="input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: '10px' }} />

          <label className="input-label">Catégorie</label>
          <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ marginBottom: '10px' }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <label className="input-label">Prix maximum : {maxPrice} €</label>
          <input type="range" min="5" max="200" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--gold)', marginBottom: '10px' }} />

          <button className="btn-gold btn-full" style={{ marginBottom: '8px' }}>Appliquer</button>
          <button className="btn-ghost btn-full" onClick={() => { setSearch(''); setCategory('Tous'); setMaxPrice(100); setSortBy('pertinence') }}>
            Réinitialiser
          </button>
        </div>

        {/* RÉSULTATS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>
              <strong style={{ color: 'var(--gold)' }}>{filtered.length}</strong> résultat{filtered.length > 1 ? 's' : ''}
            </p>
            <select className="input" style={{ width: 'auto', margin: 0, padding: '6px 12px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="pertinence">Pertinence</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
            </select>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chargement...</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {!loading && !error && (
            filtered.length === 0
              ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <h3>Aucun résultat trouvé</h3>
                  <p style={{ fontSize: '13px' }}>Essayez de modifier vos filtres</p>
                </div>
              : <div className="grid-4">
                  {filtered.map(book => <BookCard key={book.id} book={book} />)}
                </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage