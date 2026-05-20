import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function DashboardPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [activeTab, setActiveTab] = useState('ouvrages')
  const [books, setBooks] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ titre: '', auteur: '', prix: '', stock: '', categorie_id: '' })
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  useEffect(() => {
    if (!token) { navigate('/connexion'); return }
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true); setError(null)
    try {
      if (activeTab === 'ouvrages') {
        const res = await api.get('/ouvrages')
        setBooks(res.data)
      } else if (activeTab === 'commandes') {
        const res = await api.get('/commandes')
        setOrders(res.data.commandes || [])
      } else if (activeTab === 'users') {
        const res = await api.get('/users')
        setUsers(res.data)
      }
    } catch {
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async id => {
    if (!window.confirm('Supprimer cet ouvrage ?')) return
    try {
      await api.delete(`/ouvrages/${id}`)
      setBooks(prev => prev.filter(b => b.id !== id))
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const handleAddBook = async e => {
    e.preventDefault()
    setFormError(null); setFormSuccess(null)
    try {
      await api.post('/ouvrages', form)
      setFormSuccess('Ouvrage ajouté avec succès !')
      setForm({ titre: '', auteur: '', prix: '', stock: '', categorie_id: '' })
      fetchData()
    } catch (err) {
      setFormError(err.response?.data?.msg || "Erreur lors de l'ajout")
    }
  }

  const handleUpdateStatus = async (id, statut) => {
    try {
      await api.put(`/commandes/${id}/status`, { statut })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, statut } : o))
    } catch {
      alert('Erreur lors de la mise à jour')
    }
  }

  const statusClass = statut => {
    if (statut === 'en_cours') return 'status-badge status-en_cours'
    if (statut === 'livré') return 'status-badge status-livré'
    if (statut === 'annulé') return 'status-badge status-annulé'
    return 'status-badge'
  }

  return (
    <div>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(110deg, #2C1A06, #4A2E0A)', padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="page-label">Espace administrateur</p>
          <h1 style={{ color: 'var(--cream-dark)', margin: 0 }}>Tableau de bord</h1>
        </div>
        <button className="btn-outline" onClick={() => { localStorage.removeItem('token'); navigate('/') }}>
          Déconnexion
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border)' }}>
        {[['📚', 'Ouvrages', books.length], ['📦', 'Commandes', orders.length], ['👤', 'Utilisateurs', users.length]].map(([icon, label, count]) => (
          <div key={label} className="card card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '32px' }}>{icon}</span>
            <div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: 'var(--gold)', margin: 0, fontWeight: '600' }}>{count}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, letterSpacing: '1px' }}>{label.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ONGLETS */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '0 2.5rem', background: 'var(--white)' }}>
        {['ouvrages', 'commandes', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              fontSize: '12px',
              letterSpacing: '1px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--gold)' : 'var(--text-muted)',
              fontWeight: activeTab === tab ? '700' : '400',
              background: 'transparent',
              fontFamily: 'Lato, sans-serif',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="page">
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chargement...</div>
        ) : (
          <>
            {/* ===== OUVRAGES ===== */}
            {activeTab === 'ouvrages' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem' }}>

                {/* TABLE */}
                <div>
                  <div className="section-title">Liste des ouvrages</div>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          {['Titre', 'Auteur', 'Prix', 'Stock', 'Actions'].map(h => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {books.map(book => (
                          <tr key={book.id}>
                            <td style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px' }}>{book.titre}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{book.auteur}</td>
                            <td style={{ color: 'var(--gold)', fontWeight: '700' }}>{parseFloat(book.prix).toFixed(2)} €</td>
                            <td>
                              <span style={{ color: book.stock > 5 ? 'var(--success)' : book.stock > 0 ? 'var(--warning)' : 'var(--danger)', fontWeight: '700' }}>
                                {book.stock}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteBook(book.id)}
                                style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', borderRadius: '3px', fontFamily: 'Lato, sans-serif' }}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* FORMULAIRE */}
                <div className="card card-body" style={{ alignSelf: 'start' }}>
                  <h3 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Ajouter un ouvrage</h3>

                  {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
                  {formError && <div className="alert alert-error">{formError}</div>}

                  <form onSubmit={handleAddBook}>
                    {[
                      ['titre', 'text', 'Titre'],
                      ['auteur', 'text', 'Auteur'],
                      ['prix', 'number', 'Prix (€)'],
                      ['stock', 'number', 'Stock'],
                      ['categorie_id', 'number', 'ID Catégorie']
                    ].map(([name, type, label]) => (
                      <div key={name}>
                        <label className="input-label">{label}</label>
                        <input
                          className="input"
                          type={type}
                          value={form[name]}
                          onChange={e => setForm({ ...form, [name]: e.target.value })}
                          required
                          style={{ marginBottom: '10px' }}
                        />
                      </div>
                    ))}
                    <button type="submit" className="btn-gold btn-full" style={{ marginTop: '4px' }}>
                      Ajouter l'ouvrage
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ===== COMMANDES ===== */}
            {activeTab === 'commandes' && (
              <div>
                <div className="section-title">Gestion des commandes</div>
                {orders.length === 0
                  ? <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Aucune commande trouvée.</p>
                  : (
                    <div className="card" style={{ overflow: 'hidden' }}>
                      <table className="table">
                        <thead>
                          <tr>
                            {['ID', 'Client', 'Total', 'Date', 'Statut', 'Action'].map(h => <th key={h}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id}>
                              <td style={{ color: 'var(--gold)', fontWeight: '700' }}>#{order.id}</td>
                              <td>{order.client_id}</td>
                              <td style={{ color: 'var(--gold)', fontWeight: '700' }}>{parseFloat(order.total).toFixed(2)} €</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                {new Date(order.date).toLocaleDateString('fr-FR')}
                              </td>
                              <td>
                                <span className={statusClass(order.statut)}>{order.statut}</span>
                              </td>
                              <td>
                                <select
                                  className="input"
                                  value={order.statut}
                                  onChange={e => handleUpdateStatus(order.id, e.target.value)}
                                  style={{ width: 'auto', padding: '4px 8px', fontSize: '11px', margin: 0 }}
                                >
                                  <option value="en_cours">En cours</option>
                                  <option value="expédié">Expédié</option>
                                  <option value="livré">Livré</option>
                                  <option value="annulé">Annulé</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
              </div>
            )}

            {/* ===== UTILISATEURS ===== */}
            {activeTab === 'users' && (
              <div>
                <div className="section-title">Gestion des utilisateurs</div>
                {users.length === 0
                  ? <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Aucun utilisateur trouvé.</p>
                  : (
                    <div className="card" style={{ overflow: 'hidden' }}>
                      <table className="table">
                        <thead>
                          <tr>
                            {['ID', 'Nom', 'Email', 'Rôle'].map(h => <th key={h}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td style={{ color: 'var(--gold)', fontWeight: '700' }}>{user.id}</td>
                              <td>{user.nom}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{user.email}</td>
                              <td>
                                <span className={`status-badge ${user.role === 'administrateur' ? 'status-admin' : 'status-client'}`}>
                                  {user.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardPage