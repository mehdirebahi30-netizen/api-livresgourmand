import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="grid-2" style={{ maxWidth: '760px', width: '100%' }}>

        {/* CONNEXION */}
        <div className="card card-body">
          <p className="page-label">Déjà client</p>
          <h2 style={{ fontSize: '26px', marginBottom: '1.5rem' }}>Bon retour parmi nous</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="input-label">Adresse e-mail</label>
            <input className="input" type="email" name="email" placeholder="vous@exemple.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              required style={{ marginBottom: '12px' }}
            />
            <label className="input-label">Mot de passe</label>
            <input className="input" type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              required style={{ marginBottom: '12px' }}
            />
            <button type="submit" className="btn-gold btn-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gold)', marginTop: '1rem', cursor: 'pointer' }}>
            Mot de passe oublié ?
          </p>
        </div>

        {/* INSCRIPTION */}
        <div className="card card-body" style={{ background: 'linear-gradient(135deg, var(--cream-hero), var(--cream-dark))', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '48px', marginBottom: '1rem' }}>📖</span>
          <p className="page-label">Nouveau client</p>
          <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>Rejoignez-nous !</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Créez votre compte pour accéder à votre panier, suivre vos commandes et créer des listes de cadeaux.
          </p>
          <Link to="/inscription" style={{ width: '100%' }}>
            <button className="btn-outline btn-full">Créer mon compte</button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default LoginPage