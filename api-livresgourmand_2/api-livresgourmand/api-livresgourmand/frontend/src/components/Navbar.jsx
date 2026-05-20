import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/connexion')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Livres Gourmand</Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Catalogue</Link>
        <Link to="/recherche" className="navbar-link">Recherche</Link>
        <Link to="/liste-cadeaux" className="navbar-link">Listes cadeaux</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/panier" style={{ position: 'relative', textDecoration: 'none', fontSize: '20px' }}>
          🛒
          {itemCount > 0 && (
            <span className="navbar-badge">{itemCount}</span>
          )}
        </Link>

        {token ? (
          <>
            <Link to="/admin" className="navbar-link">Mon compte</Link>
            <button className="btn-outline" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/inscription" className="btn-outline" style={{ textDecoration: 'none' }}>Inscription</Link>
            <Link to="/connexion" className="btn-gold" style={{ textDecoration: 'none' }}>Connexion</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar