import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <span className="footer-logo">Livres Gourmand</span>

      <div className="footer-links">
        <Link to="/" className="footer-link">À propos</Link>
        <Link to="/" className="footer-link">Contact</Link>
        <Link to="/" className="footer-link">CGV</Link>
        <Link to="/" className="footer-link">Livraison</Link>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
        © 2026 Tous droits réservés
      </p>
    </footer>
  )
}

export default Footer