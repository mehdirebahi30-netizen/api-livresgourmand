import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BookCard from '../components/BookCard'
import api from '../services/api'

function HomePage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    api.get('/ouvrages')
      .then(res => { setBooks(res.data); setLoading(false) })
      .catch(() => { setError('Erreur lors du chargement des ouvrages'); setLoading(false) })
  }, [])

  return (
    <div>
      {/* HERO */}
      <div className="page-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="page-label">Sélection du mois — Hiver 2026</p>
          <h1 style={{ fontSize: '46px', lineHeight: '1.2', marginBottom: '14px' }}>
            L'art de lire,<br />réinventé <em style={{ color: 'var(--gold)' }}>pour vous</em>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.8', marginBottom: '1.75rem' }}>
            Des ouvrages soigneusement sélectionnés<br />
            pour les esprits curieux et gourmands.<br />
            Livraison offerte dès 35 €.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem' }}>
            <Link to="/recherche">
              <button className="btn-gold">Découvrir le catalogue</button>
            </Link>
            <button className="btn-outline">Nos sélections</button>
          </div>

          {/* STATS */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[['+ 2 400', 'OUVRAGES'], ['4,8 ★', 'NOTE MOYENNE'], ['48h', 'LIVRAISON']].map(([val, label], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {i > 0 && <div style={{ width: '1px', height: '36px', background: 'var(--border)' }} />}
                <div>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--gold)', fontWeight: '600', margin: 0 }}>{val}</p>
                  <p style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px', margin: 0 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVRES DÉCORATIFS */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexShrink: 0 }}>
          <div className="card" style={{ width: '100px', height: '144px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: '0.6', marginBottom: '16px' }}>
            <span style={{ fontSize: '32px' }}>📖</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '10px', color: 'var(--gold)', textAlign: 'center', padding: '0 8px' }}>L'Étranger</span>
          </div>
          <div className="card" style={{ width: '120px', height: '174px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '5px 5px 0 var(--gold-light)' }}>
            <span style={{ fontSize: '38px' }}>📖</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '10px', color: 'var(--gold)', textAlign: 'center', padding: '0 8px' }}>Le Grand Meaulnes</span>
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="page">

       

        {/* TITRE */}
        <div className="section-title">
          Nouveautés
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Lato', fontWeight: '400' }}>Hiver 2026</span>
        </div>

        {/* ÉTATS */}
        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chargement des ouvrages...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* GRILLE */}
        {!loading && !error && (
          <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
            {books.length > 0
              ? books.map(book => <BookCard key={book.id} book={book} />)
              : <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>Aucun ouvrage disponible.</p>
            }
          </div>
        )}

        {/* BANNIÈRE PROMO */}
        <div style={{
          background: 'linear-gradient(110deg, #2C1A06, #4A2E0A)',
          borderRadius: '8px', padding: '2rem 2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <p className="page-label">Offre spéciale</p>
            <h2 style={{ color: 'var(--cream-dark)', fontSize: '24px', marginBottom: '6px' }}>
              Liste de cadeaux pour vos proches
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--gold)', margin: 0 }}>
              Créez et partagez votre liste en quelques clics
            </p>
          </div>
          <Link to="/liste-cadeaux">
            <button className="btn-gold">Créer ma liste</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage