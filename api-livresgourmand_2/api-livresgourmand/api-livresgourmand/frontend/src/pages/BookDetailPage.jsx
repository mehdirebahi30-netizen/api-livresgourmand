import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'

function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    api.get(`/ouvrages/${id}`)
      .then(res => {
        setBook(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Ouvrage introuvable')
        setLoading(false)
      })
  }, [id])

  const handleAddToCart = () => {
    addToCart(book, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#9C8B72' }}>
      Chargement...
    </div>
  )

  if (error) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>
      <button onClick={() => navigate(-1)} style={{
        background: '#C6973F', color: '#fff', border: 'none',
        padding: '8px 20px', borderRadius: '3px', cursor: 'pointer'
      }}>
        Retour
      </button>
    </div>
  )

  return (
    <div style={{ background: '#FDFAF4', minHeight: '100vh', padding: '2rem 2.5rem' }}>

      {/* BREADCRUMB */}
      <p style={{ fontSize: '12px', color: '#9C8B72', marginBottom: '1.5rem', cursor: 'pointer' }}
        onClick={() => navigate(-1)}>
        ← Retour aux résultats
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2.5rem' }}>

        {/* COUVERTURE */}
        <div>
          <div style={{
            width: '200px', height: '286px',
            background: '#FDF6E8',
            border: '1px solid #C6973F',
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '6px 6px 0 #C6973F22',
            fontSize: '64px',
            marginBottom: '1rem',
            overflow: 'hidden'
          }}>
            {book.image_url ? (
              <img
                src={`http://localhost:5000${book.image_url}`}
                alt={book.titre}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '📖'
            )}
          </div>

          {/* BOUTON PANIER */}
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            style={{
              width: '200px',
              background: added ? '#4CAF50' : book.stock === 0 ? '#ccc' : '#C6973F',
              color: '#fff',
              border: 'none',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: book.stock === 0 ? 'not-allowed' : 'pointer',
              borderRadius: '3px',
              letterSpacing: '1px',
              fontFamily: 'Lato, sans-serif',
              marginBottom: '8px',
              transition: 'background 0.3s'
            }}
          >
            {added ? '✓ Ajouté !' : book.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>

          {/* LISTE CADEAUX */}
          <button style={{
            width: '200px',
            background: '#fff',
            color: '#C6973F',
            border: '1.5px solid #C6973F',
            padding: '9px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            borderRadius: '3px',
            fontFamily: 'Lato, sans-serif'
          }}>
            ♡ Liste de cadeaux
          </button>
        </div>

        {/* DÉTAILS */}
        <div>
          <p className="page-label">{book.categorie || 'Ouvrage'}</p>
          <h1 style={{ fontSize: '36px', color: '#2C2416', marginBottom: '6px' }}>
            {book.titre}
          </h1>
          <p style={{ fontSize: '14px', color: '#9C8B72', marginBottom: '8px' }}>
            {book.auteur}
          </p>

          {/* ÉTOILES */}
          <div style={{ color: '#C6973F', fontSize: '16px', marginBottom: '8px' }}>
            ★★★★★
            <span style={{ fontSize: '12px', color: '#9C8B72', marginLeft: '8px' }}>
              ({book.avis?.length || 0} avis)
            </span>
          </div>

          {/* PRIX */}
          <p style={{ fontSize: '28px', color: '#C6973F', fontWeight: '700', marginBottom: '1rem' }}>
            {parseFloat(book.prix).toFixed(2)} €
          </p>

          {/* QUANTITÉ + STOCK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{
                  width: '28px', height: '28px',
                  background: '#FDF6E8', border: '1px solid #E8DFC8',
                  borderRadius: '3px', cursor: 'pointer', fontSize: '16px'
                }}
              >−</button>
              <span style={{ fontSize: '15px', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                style={{
                  width: '28px', height: '28px',
                  background: '#FDF6E8', border: '1px solid #E8DFC8',
                  borderRadius: '3px', cursor: 'pointer', fontSize: '16px'
                }}
              >+</button>
            </div>

            <span style={{
              fontSize: '12px',
              color: book.stock > 0 ? '#4CAF50' : '#e74c3c',
              fontWeight: '700'
            }}>
              {book.stock > 0 ? `● En stock (${book.stock} ex.)` : '● Rupture de stock'}
            </span>
          </div>

          {/* LIGNE OR */}
          <div style={{ width: '36px', height: '2px', background: '#C6973F', marginBottom: '1rem' }} />

          {/* DESCRIPTION */}
          {book.description && (
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#6B5A3E', maxWidth: '560px', marginBottom: '2rem' }}>
              {book.description}
            </p>
          )}

          {/* AVIS */}
          <h3 style={{ fontSize: '20px', color: '#C6973F', marginBottom: '1rem' }}>
            Avis des lecteurs
          </h3>

          {book.avis && book.avis.length > 0 ? (
            book.avis.map((avis, i) => (
              <div key={i} style={{
                borderLeft: '2px solid #C6973F',
                padding: '10px 14px',
                marginBottom: '10px',
                background: '#FDF6E8',
                borderRadius: '0 4px 4px 0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#2C2416' }}>
                    {avis.client}
                  </span>
                  <span style={{ fontSize: '12px', color: '#C6973F' }}>
                    {'★'.repeat(avis.note)}{'☆'.repeat(5 - avis.note)}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6B5A3E', margin: 0 }}>
                  {avis.commentaire}
                </p>
                <p style={{ fontSize: '11px', color: '#9C8B72', marginTop: '4px', marginBottom: 0 }}>
                  {new Date(avis.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '13px', color: '#9C8B72', fontStyle: 'italic' }}>
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage