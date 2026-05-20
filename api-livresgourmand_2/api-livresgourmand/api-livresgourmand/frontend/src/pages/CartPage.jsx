import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'

function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart()
  const navigate = useNavigate()

  const handleCommande = async () => {
    if (!localStorage.getItem('token')) { navigate('/connexion'); return }
    try {
      await api.post('/commandes')
      clearCart()
      navigate('/confirmation')
    } catch (err) {
      alert(err.response?.data?.msg || 'Erreur lors de la commande')
    }
  }

  if (cart.length === 0) return (
    <div className="page-center" style={{ flexDirection: 'column' }}>
      <span style={{ fontSize: '64px', marginBottom: '1.5rem' }}>🛒</span>
      <h2 style={{ marginBottom: '8px' }}>Votre panier est vide</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Découvrez nos ouvrages et commencez votre sélection</p>
      <Link to="/"><button className="btn-gold">Découvrir le catalogue</button></Link>
    </div>
  )

  return (
    <div className="page">
      <p className="page-label">Mon panier</p>
      <div className="gold-line" />

      <div className="grid-cart">
        {/* ARTICLES */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
              <strong style={{ color: 'var(--gold)' }}>{itemCount}</strong> article{itemCount > 1 ? 's' : ''}
            </p>
            <button className="btn-ghost" onClick={clearCart}>Vider le panier</button>
          </div>

          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 0', borderBottom: '1px solid var(--border-dark)' }}>
              <div style={{ width: '56px', height: '80px', background: 'var(--cream-dark)', border: '1px solid var(--border)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '24px', overflow: 'hidden' }}>
                {item.image_url ? (
                  <img
                    src={`http://localhost:5000${item.image_url}`}
                    alt={item.titre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  '📖'
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', marginBottom: '3px' }}>{item.titre}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>{item.auteur}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button className="btn-ghost" style={{ width: '26px', height: '26px', padding: 0 }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="btn-ghost" style={{ width: '26px', height: '26px', padding: 0 }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>
                  {(parseFloat(item.prix) * item.quantity).toFixed(2)} €
                </p>
                <button className="btn-ghost" onClick={() => removeFromCart(item.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* RÉCAPITULATIF */}
        <div className="card card-body" style={{ alignSelf: 'start', position: 'sticky', top: '80px' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Récapitulatif</h3>

          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-light)', marginBottom: '6px' }}>
              <span>{item.titre} × {item.quantity}</span>
              <span>{(parseFloat(item.prix) * item.quantity).toFixed(2)} €</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-light)', marginTop: '8px', marginBottom: '4px' }}>
            <span>Livraison</span>
            <span style={{ color: total >= 35 ? 'var(--success)' : 'var(--text)', fontWeight: '700' }}>
              {total >= 35 ? 'Gratuite' : '4,90 €'}
            </span>
          </div>

          {total < 35 && (
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
              Plus que {(35 - total).toFixed(2)} € pour la livraison gratuite !
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: 'var(--gold)', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '8px' }}>
            <span>Total</span>
            <span>{(total + (total >= 35 ? 0 : 4.90)).toFixed(2)} €</span>
          </div>

          <button className="btn-gold btn-full" style={{ marginTop: '1.25rem' }} onClick={handleCommande}>
            Passer la commande
          </button>
          <Link to="/recherche">
            <button className="btn-outline btn-full" style={{ marginTop: '8px' }}>Continuer mes achats</button>
          </Link>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
            🔒 Paiement 100% sécurisé
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartPage