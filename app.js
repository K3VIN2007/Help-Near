// ══════════════════════════════════════════════
//  HelpNear — app.js
//  Firebase v9 (compat mode) + utilidades
// ══════════════════════════════════════════════

// ── CONFIGURACIÓN FIREBASE ──────────────────
// 🔧 Reemplaza estos valores con los de tu proyecto en Firebase Console
  const firebaseConfig = {
    apiKey: "AIzaSyBH3U8t3gSm7WHx1YonfV9zDaISQq96g0U",
    authDomain: "helpnear-uniajc.firebaseapp.com",
    projectId: "helpnear-uniajc",
    storageBucket: "helpnear-uniajc.firebasestorage.app",
    messagingSenderId: "293067615657",
    appId: "1:293067615657:web:cab39806ce5c3c7a91a8b8",
    measurementId: "G-QXS50H73BH"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db   = firebase.firestore();

// ── GUARD: redirige si no hay sesión ─────────
function requireAuth(redirectTo = 'login.html') {
  return new Promise((resolve) => {
    // Si ya hay sesión cargada, resolvemos inmediatamente
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    // Si no, esperamos el primer cambio de estado
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe(); // solo nos interesa la primera vez
      if (user) {
        resolve(user);
      } else {
        window.location.href = redirectTo;
      }
    });

    // Fallback por si nunca se resuelve (máx. 4 segundos)
    setTimeout(() => {
      unsubscribe();
      if (auth.currentUser) {
        resolve(auth.currentUser);
      } else {
        window.location.href = redirectTo;
      }
    }, 4000);
  });
}

// ── GUARD: redirige si ya hay sesión ─────────
function redirectIfLoggedIn(to = 'home.html') {
  if (auth.currentUser) {
    window.location.href = to;
    return;
  }
  const unsubscribe = auth.onAuthStateChanged(user => {
    unsubscribe();
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
