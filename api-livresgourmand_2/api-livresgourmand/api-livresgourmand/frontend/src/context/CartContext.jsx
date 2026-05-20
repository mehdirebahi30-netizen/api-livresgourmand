import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (book, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id)
      if (existing) {
        return prev.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...book, quantity }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id)
    setCart(prev =>
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    )
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)