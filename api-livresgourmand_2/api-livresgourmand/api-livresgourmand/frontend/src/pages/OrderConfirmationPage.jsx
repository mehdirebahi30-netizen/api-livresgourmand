import { Link } from 'react-router-dom'

function OrderConfirmationPage() {
  const orderNumber = `#LG-2026-${Math.floor(Math.random() * 90000) + 10000}`

  return (
    <div className="page-center">
      <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>

        <div style={{ width: '72px', height: '72px', background: 'var(--white)', border: '2px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '32px' }}>
          ✓
        </div>

        <p className="page-label">Commande confirmée</p>
        <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Merci pour votre commande !</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Numéro : <strong style={{ color: 'var(--gold)' }}>{orderNumber}</strong>
        </p>

        <div className="card card-body" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Informations de livraison</h3>
          {[['Mode', 'Colissimo'], ['Livraison estimée', '23 – 26 mai 2026'], ['Frais', 'Gratuits']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-light)', marginBottom: '8px' }}>
              <span>{k}</span>
              <strong style={{ color: k === 'Frais' ? 'var(--success)' : 'var(--text)' }}>{v}</strong>
            </div>
          ))}
        </div>

        <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
          📧 Un e-mail de confirmation a été envoyé à votre adresse.
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/"><button className="btn-gold">Retour à l'accueil</button></Link>
          <Link to="/recherche"><button className="btn-outline">Continuer mes achats</button></Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage