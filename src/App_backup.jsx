import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('orange')
  const [proposedTraining, setProposedTraining] = useState('')
  const [communityProposals, setCommunityProposals] = useState([
    { id: 1, title: "Gestion des finances familiales", votes: 15, author: "Marie Kabongo", date: "2024-01-15" },
    { id: 2, title: "Informatique de base pour seniors", votes: 12, author: "Jean-Pierre Mbuyi", date: "2024-01-14" },
    { id: 3, title: "Cuisine nutritionnelle", votes: 8, author: "Sarah Ntumba", date: "2024-01-13" }
  ])
  const [userVotes, setUserVotes] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-rotate gallery slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 7)
    }, 8000) // 8 seconds interval for very slow display

    return () => clearInterval(interval)
  }, [])

  const essentialTrainings = [
    {
      id: 1,
      title: "Gestion du Stress et Trauma",
      description: "Apprenez à gérer le stress post-traumatique et retrouver l'équilibre émotionnel",
      duration: "6 semaines",
      level: "Débutant",
      category: "Santé Mentale",
      icon: "🧠"
    },
    {
      id: 2,
      title: "Communication Familiale",
      description: "Techniques pour améliorer la communication au sein de la famille militaire",
      duration: "4 semaines",
      level: "Intermédiaire",
      category: "Relations",
      icon: "🗣️"
    },
    {
      id: 3,
      title: "Réinsertion Professionnelle",
      description: "Préparez votre reconversion professionnelle après la carrière militaire",
      duration: "8 semaines",
      level: "Avancé",
      category: "Carrière",
      icon: "💼"
    },
    {
      id: 4,
      title: "Gestion Budgétaire Familiale",
      description: "Apprenez à gérer efficacement les finances de votre famille",
      duration: "3 semaines",
      level: "Débutant",
      category: "Finances",
      icon: "💰"
    },
    {
      id: 5,
      title: "Premiers Secours",
      description: "Formation essentielle aux gestes qui sauvent en situation d'urgence",
      duration: "2 semaines",
      level: "Débutant",
      category: "Santé",
      icon: "🏥"
    },
    {
      id: 6,
      title: "Informatique et Numérique",
      description: "Maîtrisez les outils numériques essentiels pour aujourd'hui",
      duration: "4 semaines",
      level: "Débutant",
      category: "Technologie",
      icon: "💻"
    }
  ]

  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleDonation = (e) => {
    e.preventDefault()
    alert(`Merci pour votre généreux don de ${donationAmount} $! Votre soutien nous aide énormément.`)
    setDonationAmount('')
  }

  const handleTrainingEnroll = (trainingId) => {
    const training = essentialTrainings.find(t => t.id === trainingId)
    alert(`Inscription réussie à "${training.title}"! Vous recevrez un email avec les détails.`)
  }

  const handleProposalSubmit = (e) => {
    e.preventDefault()
    if (proposedTraining.trim()) {
      const newProposal = {
        id: communityProposals.length + 1,
        title: proposedTraining,
        votes: 0,
        author: "Utilisateur",
        date: new Date().toISOString().split('T')[0]
      }
      setCommunityProposals([newProposal, ...communityProposals])
      setProposedTraining('')
      alert(`Merci pour votre proposition! "${proposedTraining}" a été ajoutée aux suggestions de la communauté.`)
    }
  }

  const handleVote = (proposalId) => {
    if (!userVotes.includes(proposalId)) {
      setCommunityProposals(communityProposals.map(proposal => 
        proposal.id === proposalId 
          ? { ...proposal, votes: proposal.votes + 1 }
          : proposal
      ))
      setUserVotes([...userVotes, proposalId])
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src="./IMIZATUMAINILOGO.png" alt="Imiza Tumaini" className="logo-image" onError={(e) => {e.target.src = '/IMIZATUMAINILOGO.png'}} />
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <button 
              className={activeSection === 'home' ? 'active' : ''}
              onClick={() => {setActiveSection('home'); setIsMenuOpen(false)}}
            >
              Accueil
            </button>
            <button 
              className={activeSection === 'psychological' ? 'active' : ''}
              onClick={() => {setActiveSection('psychological'); setIsMenuOpen(false)}}
            >
              Soutien Psy
            </button>
            <button 
              className={activeSection === 'training' ? 'active' : ''}
              onClick={() => {setActiveSection('training'); setIsMenuOpen(false)}}
            >
              Formations
            </button>
            <button 
              className={activeSection === 'donation' ? 'active' : ''}
              onClick={() => {setActiveSection('donation'); setIsMenuOpen(false)}}
            >
              Soutenir
            </button>
            <button 
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => {setActiveSection('contact'); setIsMenuOpen(false)}}
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeSection === 'home' && (
          <section className="section">
            {/* Hero Section */}
            <div className="hero">
              <div className="hero-content">
                <h1 className="hero-title">
                  Forces Armées et Police<br/>
                  <span className="highlight">Familles Congolaises</span>
                </h1>
                <p className="hero-subtitle">
                  Soutien, accompagnement et excellence pour les familles qui servent la République Démocratique du Congo
                </p>
                <div className="hero-buttons">
                  <button className="btn-primary" onClick={() => setActiveSection('donation')}>
                    💝 Soutenir Nos Familles
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveSection('training')}>
                    📚 Voir les Formations
                  </button>
                </div>
              </div>
              <div className="hero-image">
                <div className="military-gallery">
                  <div className={`gallery-slide ${currentSlide === 0 ? 'active' : ''}`}>
                    <img src="https://img.freepik.com/photos-premium/desordre-dans-rues-afrique_433905-5975.jpg" alt="Enfants de Soldats Africains 1" />
                    <div className="slide-overlay">
                      <span>🇨🇩 Enfants de Nos Héros - L'Avenir</span>
                    </div>
                  </div>
                  <div className={`gallery-slide ${currentSlide === 1 ? 'active' : ''}`}>
                    <img src="https://images.radio-canada.ca/q_auto,w_960/v1/ici-premiere/16x9/congo-famille-guerre-enfants-hdm.jpg" alt="Enfants de Soldats Africains 2" />
                    <div className="slide-overlay">
                      <span>👦👧 Fiers Enfants de Militaires</span>
                    </div>
                  </div>
                  <div className={`gallery-slide ${currentSlide === 2 ? 'active' : ''}`}>
                    <img src="https://tse3.mm.bing.net/th/id/OIP.OTB_w9fW7DRGpkCCL6st1gHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Enfants de Soldats Africains 3" />
                    <div className="slide-overlay">
                      <span>📚 Éducation - Notre Priorité</span>
                    </div>
                  </div>
                  <div className={`gallery-slide ${currentSlide === 3 ? 'active' : ''}`}>
                    <img src="https://www.makanisi.org/wp-content/uploads/2024/05/FARDC-Presidence-RDC.jpg" alt="Enfants de Soldats Africains 4" />
                    <div className="slide-overlay">
                      <span>🎓 Formation des Jeunes Générations</span>
                    </div>
                  </div>
                  <div className={`gallery-slide ${currentSlide === 4 ? 'active' : ''}`}>
                    <img src="https://lpost.be/wp-content/uploads/2024/07/Belgaimage-RDC-armee.jpg" alt="Enfants de Soldats Africains 5" />
                    <div className="slide-overlay">
                      <span>🛡️ Protection et Soutien Familial</span>
                    </div>
                  </div>
                  <div className={`gallery-slide ${currentSlide === 5 ? 'active' : ''}`}>
                    <img src="https://ds.static.rtbf.be/article/image/1920x1080/a/a/e/8d3b008de4b4e76ca9f4d5a23f5073ea-1722415799.jpg" alt="Enfants de Soldats Africains 6" />
                    <div className="slide-overlay">
                      <span>🌟 Espoir et Résilience</span>
                    </div>
                  </div>
                  <div className={`gallery-slide ${currentSlide === 6 ? 'active' : ''}`}>
                    <img src="https://tse4.mm.bing.net/th/id/OIP.2VBZgYmc6WhJqjlSXxAVtQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Enfants de Soldats Africains 7" />
                    <div className="slide-overlay">
                      <span>🕊️ Paix pour Nos Enfants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="statistics">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">5000+</div>
                  <div className="stat-label">Familles Soutenues</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Psychologues Experts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">20+</div>
                  <div className="stat-label">Programmes de Formation</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Années d'Expérience</div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="about-section">
              <h2>À Propos de FAM</h2>
              <div className="about-content">
                <div className="about-text">
                  <p>
                    La Fondation des Familles Militaires (FAM) est une organisation dédiée au soutien et à l'accompagnement 
                    des familles des forces de défense et de sécurité de la République Démocratique du Congo. 
                    Notre mission est d'assurer le bien-être, la résilience et l'épanouissement de celles qui font le sacrifice 
                    de servir notre nation.
                  </p>
                  <p>
                    Depuis plus de 15 ans, nous travaillons sans relâche pour offrir un soutien complet aux familles 
                    confrontées aux défis uniques de la vie militaire, tout en célébrant leur courage et leur dévouement.
                  </p>
                </div>
                <div className="about-image">
                  <img src="https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=350&fit=crop" alt="Familles Militaires" />
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="mission-vision">
              <div className="mission-card">
                <h3>🎯 Notre Mission</h3>
                <p>
                  Fournir un soutien holistique aux familles militaires et policières congolaises à travers 
                  des services psychologiques de qualité, des programmes éducatifs, et une assistance sociale 
                  pour promouvoir leur bien-être et leur résilience.
                </p>
              </div>
              <div className="vision-card">
                <h3>🔭 Notre Vision</h3>
                <p>
                  Devenir la référence nationale en matière de soutien aux familles des forces de l'ordre, 
                  en créant une communauté solidaire où chaque famille militaire peut s'épanouir et prospérer.
                </p>
              </div>
            </div>

            {/* Values Section */}
            <div className="values-section">
              <h2>Nos Valeurs</h2>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">⭐</div>
                  <h3>Excellence</h3>
                  <p>Nous nous engageons à fournir des services de la plus haute qualité</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">🤝</div>
                  <h3>Solidarité</h3>
                  <p>Nous créons des liens forts entre les familles militaires</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">🛡️</div>
                  <h3>Intégrité</h3>
                  <p>Nous agissons avec honnêteté et transparence</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">💪</div>
                  <h3>Résilience</h3>
                  <p>Nous aidons les familles à surmonter tous les défis</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="cta-section">
              <div className="cta-content">
                <h2>Rejoignez Notre Mission</h2>
                <p>Votre soutien transforme des vies et renforce notre nation</p>
                <div className="cta-buttons">
                  <button className="btn-primary btn-large" onClick={() => setActiveSection('donation')}>
                    💝 Faire un Don Maintenant
                  </button>
                  <button className="btn-secondary btn-large" onClick={() => setActiveSection('contact')}>
                    📞 Nous Contacter
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'psychological' && (
          <section className="section">
            <h1>Soutien Psychologique</h1>
            <p>Un accompagnement spécialisé pour les familles militaires confrontées aux défis uniques de la vie militaire.</p>
            
            <div className="psychological-services">
              <div className="service-card">
                <h3>🧠 Thérapie Individuelle</h3>
                <p>Sessions confidentielles avec des psychologues spécialisés dans le trauma militaire</p>
                <button className="btn-primary">Prendre Rendez-vous</button>
              </div>
              
              <div className="service-card">
                <h3>👨‍👩‍👧‍👦 Thérapie Familiale</h3>
                <p>Renforcer les liens familiaux et gérer les tensions liées à la vie militaire</p>
                <button className="btn-primary">Réserver une Session</button>
              </div>
              
              <div className="service-card">
                <h3>👥 Groupes de Soutien</h3>
                <p>Partagez vos expériences avec d'autres familles dans un environnement bienveillant</p>
                <button className="btn-primary">Rejoindre un Groupe</button>
              </div>
              
              <div className="service-card">
                <h3>📱 Soutien en Ligne</h3>
                <p>Consultations psychologiques accessibles depuis chez vous</p>
                <button className="btn-primary">Commencer Maintenant</button>
              </div>
            </div>

            <div className="emergency-support">
              <h2>Support d'Urgence</h2>
              <div className="emergency-card">
                <h3>🚨 Besoin d'aide immédiatement ?</h3>
                <p>Nous sommes disponibles 24/7 pour les situations d'urgence</p>
                <div className="emergency-contacts">
                  <div className="contact-item">
                    <strong>Téléphone d'urgence:</strong>
                    <span>+243 123 456 789</span>
                  </div>
                  <div className="contact-item">
                    <strong>WhatsApp:</strong>
                    <span>+243 987 654 321</span>
                  </div>
                  <div className="contact-item">
                    <strong>Email d'urgence:</strong>
                    <span>urgence@famillesmilitaires.cd</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'training' && (
          <section className="section">
            <h1>Formations Communautaires</h1>
            <p>Développez de nouvelles compétences et participez à la création de formations qui répondent à vos besoins réels.</p>
            
            {/* Essential Trainings */}
            <div className="training-intro">
              <h2>🎯 Formations Essentielles</h2>
              <p>Ces formations fondamentales sont recommandées pour toutes les familles militaires.</p>
            </div>
            
            <div className="training-grid">
              {essentialTrainings.map((training) => (
                <div key={training.id} className="training-card enhanced">
                  <div className="training-header">
                    <div className="training-icon">{training.icon}</div>
                    <div className="training-info">
                      <h3>{training.title}</h3>
                      <span className="training-category">{training.category}</span>
                    </div>
                    <span className="training-level">{training.level}</span>
                  </div>
                  <p>{training.description}</p>
                  <div className="training-meta">
                    <span>⏱️ {training.duration}</span>
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => handleTrainingEnroll(training.id)}
                  >
                    S'inscrire
                  </button>
                </div>
              ))}
            </div>

            {/* Community Proposals Section */}
            <div className="community-proposals">
              <h2>💬 Propositions de la Communauté</h2>
              <p>Proposez des formations et votez pour celles qui vous intéressent le plus!</p>
              
              <div className="proposal-form">
                <h3>📝 Proposer une formation</h3>
                <form onSubmit={handleProposalSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Quelle formation aimeriez-vous suivre?"
                      value={proposedTraining}
                      onChange={(e) => setProposedTraining(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    🚀 Proposer cette formation
                  </button>
                </form>
              </div>

              <div className="proposals-list">
                <h3>📊 Propositions en cours</h3>
                <div className="proposals-grid">
                  {communityProposals.map((proposal) => (
                    <div key={proposal.id} className="proposal-card">
                      <div className="proposal-header">
                        <h4>{proposal.title}</h4>
                        <div className="proposal-votes">
                          <span className="vote-count">👍 {proposal.votes}</span>
                        </div>
                      </div>
                      <div className="proposal-meta">
                        <span>Par {proposal.author}</span>
                        <span>•</span>
                        <span>{proposal.date}</span>
                      </div>
                      <button 
                        className={`vote-btn ${userVotes.includes(proposal.id) ? 'voted' : ''}`}
                        onClick={() => handleVote(proposal.id)}
                        disabled={userVotes.includes(proposal.id)}
                      >
                        {userVotes.includes(proposal.id) ? '✅ Déjà voté' : '👍 Voter pour cette formation'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Training Process */}
            <div className="training-process">
              <h2>🔄 Notre Processus de Formation</h2>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Proposition</h3>
                  <p>La communauté propose des formations</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Vote</h3>
                  <p>Votez pour les formations qui vous intéressent</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Sélection</h3>
                  <p>Nous organisons les formations les plus demandées</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Formation</h3>
                  <p>Participez aux formations en ligne ou en présentiel</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'donation' && (
          <section className="section">
            <h1>Soutenir Notre Mission</h1>
            <p>Votre générosité nous aide à continuer d'offrir un soutien essentiel aux familles militaires congolaises.</p>
            
            <div className="donation-hero">
              <div className="donation-hero-content">
                <h2>🇨🇩 Soutenez les Héros de Notre Nation</h2>
                <p>Chaque don contribue directement à améliorer la vie des familles qui servent la République Démocratique du Congo</p>
              </div>
            </div>
            
            <div className="donation-container">
              <div className="donation-form">
                <h2>Faire un Don par Mobile Money</h2>
                <form onSubmit={handleDonation}>
                  <div className="payment-methods">
                    <h3>Choisissez votre méthode de paiement</h3>
                    <div className="payment-options">
                      <label className={`payment-option ${selectedPaymentMethod === 'orange' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="orange"
                          checked={selectedPaymentMethod === 'orange'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <div className="payment-info">
                          <div className="payment-logo">🟠</div>
                          <div>
                            <strong>Orange Money</strong>
                            <span>+243 815 123 456</span>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`payment-option ${selectedPaymentMethod === 'mpesa' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="mpesa"
                          checked={selectedPaymentMethod === 'mpesa'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <div className="payment-info">
                          <div className="payment-logo">💚</div>
                          <div>
                            <strong>MPesa</strong>
                            <span>+243 975 123 456</span>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`payment-option ${selectedPaymentMethod === 'airtel' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="airtel"
                          checked={selectedPaymentMethod === 'airtel'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <div className="payment-info">
                          <div className="payment-logo">🔵</div>
                          <div>
                            <strong>Airtel Money</strong>
                            <span>+243 970 123 456</span>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`payment-option ${selectedPaymentMethod === 'bank' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="bank"
                          checked={selectedPaymentMethod === 'bank'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <div className="payment-info">
                          <div className="payment-logo">🏦</div>
                          <div>
                            <strong>Virement Bancaire</strong>
                            <span>RAWBANK: RDC00123456789</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="amount-options">
                    <h3>Montant du don</h3>
                    <div className="amount-buttons">
                      <button type="button" className="amount-btn" onClick={() => setDonationAmount('10')}>10$</button>
                      <button type="button" className="amount-btn" onClick={() => setDonationAmount('25')}>25$</button>
                      <button type="button" className="amount-btn" onClick={() => setDonationAmount('50')}>50$</button>
                      <button type="button" className="amount-btn" onClick={() => setDonationAmount('100')}>100$</button>
                      <button type="button" className="amount-btn" onClick={() => setDonationAmount('500')}>500$</button>
                    </div>
                  </div>
                  
                  <div className="custom-amount">
                    <input
                      type="number"
                      placeholder="Montant personnalisé ($)"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="donation-info">
                    <input
                      type="text"
                      name="name"
                      placeholder="Votre nom complet"
                      onChange={handleFormChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Votre email"
                      onChange={handleFormChange}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Votre téléphone (optionnel)"
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="donation-instructions">
                    <h3>Instructions de paiement</h3>
                    <ol>
                      <li>Choisissez le montant de votre don</li>
                      <li>Sélectionnez votre méthode de paiement préférée</li>
                      <li>Cliquez sur "Confirmer le don" pour recevoir les instructions détaillées</li>
                      <li>Effectuez le paiement selon votre méthode choisie</li>
                      <li>Vous recevrez une confirmation par email</li>
                    </ol>
                    
                    <div className="payment-details">
                      <h4>Détails des méthodes de paiement</h4>
                      <div className="payment-method-details">
                        <div className="method-detail">
                          <strong>🟠 Orange Money:</strong> +243 815 123 456
                        </div>
                        <div className="method-detail">
                          <strong>💚 MPesa:</strong> +243 975 123 456
                        </div>
                        <div className="method-detail">
                          <strong>🔵 Airtel Money:</strong> +243 970 123 456
                        </div>
                        <div className="method-detail">
                          <strong>🏦 Virement Bancaire:</strong> RAWBANK - RDC00123456789
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" className="btn-primary btn-large">
                    💝 Confirmer le Don de {donationAmount || '0'}$
                  </button>
                </form>
              </div>
              
              <div className="impact-info">
                <h2>Impact de Votre Don</h2>
                <div className="impact-items">
                  <div className="impact-item">
                    <span className="impact-amount">10$</span>
                    <span className="impact-desc">Une session de thérapie pour un enfant</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-amount">25$</span>
                    <span className="impact-desc">Un mois d'accès aux formations</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-amount">50$</span>
                    <span className="impact-desc">Soutien psychologique familial</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-amount">100$</span>
                    <span className="impact-desc">Formation complète pour une famille</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-amount">500$</span>
                    <span className="impact-desc">Soutien complet pour une année</span>
                  </div>
                </div>
                
                <div className="donation-transparency">
                  <h3>Transparence Totale</h3>
                  <p>100% de votre don est directement alloué aux programmes de soutien aux familles. 
                  Nos rapports financiers sont publiés trimestriellement.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="section">
            <h1>Contactez-Nous</h1>
            <p>Nous sommes là pour vous écouter et vous soutenir dans votre parcours.</p>
            
            <div className="contact-container">
              <div className="contact-form">
                <h2>Envoyez-nous un Message</h2>
                <form>
                  <div className="form-group">
                    <input type="text" placeholder="Votre nom complet" required />
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Votre email" required />
                  </div>
                  <div className="form-group">
                    <input type="tel" placeholder="Votre téléphone" />
                  </div>
                  <div className="form-group">
                    <select required>
                      <option value="">Sélectionnez le type de demande</option>
                      <option value="psychological">Soutien psychologique</option>
                      <option value="training">Information sur les formations</option>
                      <option value="donation">Questions sur les dons</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Votre message" rows="5" required></textarea>
                  </div>
                  <button type="submit" className="btn-primary">Envoyer le Message</button>
                </form>
              </div>
              
              <div className="contact-info">
                <h2>Nos Coordonnées</h2>
                <div className="contact-block">
                  <div className="contact-header">
                    <h3>🏢 Imiza Tumaini - Familles Militaires</h3>
                    <p>Toutes nos coordonnées en un seul endroit</p>
                  </div>
                  <div className="contact-details">
                    <div className="contact-detail">
                      <span className="contact-icon">📍</span>
                      <div className="contact-text">
                        <strong>Adresse</strong>
                        <p>Avenue des Forces Armées, Kinshasa<br/>République Démocratique du Congo</p>
                      </div>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-icon">📞</span>
                      <div className="contact-text">
                        <strong>Téléphone</strong>
                        <p>+243 123 456 789 (Principal)<br/>+243 987 654 321 (Urgence)</p>
                      </div>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-icon">📧</span>
                      <div className="contact-text">
                        <strong>Email</strong>
                        <p>info@famillesmilitaires.cd<br/>support@famillesmilitaires.cd</p>
                      </div>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-icon">⏰</span>
                      <div className="contact-text">
                        <strong>Horaires</strong>
                        <p>Lundi - Vendredi: 8h00 - 18h00<br/>Samedi: 9h00 - 16h00<br/>Urgence: 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>À Propos</h3>
            <p>Nous soutenons les familles militaires congolaises à travers des services psychologiques, des formations et une communauté solidaire.</p>
          </div>
          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li>Soutien Psychologique</li>
              <li>Formations en Ligne</li>
              <li>Groupes de Soutien</li>
              <li>Collecte de Fonds</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>📍 Kinshasa, RDC<br/>📞 +243 123 456 789<br/>📧 info@famillesmilitaires.cd</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Familles Militaires Congolaises. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
