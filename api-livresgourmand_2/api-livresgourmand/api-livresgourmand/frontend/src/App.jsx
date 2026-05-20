import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import BookDetailPage from './pages/BookDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import GiftListPage from './pages/GiftListPage'
import DashboardPage from './pages/admin/DashboardPage'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/ouvrages/:id" element={<BookDetailPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/confirmation" element={<OrderConfirmationPage />} />
          <Route path="/liste-cadeaux" element={<GiftListPage />} />
          <Route path="/admin" element={<DashboardPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App