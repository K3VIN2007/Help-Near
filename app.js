// ══════════════════════════════════════════════
//  HelpNear — app.js
//  Firebase v9 (compat mode) + utilidades
// ══════════════════════════════════════════════

// ── CONFIGURACIÓN FIREBASE ──────────────────
// 🔧 Reemplaza estos valores con los de tu proyecto en Firebase Console
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

// ── GUARD: redirige si no hay sesión ─────────
function requireAuth(redirectTo = 'login.html') {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = redirectTo;
      } else {
        resolve(user);
      }
    });
  });
}

// ── GUARD: redirige si ya hay sesión ─────────
function redirectIfLoggedIn(to = 'home.html') {
  auth.onAuthStateChanged(user => {
    if (user) window.location.href = to;
  });
}

// ── Obtener datos del usuario desde Firestore ─
async function getUserData(uid) {
  const snap = await db.collection('usuarios').doc(uid).get();
  return snap.exists ? snap.data() : null;
}

// ── Mostrar alerta en pantalla ────────────────
function showAlert(containerId, message, type = 'error') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type} show`;
  setTimeout(() => el.classList.remove('show'), 5000);
}

// ── Iniciales para avatar ─────────────────────
function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

// ── Formatear fecha ────────────────────────────
function formatDate(timestamp) {
  if (!timestamp) return '';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Icono por categoría ────────────────────────
const CATEGORY_ICONS = {
  'Comida':        '🍽️',
  'Ropa':          '👕',
  'Educación':     '📚',
  'Medicamentos':  '💊',
  'Otro':          '🔧'
};
