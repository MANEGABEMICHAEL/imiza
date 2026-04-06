import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import './components/Dashboard.css'

// Import des images locales
import imgEnfants from './assets/enfants.jpeg'
import img1 from './assets/WhatsApp Image 2026-04-06 at 13.14.54.jpeg'
import img2 from './assets/WhatsApp Image 2026-04-06 at 13.14.56 (1).jpeg'
import img3 from './assets/WhatsApp Image 2026-04-06 at 13.14.56.jpeg'
import img4 from './assets/WhatsApp Image 2026-04-06 at 13.14.57 (1).jpeg'
import img5 from './assets/WhatsApp Image 2026-04-06 at 13.14.57 (2).jpeg'
import img6 from './assets/WhatsApp Image 2026-04-06 at 13.14.57.jpeg'
import img7 from './assets/WhatsApp Image 2026-04-06 at 13.14.58 (1).jpeg'
import img8 from './assets/WhatsApp Image 2026-04-06 at 13.14.58 (2).jpeg'
import img9 from './assets/WhatsApp Image 2026-04-06 at 13.14.58.jpeg'
import img10 from './assets/WhatsApp Image 2026-04-06 at 13.14.59 (1).jpeg'
import img11 from './assets/WhatsApp Image 2026-04-06 at 13.14.59 (2).jpeg'
import img12 from './assets/WhatsApp Image 2026-04-06 at 13.14.59 (3).jpeg'
import img13 from './assets/WhatsApp Image 2026-04-06 at 13.14.59.jpeg'

// Security measures
const SECURITY_CONFIG = {
  preventRightClick: true,
  preventCopy: true,
  preventDevTools: true,
  preventPrint: true,
  preventSave: true,
  encryptData: true,
  sessionTimeout: 300000, // 5 minutes
  maxLoginAttempts: 3
}

// Anti-tampering detection (less strict)
const detectTampering = () => {
  let modificationCount = 0
  const maxModifications = 5
  
  const checkInterval = setInterval(() => {
    // Only check for major modifications, not normal React updates
    const currentHTML = document.documentElement.outerHTML
    if (currentHTML.includes('TENTATIVE DE MODIFICATION') || 
        currentHTML.includes('ACCÈS NON AUTORISÉ') ||
        currentHTML.includes('🚫')) {
      modificationCount++
      if (modificationCount >= maxModifications) {
        clearInterval(checkInterval)
        return
      }
    }
  }, 5000) // Check every 5 seconds instead of 1 second
  return checkInterval
}

// Encrypt sensitive data
const encryptData = (data) => {
  return btoa(encodeURIComponent(JSON.stringify(data)))
}

const decryptData = (encryptedData) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encryptedData)))
  } catch {
    return null
  }
}

// Session security
let sessionTimer = null
const resetSessionTimer = () => {
  clearTimeout(sessionTimer)
  sessionTimer = setTimeout(() => {
    alert('⏰ SESSION EXPIRÉE - Veuillez vous reconnecter')
    window.location.reload()
  }, SECURITY_CONFIG.sessionTimeout)
}

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [donationAmount, setDonationAmount] = useState('25')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('orange')
  const [donorInfo, setDonorInfo] = useState({ name: '', phone: '', email: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [communityProposals, setCommunityProposals] = useState(encryptData([
    {id:1,title:"Gestion des finances familiales",votes:15,author:"Marie Kabongo",date:"2024-01-15"},
    {id:2,title:"Informatique de base pour seniors",votes:12,author:"Jean-Pierre Mbuyi",date:"2024-01-14"},
    {id:3,title:"Cuisine nutritionnelle",votes:8,author:"Sarah Ntumba",date:"2024-01-13"}
  ]))
  const [userVotes, setUserVotes] = useState([])
  const [newProposal, setNewProposal] = useState({title:'', author:'', description:''})
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [currentLang, setCurrentLang] = useState('fr')
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [adminCredentials] = useState({ username: 'admin', password: 'Imiza2025!' })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [allDonations, setAllDonations] = useState([])
  const [userDonations, setUserDonations] = useState([])
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    message: ''
  })
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    phone: '',
    email: '',
    training: '',
    message: ''
  })
  
  // Translation system
  const translations = {
    fr: {
      accueil: "Accueil",
      mission: "Mission", 
      programme: "Programme",
      soutien: "Soutien Psy",
      formations: "Formations",
      dons: "Dons",
      contact: "Contact",
      titre: "IMIZA TUMAINI",
      sousTitre: "Familles Militaires Congolaises",
      description: "Soutien, Formation et Communauté pour nos Héros et leurs Familles",
      soutenirFamilles: "💝 Soutenir Nos Familles",
      voirFormations: "📚 Voir les Formations",
      notreMission: "Notre Mission",
      vision: "Vision",
      visionText: "Devenir la référence nationale en matière de soutien aux familles militaires, en créant une communauté forte, résiliente et autonome.",
      missionPrincipale: "Mission Principale",
      missionText: "Fournir un soutien complet et adapté aux familles militaires congolaises à travers des services psychologiques, des formations professionnelles et un accompagnement personnalisé.",
      nosObjectifs: "Nos Objectifs",
      objectifsIntro: "Nous nous engageons à atteindre des objectifs mesurables pour améliorer concrètement la vie des familles militaires.",
      nosProgrammes: "Nos Programmes",
      santeMentale: "Santé Mentale",
      santeMentaleText: "Soutien psychologique individuel et familial pour gérer le stress et le trauma.",
      therapieIndividuelle: "Thérapie individuelle",
      conseilFamilial: "Conseil familial",
      groupesSoutien: "Groupes de soutien",
      educationProg: "Éducation",
      educationProgText: "Programmes éducatifs pour enfants et adultes des familles militaires.",
      soutienScolaire: "Soutien scolaire",
      orientationProfessionnelle: "Orientation professionnelle",
      boursesEtudes: "Bourses d'études",
      developpementEconomique: "Développement Économique",
      developpementEconomiqueText: "Formation professionnelle et aide à la création d'entreprises.",
      formationsTechniques: "Formations techniques",
      microCredit: "Micro-crédit",
      accompagnementEntrepreneurial: "Accompagnement entrepreneurial",
      santeBienEtre: "Santé et Bien-être",
      santeBienEtreText: "Accès aux soins de santé et programmes de bien-être.",
      consultationsMedicales: "Consultations médicales",
      campagnesVaccination: "Campagnes de vaccination",
      programmesNutritionnels: "Programmes nutritionnels",
      
      // Soutien Psychologique
      soutienPsychologique: "Soutien Psychologique",
      bienEtreMental: "Votre Bien-être Mental est Notre Priorité",
      bienEtreMentalText: "Nous offrons un soutien psychologique complet et confidentiel aux familles militaires confrontées aux défis uniques de la vie militaire.",
      therapieIndividuelleTitle: "👥 Thérapie Individuelle",
      therapieIndividuelleDesc: "Sessions individuelles confidentielles avec des psychologues spécialisés dans les traumatismes militaires.",
      prendreRendezVous: "Prendre Rendez-vous",
      therapieFamilialeTitle: "👨‍👩‍👧‍👦 Thérapie Familiale",
      therapieFamilialeDesc: "Thérapie familiale pour renforcer les liens et améliorer la communication au sein de la famille.",
      groupesSoutienTitle: "👥 Groupes de Soutien",
      groupesSoutienDesc: "Groupes de parole et soutien entre familles militaires pour partager expériences et solutions.",
      rejoindreGroupe: "Rejoindre un Groupe",
      soutienUrgenceTitle: "📞 Soutien d'Urgence",
      soutienUrgenceDesc: "Ligne d'écoute 24/7 pour les situations de crise et soutien immédiat.",
      appelerMaintenant: "Appeler Maintenant",
      notreEquipeSpecialistes: "Notre Équipe de Spécialistes",
      drJeanMukendi: "Dr. Jean Mukendi",
      drJeanMukendiText: "Psychologue clinicien - 15 ans d'expérience",
      drMarieNtumba: "Dr. Marie Ntumba",
      drMarieNtumbaText: "Thérapeute familiale - 12 ans d'expérience",
      drPierreKabongo: "Dr. Pierre Kabongo",
      drPierreKabongoText: "Psychiatre - 20 ans d'expérience",
      
      // Formations
      nosFormations: "Nos Formations",
      sInscrire: "S'inscrire",
      propositionsCommunaute: "💡 Propositions de la Communauté",
      proposerFormation: "Proposer une formation",
      annuler: "Annuler",
      proposerNouvelleFormation: "Proposer une nouvelle formation",
      titreFormation: "Titre de la formation",
      votreNom: "Votre nom",
      descriptionFormation: "Description de la formation",
      soumettreProposition: "Soumettre la proposition",
      par: "Par",
      votes: "votes",
      dejaVote: "Déjà voté",
      voter: "Voter",
      
      // Dons
      faireDon: "Faire un Don",
      montantPersonnalise: "Montant personnalisé",
      envoyerDon: "Envoyer le Don",
      
      // Contact
      envoyezMessage: "Envoyez-nous un Message",
      votreNomComplet: "Votre nom complet",
      votreEmail: "Votre email",
      votreTelephone: "Votre téléphone",
      soutenezNosFamilles: "Soutenez Nos Familles",
      contactezNous: "Contactez-nous",
      aPropos: "À Propos",
      services: "Services",
      contactFooter: "Contact",
      copyright: "© 2025 Imiza tumaini. Tous droits réservés.",
      
      // Modal rendez-vous
      prendreRendezVousTitle: "Prendre un Rendez-vous",
      nomComplet: "Nom complet",
      telephone: "Téléphone",
      email: "Email",
      choisirService: "Choisir le service",
      choisirDate: "Choisir une date",
      choisirHeure: "Choisir une heure",
      messageOptionnel: "Message (optionnel)",
      confirmerRendezVous: "Confirmer le Rendez-vous",
      fermer: "Fermer",
      
      // Modal inscription
      inscriptionFormation: "Inscription à la Formation",
      choisirFormation: "Choisir la formation",
      confirmerInscription: "Confirmer l'Inscription",
      
      // Messages de succès
      rendezVousPris: "✅ Rendez-vous pris avec succès! Nous vous contacterons prochainement.",
      inscriptionReussie: "✅ Inscription réussie! Nous vous enverrons les détails par email.",
    },
    ln: {
      accueil: "Lisusu",
      mission: "Misso",
      programme: "Programme",
      soutien: "Bosongo ya moko",
      formations: "Bilengi",
      dons: "Mikoka",
      contact: "Kotisa",
      titre: "IMIZA TUMAINI",
      sousTitre: "Baninga ya Basoldat ya Kongo",
      description: "Bosongo, Bilengi mpe Kombo ya Batu biso ya bakonzi mpe baninga na bango",
      soutenirFamilles: "💝 Tia mikoka na baninga biso",
      voirFormations: "📚 Tia bilengi",
      notreMission: "Misso na biso",
      vision: "Visio",
      visionText: "Kozwa reference ya mboka na bosongo ya baninga ya basoldat, mpe kokoma kombo ya makasi, mpe ya moko",
      missionPrincipale: "Misso ya monene",
      missionText: "Kopesa bosongo nyonso mpe ya mikolo mikolo na baninga ya basoldat ya Kongo na bisika ya bosongo ya moko, bilengi ya bosango mpe bosongo ya mobali",
      nosObjectifs: "Boyingi ya biso",
      objectifsIntro: "Tosengeli kukitisa boyingi oyo ekoki kozala mpe kobongisa bomoi ya baninga ya basoldat",
      nosProgrammes: "Ba Programme na biso",
      soutienPsychologique: "Bosongo ya Moko",
      nosFormations: "Bilengi na biso",
      soutenezNosFamilles: "Tia Mikoka na Baninga biso",
      contactezNous: "Kotisa biso",
      aPropos: "Na Likolo",
      services: "Ba Services",
      contactFooter: "Kotisa",
      copyright: "© 2025 Imiza tumaini. Ba droits nyonso ezali.",
      
      // Soutien Psychologique - Lingala
      bienEtreMental: "Bolamu ya Moko ya Moyo Eza Priorité ya Biso",
      bienEtreMentalText: "Tosala bosongo ya moko ya mikolo mikolo mpe ya kombo na baninga ya basoldat bazali na ba défi oyo ekomi na bomoi ya basoldat",
      therapieIndividuelleTitle: "👥 Bosongo ya Moko",
      therapieIndividuelleDesc: "Ba séances ya mikolo mikolo na ba psychologues spécialisés dans ba traumatismes militaires",
      prendreRendezVous: "Tia Rendez-vous",
      therapieFamilialeTitle: "👨‍👩‍👧‍👦 Bosongo ya Baninga",
      therapieFamilialeDesc: "Bosongo ya baninga mpe kokoma ba liens ya malamu mpe ameliorer communication na mboka ya baninga",
      groupesSoutienTitle: "👥 Ba Groupes ya Soutien",
      groupesSoutienDesc: "Ba groupes ya koloba mpe soutien entre ba familles militaires mpe kokata ba expériences mpe ba solutions",
      rejoindreGroupe: "Koka na Groupe",
      soutienUrgenceTitle: "📞 Soutien ya Mbula Mbula",
      soutienUrgenceDesc: "Ligne ya koloko 24/7 mpo na ba situations ya crise mpe soutien ya mboka",
      appelerMaintenant: "Kola Lembete",
      notreEquipeSpecialistes: "Ba Spécialistes ya Équipe na Bisso",
      drJeanMukendi: "Dr. Jean Mukendi",
      drJeanMukendiText: "Psychologue clinicien - 15 ans d'expérience",
      drMarieNtumba: "Dr. Marie Ntumba",
      drMarieNtumbaText: "Thérapeute familiale - 12 ans d'expérience",
      drPierreKabongo: "Dr. Pierre Kabongo",
      drPierreKabongoText: "Psychiatre - 20 ans d'expérience",
      
      // Formations - Lingala
      sInscrire: "Koka",
      propositionsCommunaute: "💡 Ba Proposals ya Communauté",
      proposerFormation: "Proposer formation",
      annuler: "Kolonga",
      proposerNouvelleFormation: "Proposer formation nouveau",
      titreFormation: "Titre ya formation",
      votreNom: "Nkombo ya yo",
      descriptionFormation: "Description ya formation",
      soumettreProposition: "Tia proposition",
      par: "Na",
      votes: "ba votes",
      dejaVote: "Ekoki kovota likolo",
      voter: "Kota vote",
      
      // Modal rendez-vous - Lingala
      prendreRendezVousTitle: "Tia Rendez-vous",
      nomComplet: "Nkombo mobimba",
      telephone: "Telefoni",
      email: "Email",
      choisirService: "Pona service",
      choisirDate: "Pona date",
      choisirHeure: "Pona heure",
      messageOptionnel: "Message (optionnel)",
      confirmerRendezVous: "Confirm Rendez-vous",
      fermer: "Kanga",
      
      // Modal inscription - Lingala
      inscriptionFormation: "Koka na Formation",
      choisirFormation: "Pona formation",
      confirmerInscription: "Confirm Inscription",
      
      // Messages de succès - Lingala
      rendezVousPris: "✅ Rendez-vous ekoki pona! Tosala contact na yo mboka.",
      inscriptionReussie: "✅ Inscription ekoki! Tosala ba détails na email na yo."
    },
    en: {
      accueil: "Home",
      mission: "Mission",
      programme: "Program", 
      soutien: "Psych Support",
      formations: "Training",
      dons: "Donations",
      contact: "Contact",
      titre: "IMIZA TUMAINI",
      sousTitre: "Congolese Military Families",
      description: "Support, Training and Community for our Heroes and their Families",
      soutenirFamilles: "💝 Support Our Families",
      voirFormations: "📚 View Training",
      notreMission: "Our Mission",
      vision: "Vision",
      visionText: "To become the national reference in supporting military families, creating a strong, resilient and autonomous community.",
      missionPrincipale: "Main Mission",
      missionText: "To provide complete and adapted support to Congolese military families through psychological services, professional training and personalized support.",
      nosObjectifs: "Our Objectives",
      objectifsIntro: "We are committed to achieving measurable objectives to concretely improve the lives of military families.",
      nosProgrammes: "Our Programs",
      soutienPsychologique: "Psychological Support",
      nosFormations: "Our Training",
      soutenezNosFamilles: "Support Our Families",
      contactezNous: "Contact us",
      aPropos: "About",
      services: "Services",
      contactFooter: "Contact",
      copyright: "© 2025 Imiza tumaini. All rights reserved.",
      
      // Soutien Psychologique - English
      bienEtreMental: "Your Mental Well-being is Our Priority",
      bienEtreMentalText: "We offer complete and confidential psychological support to military families facing the unique challenges of military life.",
      therapieIndividuelleTitle: "👥 Individual Therapy",
      therapieIndividuelleDesc: "Confidential individual sessions with psychologists specialized in military trauma.",
      prendreRendezVous: "Take Appointment",
      therapieFamilialeTitle: "👨‍👩‍👧‍👦 Family Therapy",
      therapieFamilialeDesc: "Family therapy to strengthen bonds and improve communication within the family.",
      groupesSoutienTitle: "👥 Support Groups",
      groupesSoutienDesc: "Support and discussion groups between military families to share experiences and solutions.",
      rejoindreGroupe: "Join a Group",
      soutienUrgenceTitle: "📞 Emergency Support",
      soutienUrgenceDesc: "24/7 listening line for crisis situations and immediate support.",
      appelerMaintenant: "Call Now",
      notreEquipeSpecialistes: "Our Team of Specialists",
      drJeanMukendi: "Dr. Jean Mukendi",
      drJeanMukendiText: "Clinical Psychologist - 15 years experience",
      drMarieNtumba: "Dr. Marie Ntumba",
      drMarieNtumbaText: "Family Therapist - 12 years experience",
      drPierreKabongo: "Dr. Pierre Kabongo",
      drPierreKabongoText: "Psychiatrist - 20 years experience",
      
      // Formations - English
      sInscrire: "Register",
      propositionsCommunaute: "💡 Community Proposals",
      proposerFormation: "Propose training",
      annuler: "Cancel",
      proposerNouvelleFormation: "Propose new training",
      titreFormation: "Training title",
      votreNom: "Your name",
      descriptionFormation: "Training description",
      soumettreProposition: "Submit proposal",
      par: "By",
      votes: "votes",
      dejaVote: "Already voted",
      voter: "Vote",
      
      // Modal rendez-vous - English
      prendreRendezVousTitle: "Take an Appointment",
      nomComplet: "Full name",
      telephone: "Phone",
      email: "Email",
      choisirService: "Choose service",
      choisirDate: "Choose date",
      choisirHeure: "Choose time",
      messageOptionnel: "Message (optional)",
      confirmerRendezVous: "Confirm Appointment",
      fermer: "Close",
      
      // Modal inscription - English
      inscriptionFormation: "Training Registration",
      choisirFormation: "Choose training",
      confirmerInscription: "Confirm Registration",
      
      // Messages de succès - English
      rendezVousPris: "✅ Appointment taken successfully! We will contact you soon.",
      inscriptionReussie: "✅ Registration successful! We will send you details by email."
    },
    sw: {
      accueil: "Nyumbani",
      mission: "Dhamira",
      programme: "Programu",
      soutien: "Msaada wa Akili",
      formations: "Mafunzo",
      dons: "Michango",
      contact: "Mawasiliano",
      titre: "IMIZA TUMAINI",
      sousTitre: "Familia za Wanajeshi wa Kongo",
      description: "Msaada, Mafunzo na Jumuiya kwa Mashujaa wetu na Familia zao",
      soutenirFamilles: "💝 Saidia Familia Zetu",
      voirFormations: "📚 Ona Mafunzo",
      notreMission: "Dhamira Yetu",
      vision: "Ujumbe",
      visionText: "Kuwa rejea la kitaifa katika kusaidia familia za wanajeshi, kuunda jumuiya imara, yenye ustahimilivu na kujitegemea.",
      missionPrincipale: "Dhamira Kuu",
      missionText: "Kutoa msaada kamili na ulioboreshwa kwa familia za wanajeshi wa Kongo kupitia huduma za akili, mafunzo ya kitaalam na msaada wa kibinafsi.",
      nosObjectifs: "Lengo Letu",
      objectifsIntro: "Tunaahidi kufikia malengo ya kupimika ili kuboresha maisha ya familia za wanajeshi kimwili.",
      nosProgrammes: "Programu Zetu",
      soutienPsychologique: "Msaada wa Akili",
      nosFormations: "Mafunzo Yetu",
      soutenezNosFamilles: "Saidia Familia Zetu",
      contactezNous: "Wasiliana nasi",
      aPropos: "Kuhusu",
      services: "Huduma",
      contactFooter: "Mawasiliano",
      copyright: "© 2025 Imiza tumaini. Haki zote zimehifadhiwa.",
      
      // Soutien Psychologique - Swahili
      bienEtreMental: "Afya Yako ya Akili ni Kipaumbele Chetu",
      bienEtreMentalText: "Tunatoa msaada kamili wa siri kwa familia za wanajeshi zinazokabili na changamoto za kipekee za maisha ya kijeshi.",
      therapieIndividuelleTitle: "👥 Tiba ya Kibinafsi",
      therapieIndividuelleDesc: "Vituo vya binafsi vya siri na wataalamu wa saikolojia wanaojihusisha na majeraha ya kijeshi.",
      prendreRendezVous: "Chukua Rendezvous",
      therapieFamilialeTitle: "👨‍👩‍👧‍👦 Tiba ya Familia",
      therapieFamilialeDesc: "Tiba ya familia ili kuimarisha mahusiano na kuboresha mawasiliano ndani ya familia.",
      groupesSoutienTitle: "👥 Vikundi vya Msaada",
      groupesSoutienDesc: "Vikundi vya mazungumzo na msaada kati ya familia za wanajeshi kushiriki uzoefu na suluhisho.",
      rejoindreGroupe: "Jiunge na Kikundi",
      soutienUrgenceTitle: "📞 Msaada wa Dharura",
      soutienUrgenceDesc: "Laini ya kusikiliza 24/7 kwa hali za dharura na msaada wa haraka.",
      appelerMaintenant: "Piga Sasa",
      notreEquipeSpecialistes: "Timu Yetu ya Wataalamu",
      drJeanMukendi: "Dkt. Jean Mukendi",
      drJeanMukendiText: "Saikolojia wa kliniki - Miaka 15 ya uzoefu",
      drMarieNtumba: "Dkt. Marie Ntumba",
      drMarieNtumbaText: "Mtaalamu wa tiba ya familia - Miaka 12 ya uzoefu",
      drPierreKabongo: "Dkt. Pierre Kabongo",
      drPierreKabongoText: "Mtaalamu wa magonjwa ya akili - Miaka 20 ya uzoefu",
      
      // Formations - Swahili
      sInscrire: "Jiandikishe",
      propositionsCommunaute: "💡 Mapendekezo ya Jumuiya",
      proposerFormation: "Pendekeza mafunzo",
      annuler: "Ghairi",
      proposerNouvelleFormation: "Pendekeza mafunzo mapya",
      titreFormation: "Kichwa cha mafunzo",
      votreNom: "Jina lako",
      descriptionFormation: "Maelezo ya mafunzo",
      soumettreProposition: "Wasilisha pendekezo",
      par: "Na",
      votes: "kura",
      dejaVote: "Tayari kumepiga kura",
      voter: "Piga kura",
      
      // Modal rendez-vous - Swahili
      prendreRendezVousTitle: "Chukua Rendezvous",
      nomComplet: "Jina kamili",
      telephone: "Simu",
      email: "Barua pepe",
      choisirService: "Chagua huduma",
      choisirDate: "Chagua tarehe",
      choisirHeure: "Chagua wakati",
      messageOptionnel: "Ujumbe (hiari)",
      confirmerRendezVous: "Thibitisha Rendezvous",
      fermer: "Funga",
      
      // Modal inscription - Swahili
      inscriptionFormation: "Usajili wa Mafunzo",
      choisirFormation: "Chagua mafunzo",
      confirmerInscription: "Thibitisha Usajili",
      
      // Messages de succès - Swahili
      rendezVousPris: "✅ Rendezvous limechukuliwa! Tutawasiliana nawe hivi karibuni.",
      inscriptionReussie: "✅ Usajili umefanikiwa! Tutakutumia maelezo kwa barua pepe."
    },
    es: {
      accueil: "Inicio",
      mission: "Misión",
      programme: "Programa",
      soutien: "Apoyo Psicológico",
      formations: "Formación",
      dons: "Donaciones",
      contact: "Contacto",
      titre: "IMIZA TUMAINI",
      sousTitre: "Familias Militares Congoleñas",
      description: "Apoyo, Formación y Comunidad para nuestros Héroes y sus Familias",
      soutenirFamilles: "💝 Apoyar a Nuestras Familias",
      voirFormations: "📚 Ver Formación",
      notreMission: "Nuestra Misión",
      vision: "Visión",
      visionText: "Convertirnos en la referencia nacional en el apoyo a familias militares, creando una comunidad fuerte, resiliente y autónoma.",
      missionPrincipale: "Misión Principal",
      missionText: "Proporcionar apoyo completo y adaptado a las familias militares congoleñas a través de servicios psicológicos, formación profesional y acompañamiento personalizado.",
      nosObjectifs: "Nuestros Objetivos",
      objectifsIntro: "Nos comprometemos a alcanzar objetivos medibles para mejorar concretamente la vida de las familias militares.",
      nosProgrammes: "Nuestros Programas",
      soutienPsychologique: "Apoyo Psicológico",
      nosFormations: "Nuestras Formaciones",
      soutenezNosFamilles: "Apoye a Nuestras Familias",
      contactezNous: "Contáctenos",
      aPropos: "Acerca de",
      services: "Servicios",
      contactFooter: "Contacto",
      copyright: "© 2025 Imiza tumaini. Todos los derechos reservados.",
      
      // Soutien Psychologique - Espagnol
      bienEtreMental: "Su Bienestar Mental es Nuestra Prioridad",
      bienEtreMentalText: "Ofrecemos apoyo psicológico completo y confidencial a las familias militares que enfrentan los desafíos únicos de la vida militar.",
      therapieIndividuelleTitle: "👥 Terapia Individual",
      therapieIndividuelleDesc: "Sesiones individuales confidenciales con psicólogos especializados en traumas militares.",
      prendreRendezVous: "Tomar Cita",
      therapieFamilialeTitle: "👨‍👩‍👧‍👦 Terapia Familiar",
      therapieFamilialeDesc: "Terapia familiar para fortalecer lazos y mejorar la comunicación dentro de la familia.",
      groupesSoutienTitle: "👥 Grupos de Apoyo",
      groupesSoutienDesc: "Grupos de discusión y apoyo entre familias militares para compartir experiencias y soluciones.",
      rejoindreGroupe: "Unirse a un Grupo",
      soutienUrgenceTitle: "📞 Apoyo de Emergencia",
      soutienUrgenceDesc: "Línea de escucha 24/7 para situaciones de crisis y apoyo inmediato.",
      appelerMaintenant: "Llamar Ahora",
      notreEquipeSpecialistes: "Nuestro Equipo de Especialistas",
      drJeanMukendi: "Dr. Jean Mukendi",
      drJeanMukendiText: "Psicólogo clínico - 15 años de experiencia",
      drMarieNtumba: "Dra. Marie Ntumba",
      drMarieNtumbaText: "Terapeuta familiar - 12 años de experiencia",
      drPierreKabongo: "Dr. Pierre Kabongo",
      drPierreKabongoText: "Psiquiatra - 20 años de experiencia",
      
      // Formations - Espagnol
      sInscrire: "Inscribirse",
      propositionsCommunaute: "💡 Propuestas de la Comunidad",
      proposerFormation: "Proponer formación",
      annuler: "Cancelar",
      proposerNouvelleFormation: "Proponer nueva formación",
      titreFormation: "Título de la formación",
      votreNom: "Su nombre",
      descriptionFormation: "Descripción de la formación",
      soumettreProposition: "Enviar propuesta",
      par: "Por",
      votes: "votos",
      dejaVote: "Ya votado",
      voter: "Votar",
      
      // Modal rendez-vous - Espagnol
      prendreRendezVousTitle: "Tomar una Cita",
      nomComplet: "Nombre completo",
      telephone: "Teléfono",
      email: "Email",
      choisirService: "Elegir servicio",
      choisirDate: "Elegir fecha",
      choisirHeure: "Elegir hora",
      messageOptionnel: "Mensaje (opcional)",
      confirmerRendezVous: "Confirmar Cita",
      fermer: "Cerrar",
      
      // Modal inscription - Espagnol
      inscriptionFormation: "Inscripción a Formación",
      choisirFormation: "Elegir formación",
      confirmerInscription: "Confirmar Inscripción",
      
      // Messages de succès - Espagnol
      rendezVousPris: "✅ ¡Cita tomada con éxito! Nos pondremos en contacto con usted pronto.",
      inscriptionReussie: "✅ ¡Inscripción exitosa! Le enviaremos los detalles por email."
    },
    ru: {
      accueil: "Главная",
      mission: "Миссия",
      programme: "Программа",
      soutien: "Психологическая поддержка",
      formations: "Обучение",
      dons: "Пожертвования",
      contact: "Контакт",
      titre: "IMIZA TUMAINI",
      sousTitre: "Конголезские Военные Семьи",
      description: "Поддержка, Обучение и Сообщество для наших Героев и их Семей",
      soutenirFamilles: "💝 Поддержать Наши Семьи",
      voirFormations: "📚 Смотреть Обучение",
      notreMission: "Наша Миссия",
      vision: "Видение",
      visionText: "Стать национальным эталоном в поддержке военных семей, создавая сильное, устойчивое и автономное сообщество.",
      missionPrincipale: "Основная Миссия",
      missionText: "Предоставлять полную и адаптированную поддержку конголезским военным семьям через психологические услуги, профессиональное обучение и персонализированное сопровождение.",
      nosObjectifs: "Наши Цели",
      objectifsIntro: "Мы обязуемся достичь измеримых целей для конкретного улучшения жизни военных семей.",
      nosProgrammes: "Наши Программы",
      soutienPsychologique: "Психологическая Поддержка",
      nosFormations: "Наше Обучение",
      soutenezNosFamilles: "Поддержите Наши Семьи",
      contactezNous: "Свяжитесь с нами",
      aPropos: "О нас",
      services: "Услуги",
      contactFooter: "Контакт",
      copyright: "© 2025 Imiza tumaini. Все права защищены.",
      
      // Soutien Psychologique - Russe
      bienEtreMental: "Ваше Психическое Здоровье - Наш Приоритет",
      bienEtreMentalText: "Мы предлагаем полную и конфиденциальную психологическую поддержку военным семьям, сталкивающимся с уникальными вызовами военной жизни.",
      therapieIndividuelleTitle: "👥 Индивидуальная Терапия",
      therapieIndividuelleDesc: "Конфиденциальные индивидуальные сессии с психологами, специализирующимися на военных травмах.",
      prendreRendezVous: "Записаться на Прием",
      therapieFamilialeTitle: "👨‍👩‍👧‍👦 Семейная Терапия",
      therapieFamilialeDesc: "Семейная терапия для укрепления связей и улучшения коммуникации внутри семьи.",
      groupesSoutienTitle: "👥 Группы Поддержки",
      groupesSoutienDesc: "Группы обсуждения и поддержки между военными семьями для обмена опытом и решениями.",
      rejoindreGroupe: "Присоединиться к Группе",
      soutienUrgenceTitle: "📞 Экстренная Поддержка",
      soutienUrgenceDesc: "Круглосуточная линия прослушивания для кризисных ситуаций и немедленной поддержки.",
      appelerMaintenant: "Позвонить Сейчас",
      notreEquipeSpecialistes: "Наша Команда Специалистов",
      drJeanMukendi: "Д-р Жан Мукенди",
      drJeanMukendiText: "Клинический психолог - 15 лет опыта",
      drMarieNtumba: "Д-р Мари Нтумба",
      drMarieNtumbaText: "Семейный терапевт - 12 лет опыта",
      drPierreKabongo: "Д-р Пьер Кабонго",
      drPierreKabongoText: "Психиатр - 20 лет опыта",
      
      // Formations - Russe
      sInscrire: "Записаться",
      propositionsCommunaute: "💡 Предложения Сообщества",
      proposerFormation: "Предложить обучение",
      annuler: "Отмена",
      proposerNouvelleFormation: "Предложить новое обучение",
      titreFormation: "Название обучения",
      votreNom: "Ваше имя",
      descriptionFormation: "Описание обучения",
      soumettreProposition: "Отправить предложение",
      par: "От",
      votes: "голосов",
      dejaVote: "Уже проголосовал",
      voter: "Голосовать",
      
      // Modal rendez-vous - Russe
      prendreRendezVousTitle: "Записаться на Прием",
      nomComplet: "Полное имя",
      telephone: "Телефон",
      email: "Email",
      choisirService: "Выбрать услугу",
      choisirDate: "Выбрать дату",
      choisirHeure: "Выбрать время",
      messageOptionnel: "Сообщение (необязательно)",
      confirmerRendezVous: "Подтвердить Прием",
      fermer: "Закрыть",
      
      // Modal inscription - Russe
      inscriptionFormation: "Запись на Обучение",
      choisirFormation: "Выбрать обучение",
      confirmerInscription: "Подтвердить Запись",
      
      // Messages de succès - Russe
      rendezVousPris: "✅ Прием успешно записан! Мы свяжемся с вами в ближайшее время.",
      inscriptionReussie: "✅ Запись успешна! Мы отправим вам детали по email."
    },
    zh: {
      accueil: "首页",
      mission: "使命",
      programme: "项目",
      soutien: "心理支持",
      formations: "培训",
      dons: "捐赠",
      contact: "联系",
      titre: "IMIZA TUMAINI",
      sousTitre: "刚果军人家庭",
      description: "为我们的英雄及其家庭提供支持、培训和社区服务",
      soutenirFamilles: "💝 支持我们的家庭",
      voirFormations: "📚 查看培训",
      notreMission: "我们的使命",
      vision: "愿景",
      visionText: "成为支持军人家庭的全国标杆，创建一个强大、有韧性和自主的社区。",
      missionPrincipale: "主要使命",
      missionText: "通过心理服务、专业培训和个性化支持，为刚果军人家庭提供完整和适应的支持。",
      nosObjectifs: "我们的目标",
      objectifsIntro: "我们承诺实现可衡量的目标，以具体改善军人家庭的生活。",
      nosProgrammes: "我们的项目",
      soutienPsychologique: "心理支持",
      nosFormations: "我们的培训",
      soutenezNosFamilles: "支持我们的家庭",
      contactezNous: "联系我们",
      aPropos: "关于我们",
      services: "服务",
      contactFooter: "联系",
      copyright: "© 2025 Imiza tumaini. 版权所有。",
      
      // Soutien Psychologique - Chinois
      bienEtreMental: "您的心理健康是我们的优先事项",
      bienEtreMentalText: "我们为面临军事生活独特挑战的军人家庭提供完整和保密的心理支持。",
      therapieIndividuelleTitle: "👥 个人治疗",
      therapieIndividuelleDesc: "与专门研究军事创伤的心理学家进行保密的个人会话。",
      prendreRendezVous: "预约",
      therapieFamilialeTitle: "👨‍👩‍👧‍👦 家庭治疗",
      therapieFamilialeDesc: "家庭治疗以加强联系并改善家庭内的沟通。",
      groupesSoutienTitle: "👥 支持小组",
      groupesSoutienDesc: "军人家庭之间的讨论和支持小组，分享经验和解决方案。",
      rejoindreGroupe: "加入小组",
      soutienUrgenceTitle: "📞 紧急支持",
      soutienUrgenceDesc: "24/7倾听热线，为危机情况和即时支持。",
      appelerMaintenant: "立即致电",
      notreEquipeSpecialistes: "我们的专家团队",
      drJeanMukendi: "让·穆肯迪博士",
      drJeanMukendiText: "临床心理学家 - 15年经验",
      drMarieNtumba: "玛丽·恩图姆巴博士",
      drMarieNtumbaText: "家庭治疗师 - 12年经验",
      drPierreKabongo: "皮埃尔·卡邦戈博士",
      drPierreKabongoText: "精神科医生 - 20年经验",
      
      // Formations - Chinois
      sInscrire: "注册",
      propositionsCommunaute: "💡 社区提案",
      proposerFormation: "提议培训",
      annuler: "取消",
      proposerNouvelleFormation: "提议新培训",
      titreFormation: "培训标题",
      votreNom: "您的姓名",
      descriptionFormation: "培训描述",
      soumettreProposition: "提交提案",
      par: "由",
      votes: "票",
      dejaVote: "已投票",
      voter: "投票",
      
      // Modal rendez-vous - Chinois
      prendreRendezVousTitle: "预约",
      nomComplet: "全名",
      telephone: "电话",
      email: "电子邮件",
      choisirService: "选择服务",
      choisirDate: "选择日期",
      choisirHeure: "选择时间",
      messageOptionnel: "消息（可选）",
      confirmerRendezVous: "确认预约",
      fermer: "关闭",
      
      // Modal inscription - Chinois
      inscriptionFormation: "培训注册",
      choisirFormation: "选择培训",
      confirmerInscription: "确认注册",
      
      // Messages de succès - Chinois
      rendezVousPris: "✅ 预约成功！我们将尽快与您联系。",
      inscriptionReussie: "✅ 注册成功！我们将通过电子邮件向您发送详细信息。"
    }
  }
  
  const t = translations[currentLang]
  
  useEffect(() => {
    // Security initialization
    const initializeSecurity = () => {
      // Prevent right click
      if (SECURITY_CONFIG.preventRightClick) {
        document.addEventListener('contextmenu', (e) => {
          e.preventDefault()
          return false
        })
      }
      
      // Prevent save shortcuts
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
          e.preventDefault()
          alert('🚫 SAUVEGARDE NON AUTORISÉE')
          return false
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
          e.preventDefault()
          return false
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
          e.preventDefault()
          return false
        }
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
          e.preventDefault()
          alert(' OUTILS DÉVELOPPEUR NON AUTORISÉS')
          return false
        }
      })
      
      // Detect dev tools
      if (SECURITY_CONFIG.preventDevTools) {
        const devtools = {
          open: false,
          orientation: null
        }
        
        const threshold = 160
        setInterval(() => {
          if (window.outerHeight - window.innerHeight > threshold || 
              window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
              devtools.open = true
              alert(' OUTILS DÉVELOPPEUR DÉTECTÉS - Redirection...')
              window.location.reload()
            }
          } else {
            devtools.open = false
          }
        }, 500)
      }
      
      // Start tampering detection (disabled for normal operation)
      // const tamperCheck = detectTampering()
      
      // Initialize session timer
      resetSessionTimer()
      
      // Activity monitoring
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
      activityEvents.forEach(event => {
        document.addEventListener(event, resetSessionTimer)
      })
      
      return () => {
        // clearInterval(tamperCheck)
        clearTimeout(sessionTimer)
      }
    }
    
    const cleanup = initializeSecurity()
    
    // Gallery interval - ajusté pour 14 images avec 4 secondes d'affichage
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % 14), 4000)
    
    // Theme management
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
      document.body.classList.remove('dark-mode')
    }
    
    return () => {
      clearInterval(interval)
      cleanup?.()
    }
  }, [isDarkMode])
  
  const essentialTrainings = [
    {id:1,title:"Gestion du Stress et Trauma",description:"Apprenez à gérer le stress post-traumatique",duration:"6 semaines",level:"Débutant",icon:"🧠"},
    {id:2,title:"Communication Familiale",description:"Techniques de communication au sein de la famille",duration:"4 semaines",level:"Intermédiaire",icon:"💬"},
    {id:3,title:"Éducation des Enfants",description:"Méthodes d'éducation positives et efficaces",duration:"8 semaines",level:"Tous niveaux",icon:"👨‍👩‍👧‍👦"},
    {id:4,title:"Gestion Budgétaire",description:"Planification financière pour les familles",duration:"5 semaines",level:"Débutant",icon:"💰"},
    {id:5,title:"Premiers Secours",description:"Gestes de premiers secours essentiels",duration:"3 semaines",level:"Débutant",icon:"🏥"},
    {id:6,title:"Droit Familial",description:"Droits et obligations familiaux en RDC",duration:"6 semaines",level:"Intermédiaire",icon:"⚖️"}
  ]
  
  // API functions
  const createOrUpdateUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      return await response.json()
    } catch (error) {
      console.error('Erreur utilisateur:', error)
      // Mode fallback pour développement
      return {
        id: Date.now().toString(),
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        createdAt: new Date().toISOString()
      }
    }
  }
  
  const processDonation = async (userId, amount, paymentMethod, phone) => {
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, paymentMethod, phone })
      })
      return await response.json()
    } catch (error) {
      console.error('Erreur don:', error)
      // Mode fallback pour développement
      return {
        success: true,
        donation: {
          id: Date.now().toString(),
          userId,
          userName: donorInfo.name,
          userPhone: donorInfo.phone,
          amount: parseInt(amount),
          paymentMethod,
          phone,
          status: 'pending',
          date: new Date().toISOString(),
          reference: `DON${Date.now()}`,
          transactionId: `TXN_${Date.now()}`,
          paymentUrl: null,
          instructions: `Composez *126# pour confirmer le paiement de ${amount}$`,
          fallbackMode: true
        },
        paymentInfo: {
          transactionId: `TXN_${Date.now()}`,
          paymentUrl: null,
          instructions: `Mode test: Aucun vrai débit ne sera effectué`,
          fallback_mode: true
        }
      }
    }
  }
  
  const handleDonate = async () => {
    if (!donorInfo.name || !donorInfo.phone || !donorInfo.email) {
      alert('Veuillez remplir tous les champs obligatoires (nom, téléphone, email)')
      return
    }
    
    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(donorInfo.email)) {
      alert('Veuillez entrer une adresse email valide')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Créer ou mettre à jour l'utilisateur
      const user = await createOrUpdateUser(donorInfo)
      if (!user) {
        throw new Error('Erreur lors de la création de l\'utilisateur')
      }
      
      // Afficher les instructions de paiement
      const paymentInfo = paymentMethods.find(m => m.id === selectedPaymentMethod)
      const confirmed = window.confirm(
        `Initialisation du paiement mobile money:\n\n` +
        `Nom: ${donorInfo.name}\n` +
        `Téléphone: ${donorInfo.phone}\n` +
        `Montant: ${donationAmount} $\n` +
        `Opérateur: ${paymentInfo.name}\n\n` +
        `Cliquez sur OK pour initialiser le paiement. Vous recevrez une notification sur votre téléphone.`
      )
      
      if (!confirmed) {
        setIsProcessing(false)
        return
      }
      
      // Traiter le don avec l'API mobile money
      const result = await processDonation(
        user.id,
        parseInt(donationAmount),
        selectedPaymentMethod,
        donorInfo.phone
      )
      
      if (result && result.success) {
        let message = `✅ Paiement initialisé avec succès!\n\n` +
                      `Référence: ${result.donation.reference}\n` +
                      `Transaction ID: ${result.paymentInfo.transactionId}\n\n`
        
        // Instructions spécifiques selon la méthode
        if (result.paymentInfo.paymentUrl) {
          message += `Veuillez cliquer sur le lien de paiement:\n${result.paymentInfo.paymentUrl}\n\n`
        }
        
        if (result.paymentInfo.instructions) {
          message += `Instructions: ${result.paymentInfo.instructions}\n\n`
        }
        
        message += `Statut: En attente de confirmation mobile...\n\n` +
                   `Le don apparaîtra dans votre historique personnel dès que le paiement sera confirmé.` +
                   `\n\n🎁 Un accès personnel à votre historique de dons sera automatiquement disponible !`
        
        alert(message)
        
        // Réinitialiser le formulaire
        setDonorInfo({ name: '', phone: '', email: '' })
        setDonationAmount('25')
        
        // Rafraîchir les données du dashboard
        await fetchAllDonations()
        
        // Rediriger automatiquement vers le dashboard utilisateur après un don réussi
        setTimeout(() => {
          setShowDashboard(true)
          setIsAdmin(false)
          alert('🎊 Merci pour votre don ! Votre espace personnel est maintenant accessible.\n\nVous pouvez consulter votre historique de dons à tout moment depuis la section "Dons".')
        }, 2000)
        
        // Rediriger vers l'URL de paiement si disponible
        if (result.paymentInfo.paymentUrl) {
          window.open(result.paymentInfo.paymentUrl, '_blank')
        }
        
      } else {
        throw new Error(result?.error || 'Erreur lors de l\'initialisation du paiement')
      }
      
    } catch (error) {
      alert('❌ Erreur lors du traitement du don: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Dashboard functions
  const fetchAllDonations = async () => {
    try {
      const response = await fetch('/api/donations')
      const donations = await response.json()
      setAllDonations(donations)
      
      // Filter donations for current user
      if (donorInfo.phone) {
        const userDonations = donations.filter(d => d.userPhone === donorInfo.phone)
        setUserDonations(userDonations)
      }
    } catch (error) {
      console.error('Erreur récupération dons:', error)
      // Mode fallback pour développement - utiliser les données existantes
      if (donorInfo.phone) {
        // Simuler quelques dons de test pour l'utilisateur
        const testDonations = [
          {
            id: '1',
            userId: 'test',
            userName: donorInfo.name || 'Test User',
            userPhone: donorInfo.phone,
            amount: 25,
            paymentMethod: 'orange',
            phone: donorInfo.phone,
            status: 'completed',
            date: new Date(Date.now() - 86400000).toISOString(), // Hier
            reference: 'DON_TEST_001',
            transactionId: 'TXN_TEST_001',
            fallbackMode: true
          }
        ]
        setUserDonations(testDonations)
        setAllDonations(testDonations)
      }
    }
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    if (loginForm.username === adminCredentials.username && loginForm.password === adminCredentials.password) {
      setIsAdmin(true)
      setShowDashboard(true)
      setLoginForm({ username: '', password: '' })
      fetchAllDonations()
    } else {
      alert('Identifiants incorrects')
      setLoginAttempts(loginAttempts + 1)
      if (loginAttempts >= 2) {
        alert('Trop de tentatives. Veuillez réessayer plus tard.')
      }
    }
  }

  const handleDashboardLogout = () => {
    setIsAdmin(false)
    setShowDashboard(false)
    setActiveSection('donation')
  }

  const handleUserDashboard = async () => {
    // Si l'utilisateur a déjà fait des dons avec ce téléphone, les récupérer
    if (donorInfo.phone) {
      await fetchAllDonations()
      setShowDashboard(true)
      setIsAdmin(false)
    } else if (userDonations.length > 0) {
      setShowDashboard(true)
      setIsAdmin(false)
    } else {
      alert('📱 Veuillez entrer votre numéro de téléphone pour accéder à votre historique de dons\n\nOu faites un nouveau don pour créer votre espace personnel.')
    }
  }
  
  const handleVote = (proposalId) => {
    if (!userVotes.includes(proposalId)) {
      const proposals = decryptData(communityProposals)
      if (proposals) {
        const updatedProposals = proposals.map(proposal => 
          proposal.id === proposalId ? { ...proposal, votes: proposal.votes + 1 } : proposal
        )
        setCommunityProposals(encryptData(updatedProposals))
        setUserVotes([...userVotes, proposalId])
      }
    }
  }
  
  const handleNewProposal = (e) => {
    e.preventDefault()
    if (newProposal.title && newProposal.author) {
      const proposals = decryptData(communityProposals) || []
      const proposal = {
        id: Date.now(),
        title: newProposal.title,
        author: newProposal.author,
        description: newProposal.description,
        votes: 0,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        ip: 'protected'
      }
      const updatedProposals = [proposal, ...proposals]
      setCommunityProposals(encryptData(updatedProposals))
      setNewProposal({title:'', author:'', description:''})
      setShowProposalForm(false)
      alert('✅ Proposition soumise avec succès et sécurisée!')
      resetSessionTimer()
    }
  }
  
  // Gestionnaires pour les rendez-vous
  const handleAppointmentClick = (service) => {
    setSelectedService(service)
    setAppointmentForm({...appointmentForm, service})
    setShowAppointmentModal(true)
  }
  
  const handleAppointmentSubmit = (e) => {
    e.preventDefault()
    if (appointmentForm.name && appointmentForm.phone && appointmentForm.email && appointmentForm.service && appointmentForm.date && appointmentForm.time) {
      alert(t.rendezVousPris)
      setShowAppointmentModal(false)
      setAppointmentForm({
        name: '',
        phone: '',
        email: '',
        service: '',
        date: '',
        time: '',
        message: ''
      })
      resetSessionTimer()
    } else {
      alert('Veuillez remplir tous les champs obligatoires')
    }
  }
  
  // Gestionnaires pour les inscriptions
  const handleRegistrationClick = (training) => {
    setSelectedTraining(training)
    setRegistrationForm({...registrationForm, training: training.title})
    setShowRegistrationModal(true)
  }
  
  const handleRegistrationSubmit = (e) => {
    e.preventDefault()
    if (registrationForm.name && registrationForm.phone && registrationForm.email && registrationForm.training) {
      alert(t.inscriptionReussie)
      setShowRegistrationModal(false)
      setRegistrationForm({
        name: '',
        phone: '',
        email: '',
        training: '',
        message: ''
      })
      resetSessionTimer()
    } else {
      alert('Veuillez remplir tous les champs obligatoires')
    }
  }
  
  // Fonction pour ouvrir le modal de rendez-vous sans pré-sélection
  const handleOpenAppointmentModal = () => {
    setAppointmentForm({
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      message: ''
    })
    setShowAppointmentModal(true)
  }
  
  // Fonction pour ouvrir le modal d'inscription sans pré-sélection
  const handleOpenRegistrationModal = () => {
    setRegistrationForm({
      name: '',
      phone: '',
      email: '',
      training: '',
      message: ''
    })
    setShowRegistrationModal(true)
  }
  
  const gallerySlides = [
    {img: imgEnfants, text:"👶👧 Nos Enfants - Notre Avenir"},
    {img: img1, text:"🇨🇩 Enfants de Nos Héros - L'Avenir"},
    {img: img2, text:"👦👧 Fiers Enfants de Militaires"},
    {img: img3, text:"📚 Éducation - Notre Priorité"},
    {img: img4, text:"🎓 Formation des Jeunes Générations"},
    {img: img5, text:"🛡️ Protection et Soutien Familial"},
    {img: img6, text:"🌟 Espoir et Résilience"},
    {img: img7, text:"🕊️ Paix pour Nos Enfants"},
    {img: img8, text:"🏥 Soin et Bien-être Familial"},
    {img: img9, text:"🎯 Engagement et Dévouement"},
    {img: img10, text:"🌈 Avenir Radieux"},
    {img: img11, text:"💪 Force et Courage"},
    {img: img12, text:"🤝 Solidarité Familiale"},
    {img: img13, text:"⭐ Excellence et Pride"}
  ]
  
  const paymentMethods = [
    {id:'orange',name:'Orange Money',phone:'+243 815 123 456',icon:'🟠'},
    {id:'mpesa',name:'MPesa',phone:'+243 975 123 456',icon:'🟢'},
    {id:'airtel',name:'Airtel Money',phone:'+243 970 123 456',icon:'🔵'},
    {id:'bank',name:'Virement Bancaire',phone:'RAWBANK RDC00123456789',icon:'🏦'}
  ]
  
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/IMIZATUMAINILOGO.png" alt="Imiza Tumaini" className="logo-image" />
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <button onClick={() => setActiveSection('home')}>{t.accueil}</button>
            <button onClick={() => setActiveSection('mission')}>{t.mission}</button>
            <button onClick={() => setActiveSection('program')}>{t.programme}</button>
            <button onClick={() => setActiveSection('support')}>{t.soutien}</button>
            <button onClick={() => setActiveSection('training')}>{t.formations}</button>
            <button onClick={() => setActiveSection('donation')}>{t.dons}</button>
            <button onClick={() => setActiveSection('contact')}>{t.contact}</button>
            <button 
              className="theme-toggle-nav" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </nav>
        </div>
      </header>
      
      {/* Language Selector Dropdown */}
      <div className="language-dropdown">
        <button 
          className="language-toggle" 
          onClick={() => setIsLangOpen(!isLangOpen)}
        >
          🌐 {currentLang.toUpperCase()}
          <span className={`arrow ${isLangOpen ? 'open' : ''}`}>▼</span>
        </button>
        {isLangOpen && (
          <div className="language-menu">
            <button className="lang-option" onClick={() => {setCurrentLang('fr'); setIsLangOpen(false)}}>🇫🇷 Français</button>
            <button className="lang-option" onClick={() => {setCurrentLang('ln'); setIsLangOpen(false)}}>🇨🇩 Lingala</button>
            <button className="lang-option" onClick={() => {setCurrentLang('en'); setIsLangOpen(false)}}>🇬🇧 English</button>
            <button className="lang-option" onClick={() => {setCurrentLang('sw'); setIsLangOpen(false)}}>🇰🇪 Swahili</button>
            <button className="lang-option" onClick={() => {setCurrentLang('es'); setIsLangOpen(false)}}>🇪🇸 Español</button>
            <button className="lang-option" onClick={() => {setCurrentLang('ru'); setIsLangOpen(false)}}>🇷🇺 Русский</button>
            <button className="lang-option" onClick={() => {setCurrentLang('zh'); setIsLangOpen(false)}}>🇨🇳 中文</button>
          </div>
        )}
      </div>

      <main className="main">
        {activeSection === 'home' && (
          <section className="section">
            <div className="hero">
              <div className="hero-content">
                <h1>{t.titre}</h1>
                <h2>{t.sousTitre}</h2>
                <p>{t.description}</p>
                <div className="hero-buttons">
                  <button className="btn-primary" onClick={() => setActiveSection('donation')}>{t.soutenirFamilles}</button>
                  <button className="btn-secondary" onClick={() => setActiveSection('training')}>{t.voirFormations}</button>
                </div>
              </div>
              <div className="hero-image">
                <div className="military-gallery">
                  {gallerySlides.map((slide, index) => (
                    <div key={index} className={`gallery-slide ${currentSlide === index ? 'active' : ''}`}>
                      <img 
                        src={slide.img} 
                        alt={`Slide ${index + 1}`} 
                        onError={(e) => {
                          console.error(`Erreur de chargement de l'image ${index + 1}:`, slide.img)
                          e.target.style.display = 'none'
                        }}
                        onLoad={() => {
                          console.log(`Image ${index + 1} chargée avec succès`)
                        }}
                      />
                      <div className="slide-overlay"><span>{slide.text}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="statistics">
              <div className="stats-grid">
                <div className="stat-card"><h3>5000+</h3><p>Familles Soutenues</p></div>
                <div className="stat-card"><h3>50+</h3><p>Formations Disponibles</p></div>
                <div className="stat-card"><h3>100+</h3><p>Experts Bénévoles</p></div>
                <div className="stat-card"><h3>15+</h3><p>Années d'Expérience</p></div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'mission' && (
          <section className="section">
            <h1>{t.notreMission}</h1>
            <div className="mission-content">
              <div className="mission-card">
                <h2>🎯 {t.vision}</h2>
                <p>{t.visionText}</p>
              </div>
              <div className="mission-card">
                <h2>🛡️ {t.missionPrincipale}</h2>
                <p>{t.missionText}</p>
              </div>
              
              <div className="mission-objectives">
                <h2>🎯 {t.nosObjectifs}</h2>
                <p className="objectives-intro">{t.objectifsIntro}</p>
                
                <div className="objectives-grid">
                  <div className="objective-item">
                    <div className="objective-icon">👨‍👩‍👧‍👦</div>
                    <h3>Soutenir 10 000 Familles</h3>
                    <p>D'ici 2025, nous visons à fournir un soutien complet à 10 000 familles militaires à travers la RDC.</p>
                    <div className="objective-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '50%'}}></div>
                      </div>
                      <span className="progress-text">5 000 / 10 000</span>
                    </div>
                  </div>
                  
                  <div className="objective-item">
                    <div className="objective-icon">🎓</div>
                    <h3>100 Formations par An</h3>
                    <p>Organiser 100 sessions de formation professionnelle et psychologique chaque année pour autonomiser les familles.</p>
                    <div className="objective-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '75%'}}></div>
                      </div>
                      <span className="progress-text">75 / 100</span>
                    </div>
                  </div>
                  
                  <div className="objective-item">
                    <div className="objective-icon">💼</div>
                    <h3>Créer 500 Emplois</h3>
                    <p>Générer 500 opportunités d'emploi pour les membres des familles militaires à travers nos programmes de développement économique.</p>
                    <div className="objective-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '30%'}}></div>
                      </div>
                      <span className="progress-text">150 / 500</span>
                    </div>
                  </div>
                  
                  <div className="objective-item">
                    <div className="objective-icon">🏥</div>
                    <h3>Couverture Santé Complète</h3>
                    <p>Assurer un accès complet aux soins de santé pour toutes les familles militaires d'ici 2026.</p>
                    <div className="objective-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '60%'}}></div>
                      </div>
                      <span className="progress-text">6 000 / 10 000</span>
                    </div>
                  </div>
                  
                  <div className="objective-item">
                    <div className="objective-icon">🏠</div>
                    <h3>Logement Décent</h3>
                    <p>Fournir des solutions de logement décent à 2 000 familles militaires dans le besoin d'ici 2025.</p>
                    <div className="objective-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '45%'}}></div>
                      </div>
                      <span className="progress-text">900 / 2 000</span>
                    </div>
                  </div>
                  
                  <div className="objective-item">
                    <div className="objective-icon">🌍</div>
                    <h3>Présence Nationale</h3>
                    <p>Étendre nos services à toutes les provinces de la RDC avec au moins un centre dans chaque région militaire.</p>
                    <div className="objective-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '40%'}}></div>
                      </div>
                      <span className="progress-text">10 / 26</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="nos-valeurs-section">
                <h2>💚 Nos Valeurs Fondamentales</h2>
                <p className="valeurs-intro">Nos valeurs guident chaque action et décision, assurant que nous servons nos familles militaires avec intégrité, compassion et excellence.</p>
                
                <div className="values-grid-expanded">
                  <div className="value-item-expanded">
                    <div className="value-header">
                      <span className="value-icon">🤝</span>
                      <h3>Solidarité</h3>
                    </div>
                    <div className="value-content">
                      <p>Nous sommes là les uns pour les autres, créant un réseau de soutien inébranlable où chaque famille militaire trouve aide et réconfort.</p>
                      <ul>
                        <li>Soutien mutuel entre familles</li>
                        <li>Partage d'expériences et solutions</li>
                        <li>Entraide dans les moments difficiles</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="value-item-expanded">
                    <div className="value-header">
                      <span className="value-icon">🛡️</span>
                      <h3>Protection</h3>
                    </div>
                    <div className="value-content">
                      <p>Protéger et soutenir nos familles en garantissant leur sécurité, leur bien-être et leur dignité face aux défis de la vie militaire.</p>
                      <ul>
                        <li>Sécurité physique et émotionnelle</li>
                        <li>Défense des droits familiaux</li>
                        <li>Environnement sécurisant</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="value-item-expanded">
                    <div className="value-header">
                      <span className="value-icon">📚</span>
                      <h3>Éducation</h3>
                    </div>
                    <div className="value-content">
                      <p>Former pour autonomiser, en fournissant les connaissances et compétences nécessaires pour l'indépendance et la réussite.</p>
                      <ul>
                        <li>Accès à l'éducation de qualité</li>
                        <li>Formation professionnelle continue</li>
                        <li>Développement des compétences</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="value-item-expanded">
                    <div className="value-header">
                      <span className="value-icon">🌍</span>
                      <h3>Paix</h3>
                    </div>
                    <div className="value-content">
                      <p>Construire un avenir pacifique pour nos enfants en promouvant la réconciliation, l'harmonie et la compréhension mutuelle.</p>
                      <ul>
                        <li>Médiation familiale</li>
                        <li>Éducation à la paix</li>
                        <li>Construction de ponts communautaires</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="value-item-expanded">
                    <div className="value-header">
                      <span className="value-icon">🏆</span>
                      <h3>Excellence</h3>
                    </div>
                    <div className="value-content">
                      <p>Poursuivre l'excellence dans tous nos services, en maintenant les plus hauts standards de qualité et de professionnalisme.</p>
                      <ul>
                        <li>Services de qualité supérieure</li>
                        <li>Formation continue du personnel</li>
                        <li>Amélioration continue</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="value-item-expanded">
                    <div className="value-header">
                      <span className="value-icon">💪</span>
                      <h3>Résilience</h3>
                    </div>
                    <div className="value-content">
                      <p>Développer la force intérieure et la capacité à rebondir face aux adversités, transformant les défis en opportunités de croissance.</p>
                      <ul>
                        <li>Renforcement psychologique</li>
                        <li>Soutien dans les transitions</li>
                        <li>Cultivation de l'endurance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'program' && (
          <section className="section">
            <h1>{t.nosProgrammes}</h1>
            <div className="programs-grid">
              <div className="program-card">
                <div className="program-icon">🧠</div>
                <h3>{t.santeMentale}</h3>
                <p>{t.santeMentaleText}</p>
                <ul>
                  <li>{t.therapieIndividuelle}</li>
                  <li>{t.conseilFamilial}</li>
                  <li>{t.groupesSoutien}</li>
                </ul>
              </div>
              <div className="program-card">
                <div className="program-icon">🎓</div>
                <h3>{t.educationProg}</h3>
                <p>{t.educationProgText}</p>
                <ul>
                  <li>{t.soutienScolaire}</li>
                  <li>{t.orientationProfessionnelle}</li>
                  <li>{t.boursesEtudes}</li>
                </ul>
              </div>
              <div className="program-card">
                <div className="program-icon">💼</div>
                <h3>{t.developpementEconomique}</h3>
                <p>{t.developpementEconomiqueText}</p>
                <ul>
                  <li>{t.formationsTechniques}</li>
                  <li>{t.microCredit}</li>
                  <li>{t.accompagnementEntrepreneurial}</li>
                </ul>
              </div>
              <div className="program-card">
                <div className="program-icon">🏥</div>
                <h3>{t.santeBienEtre}</h3>
                <p>{t.santeBienEtreText}</p>
                <ul>
                  <li>{t.consultationsMedicales}</li>
                  <li>{t.campagnesVaccination}</li>
                  <li>{t.programmesNutritionnels}</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'support' && (
          <section className="section">
            <h1>{t.soutienPsychologique}</h1>
            <div className="support-content">
              <div className="support-intro">
                <h2>🧠 {t.bienEtreMental}</h2>
                <p>{t.bienEtreMentalText}</p>
              </div>
              
              <div className="support-services">
                <div className="support-service">
                  <h3>{t.therapieIndividuelleTitle}</h3>
                  <p>{t.therapieIndividuelleDesc}</p>
                  <button className="btn-primary" onClick={() => handleAppointmentClick(t.therapieIndividuelleTitle)}>{t.prendreRendezVous}</button>
                </div>
                
                <div className="support-service">
                  <h3>{t.therapieFamilialeTitle}</h3>
                  <p>{t.therapieFamilialeDesc}</p>
                  <button className="btn-primary" onClick={() => handleAppointmentClick(t.therapieFamilialeTitle)}>{t.prendreRendezVous}</button>
                </div>
                
                <div className="support-service">
                  <h3>{t.groupesSoutienTitle}</h3>
                  <p>{t.groupesSoutienDesc}</p>
                  <button className="btn-primary" onClick={() => handleAppointmentClick(t.groupesSoutienTitle)}>{t.rejoindreGroupe}</button>
                </div>
                
                <div className="support-service">
                  <h3>{t.soutienUrgenceTitle}</h3>
                  <p>{t.soutienUrgenceDesc}</p>
                  <button className="btn-primary" onClick={() => alert('📞 Numéro d\'urgence: +243 900 000 000\n\nDisponible 24/7 pour les situations d\'urgence.')}>{t.appelerMaintenant}</button>
                </div>
              </div>
              
              <div className="support-actions">
                <div className="action-card">
                  <h3>🗓️ Prendre un Rendez-vous</h3>
                  <p>Choisissez parmi tous nos services psychologiques disponibles</p>
                  <button className="btn-primary" onClick={handleOpenAppointmentModal}>{t.prendreRendezVous}</button>
                </div>
              </div>
              
              <div className="support-team">
                <h2>🏥 {t.notreEquipeSpecialistes}</h2>
                <div className="team-grid">
                  <div className="team-member">
                    <div className="member-avatar">👨‍⚕️</div>
                    <h4>{t.drJeanMukendi}</h4>
                    <p>{t.drJeanMukendiText}</p>
                  </div>
                  <div className="team-member">
                    <div className="member-avatar">👩‍⚕️</div>
                    <h4>{t.drMarieNtumba}</h4>
                    <p>{t.drMarieNtumbaText}</p>
                  </div>
                  <div className="team-member">
                    <div className="member-avatar">👨‍⚕️</div>
                    <h4>{t.drPierreKabongo}</h4>
                    <p>{t.drPierreKabongoText}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'training' && (
          <section className="section">
            <h1>{t.nosFormations}</h1>
            <div className="trainings-grid">
              {essentialTrainings.map(training => (
                <div key={training.id} className="training-card">
                  <div className="training-icon">{training.icon}</div>
                  <h3>{training.title}</h3>
                  <p>{training.description}</p>
                  <div className="training-meta">
                    <span className="duration">{training.duration}</span>
                    <span className="level">{training.level}</span>
                  </div>
                  <button className="btn-primary" onClick={() => handleRegistrationClick(training)}>{t.sInscrire}</button>
                </div>
              ))}
            </div>
            
            <div className="training-actions">
              <div className="action-card">
                <h3>📚 S'inscrire à une Formation</h3>
                <p>Choisissez parmi toutes nos formations disponibles</p>
                <button className="btn-primary" onClick={handleOpenRegistrationModal}>{t.sInscrire}</button>
              </div>
            </div>
            
            <div className="community-proposals">
              <div className="proposals-header">
                <h2>💡 {t.propositionsCommunaute}</h2>
                <button className="btn-secondary" onClick={() => setShowProposalForm(!showProposalForm)}>
                  {showProposalForm ? t.annuler : t.proposerFormation}
                </button>
              </div>
              
              {showProposalForm && (
                <div className="proposal-form">
                  <h3>{t.proposerNouvelleFormation}</h3>
                  <form onSubmit={handleNewProposal}>
                    <div className="form-group">
                      <input type="text" placeholder={t.titreFormation} value={newProposal.title} onChange={(e) => setNewProposal({...newProposal, title: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder={t.votreNom} value={newProposal.author} onChange={(e) => setNewProposal({...newProposal, author: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <textarea placeholder={t.descriptionFormation} value={newProposal.description} onChange={(e) => setNewProposal({...newProposal, description: e.target.value})} rows="3" required />
                    </div>
                    <button type="submit" className="btn-primary">{t.soumettreProposition}</button>
                  </form>
                </div>
              )}
              
              <div className="proposals-grid">
                {decryptData(communityProposals)?.map(proposal => (
                  <div key={proposal.id} className="proposal-card">
                    <h3>{proposal.title}</h3>
                    <p className="proposal-author">{t.par} {proposal.author} • {proposal.date}</p>
                    {proposal.description && <p className="proposal-description">{proposal.description}</p>}
                    <div className="proposal-stats">
                      <span className="votes">👍 {proposal.votes} {t.votes}</span>
                      <button 
                        className={`vote-btn ${userVotes.includes(proposal.id) ? 'voted' : ''}`}
                        onClick={() => handleVote(proposal.id)}
                        disabled={userVotes.includes(proposal.id)}
                      >
                        {userVotes.includes(proposal.id) ? t.dejaVote : t.voter}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'donation' && (
          <section className="section">
            {showDashboard ? (
              <Dashboard 
                isAdmin={isAdmin}
                allDonations={allDonations}
                userDonations={userDonations}
                onLogout={handleDashboardLogout}
              />
            ) : (
              <>
                <h1>{t.soutenezNosFamilles}</h1>
                
                {/* Conteneur principal en deux colonnes */}
                <div className="donation-two-column-layout">
                  
                  {/* Colonne de gauche - Formulaire de don */}
                  <div className="donation-left-column">
                    <div className="donation-container">
                      <div className="donation-form">
                        <h2>{t.faireDon}</h2>
                        
                        {/* Vérifier si l'utilisateur a déjà fait des dons */}
                        {userDonations.length > 0 && (
                          <div className="existing-donor-welcome">
                            <div className="welcome-message">
                              <h3>👋 Bon retour {userDonations[0].userName} !</h3>
                              <p>Vous avez déjà fait {userDonations.length} don(s) pour un total de {userDonations.reduce((sum, d) => sum + d.amount, 0)} $</p>
                              <button className="btn-secondary" onClick={handleUserDashboard}>
                                📊 Voir mon historique complet
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Formulaire d'informations du donateur */}
                        <div className="donor-info">
                          <h3>Informations du Donateur</h3>
                          <div className="form-group">
                            <input 
                              type="text" 
                              placeholder="Votre nom complet *" 
                              value={donorInfo.name}
                              onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <input 
                              type="tel" 
                              placeholder="Votre numéro de téléphone *" 
                              value={donorInfo.phone}
                              onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <input 
                              type="email" 
                              placeholder="Votre adresse email *" 
                              value={donorInfo.email}
                              onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                              required 
                            />
                          </div>
                          <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '10px'}}>
                            📧 L'email est obligatoire pour recevoir la confirmation de votre don
                          </p>
                        </div>
                        
                        {/* Sélection du montant */}
                        <h3>Montant du Don</h3>
                        <div className="amount-options">
                          {['10','25','50','100','500'].map(amount => (
                            <button key={amount} className={`amount-btn ${donationAmount === amount ? 'active' : ''}`} onClick={() => setDonationAmount(amount)}>
                              {amount}$
                            </button>
                          ))}
                        </div>
                        <input 
                          type="number" 
                          placeholder={t.montantPersonnalise} 
                          value={donationAmount} 
                          onChange={(e) => setDonationAmount(e.target.value)} 
                        />
                        
                        {/* Méthodes de paiement */}
                        <h3>Méthode de Paiement</h3>
                        <div className="payment-methods">
                          {paymentMethods.map(method => (
                            <label key={method.id} className={`payment-option ${selectedPaymentMethod === method.id ? 'selected' : ''}`}>
                              <input type="radio" name="payment" value={method.id} checked={selectedPaymentMethod === method.id} onChange={(e) => setSelectedPaymentMethod(e.target.value)} />
                              <div className="payment-info">
                                <div className="payment-logo">{method.icon}</div>
                                <div>
                                  <strong>{method.name}</strong>
                                  <span>{method.phone}</span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        
                        <button 
                          className="btn-primary" 
                          onClick={handleDonate}
                          disabled={isProcessing || !donorInfo.name || !donorInfo.phone || !donorInfo.email}
                        >
                          {isProcessing ? 'Traitement en cours...' : t.envoyerDon}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Colonne de droite - Autres interfaces */}
                  <div className="donation-right-column">
                    
                    {/* Accès rapide utilisateur */}
                    <div className="quick-access-section">
                      <div className="quick-access-card">
                        <h3>📊 Mon Espace Personnel</h3>
                        <p>Accédez à l'historique de vos dons</p>
                        <div className="phone-access">
                          <input 
                            type="tel" 
                            placeholder="Votre numéro de téléphone" 
                            value={donorInfo.phone}
                            onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                          />
                          <button className="btn-secondary" onClick={handleUserDashboard}>
                            👁️ Voir mes dons
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Admin Login Section */}
                    <div className="admin-login-section">
                      <div className="admin-login-card">
                        <h3>🔐 Accès Administration</h3>
                        <form onSubmit={handleAdminLogin}>
                          <div className="form-group">
                            <input 
                              type="text" 
                              placeholder="Nom d'utilisateur" 
                              value={loginForm.username}
                              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <input 
                              type="password" 
                              placeholder="Mot de passe" 
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                              required 
                            />
                          </div>
                          <button type="submit" className="btn-primary">
                            🚪 Se connecter
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* User Dashboard Access */}
                    {userDonations.length > 0 && (
                      <div className="user-dashboard-access">
                        <h3>📊 Mon Historique</h3>
                        <p>Total de vos dons: {userDonations.reduce((sum, d) => sum + d.amount, 0)} $</p>
                        <button className="btn-secondary" onClick={handleUserDashboard}>
                          👁️ Voir mon historique
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="section">
            <h1>{t.contactezNous}</h1>
            <div className="contact-container">
              <div className="contact-form">
                <h2>{t.envoyezMessage}</h2>
                <form>
                  <div className="form-group"><input type="text" placeholder={t.votreNomComplet} required /></div>
                  <div className="form-group"><input type="email" placeholder={t.votreEmail} required /></div>
                  <div className="form-group"><input type="tel" placeholder={t.votreTelephone} /></div>
                  <div className="form-group">
                    <select required>
                      <option value="">Sélectionnez le type de demande</option>
                      <option value="psychological">Soutien psychologique</option>
                      <option value="training">Information sur les formations</option>
                      <option value="donation">Questions sur les dons</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div className="form-group"><textarea placeholder="Votre message" rows="5" required></textarea></div>
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
                        <p>Commune de GOMA? Avenue ALINDI, Goma<br/>République Démocratique du Congo</p>
                      </div>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-icon">📞</span>
                      <div className="contact-text">
                        <strong>Téléphone</strong>
                        <p>+243 992 503 701 (Principal)<br/>+243 992 503 701 (Urgence)</p>
                      </div>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-icon">📧</span>
                      <div className="contact-text">
                        <strong>Email</strong>
                        <p>info@imizatumainikwamwanajeshi.cd<br/>support@famillesmilitaires.cd</p>
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
            <h3>{t.aPropos}</h3>
            <p>Nous soutenons les familles militaires congolaises à travers des services psychologiques, des formations et une communauté solidaire.</p>
          </div>
          <div className="footer-section">
            <h3>{t.services}</h3>
            <ul><li>Soutien Psychologique</li><li>Formations</li><li>Communauté</li><li>Dons</li></ul>
          </div>
          <div className="footer-section">
            <h3>{t.contactFooter}</h3>
            <p>📍 Goma, RDC<br/>📞 +243 992 503 701<br/>📧 info@imizatumainikwamwanajeshi.cd</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.copyright}</p>
        </div>
      </footer>
      
      {/* Modal de prise de rendez-vous */}
      {showAppointmentModal && (
        <div className="modal-overlay" onClick={() => setShowAppointmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t.prendreRendezVousTitle}</h2>
              <button className="modal-close" onClick={() => setShowAppointmentModal(false)}>×</button>
            </div>
            <form onSubmit={handleAppointmentSubmit} className="modal-form">
              <div className="form-group">
                <label>{t.nomComplet} *</label>
                <input 
                  type="text" 
                  value={appointmentForm.name}
                  onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.telephone} *</label>
                <input 
                  type="tel" 
                  value={appointmentForm.phone}
                  onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.email} *</label>
                <input 
                  type="email" 
                  value={appointmentForm.email}
                  onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.choisirService} *</label>
                <select 
                  value={appointmentForm.service}
                  onChange={(e) => setAppointmentForm({...appointmentForm, service: e.target.value})}
                  required 
                >
                  <option value="">{t.choisirService}</option>
                  <option value="Thérapie Individuelle">{t.therapieIndividuelleTitle}</option>
                  <option value="Thérapie Familiale">{t.therapieFamilialeTitle}</option>
                  <option value="Groupes de Soutien">{t.groupesSoutienTitle}</option>
                  <option value="Soutien d'Urgence">{t.soutienUrgenceTitle}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t.choisirDate} *</label>
                <input 
                  type="date" 
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.choisirHeure} *</label>
                <select 
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  required 
                >
                  <option value="">Choisir une heure</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t.messageOptionnel}</label>
                <textarea 
                  value={appointmentForm.message}
                  onChange={(e) => setAppointmentForm({...appointmentForm, message: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAppointmentModal(false)}>{t.fermer}</button>
                <button type="submit" className="btn-primary">{t.confirmerRendezVous}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal d'inscription aux formations */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t.inscriptionFormation}</h2>
              <button className="modal-close" onClick={() => setShowRegistrationModal(false)}>×</button>
            </div>
            <form onSubmit={handleRegistrationSubmit} className="modal-form">
              <div className="form-group">
                <label>{t.nomComplet} *</label>
                <input 
                  type="text" 
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.telephone} *</label>
                <input 
                  type="tel" 
                  value={registrationForm.phone}
                  onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.email} *</label>
                <input 
                  type="email" 
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t.choisirFormation} *</label>
                <select 
                  value={registrationForm.training}
                  onChange={(e) => setRegistrationForm({...registrationForm, training: e.target.value})}
                  required 
                >
                  <option value="">{t.choisirFormation}</option>
                  {essentialTrainings.map(training => (
                    <option key={training.id} value={training.title}>
                      {training.icon} {training.title} ({training.duration})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t.messageOptionnel}</label>
                <textarea 
                  value={registrationForm.message}
                  onChange={(e) => setRegistrationForm({...registrationForm, message: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowRegistrationModal(false)}>{t.fermer}</button>
                <button type="submit" className="btn-primary">{t.confirmerInscription}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
