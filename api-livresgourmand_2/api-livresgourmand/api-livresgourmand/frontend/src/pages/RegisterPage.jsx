import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return }
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return }
    setLoading(true)
    try {
      await api.post('/auth/register', { nom: form.nom, email: form.email, password: form.password })
      navigate('/connexion')
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card card-body" style={{ maxWidth: '460px', width: '100%' }}>
        <p className="page-label">Nouveau client</p>
        <h2 style={{ fontSize: '28px', marginBottom: '0.5rem' }}>Créer un compte</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Déjà un compte ? <Link to="/connexion" style={{ color: 'var(--gold)', fontWeight: '700' }}>Se connecter</Link>
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            ['nom', 'text', 'Nom complet', 'Jean Dupont'],
            ['email', 'email', 'Adresse e-mail', 'vous@exemple.com'],
            ['password', 'password', 'Mot de passe', '••••••••'],
            ['confirm', 'password', 'Confirmer le mot de passe', '••••••••']
          ].map(([name, type, label, placeholder]) => (
            <div key={name}>
              <label className="input-label">{label}</label>
              <input
                className="input" type={type} placeholder={placeholder}
                value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
                required style={{ marginBottom: '12px' }}
              />
            </div>
          ))}

          {/* FORCE MOT DE PASSE */}
          {form.password && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '2px', transition: 'all 0.3s',
                  width: form.password.length < 6 ? '33%' : form.password.length < 10 ? '66%' : '100%',
                  background: form.password.length < 6 ? 'var(--danger)' : form.password.length < 10 ? 'var(--warning)' : 'var(--success)'
                }} />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {form.password.length < 6 ? 'Trop court' : form.password.length < 10 ? 'Moyen' : 'Fort ✓'}
              </p>
            </div>
          )}

          <button type="submit" className="btn-gold btn-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage