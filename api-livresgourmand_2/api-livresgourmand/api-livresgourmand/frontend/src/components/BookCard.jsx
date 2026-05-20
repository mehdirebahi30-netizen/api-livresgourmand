import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function BookCard({ book }) {
  const { addToCart } = useCart()

  return (
    <div className="book-card">
      <Link to={`/ouvrages/${book.id}`} style={{ textDecoration: 'none' }}>
        <div className="book-cover">
          {book.image_url ? (
            <img
              src={`http://localhost:5000${book.image_url}`}
              alt={book.titre}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
          ) : (
            '📖'
          )}
        </div>
        <div className="book-info">
          <div className="book-stars">★★★★★</div>
          <p className="book-title">{book.titre}</p>
          <p className="book-author">{book.auteur}</p>
          <p className="book-price">{parseFloat(book.prix).toFixed(2)} €</p>
        </div>
      </Link>
      <button className="book-add-btn" onClick={() => addToCart(book)}>
        + AJOUTER AU PANIER
      </button>
    </div>
  )
}

export default BookCard