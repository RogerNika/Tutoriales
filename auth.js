import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const regForm = document.getElementById('registerForm');
const logForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');

// Registro
regForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value.trim();
  const displayName = document.getElementById('regDisplayName').value.trim();

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);

    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      displayName: displayName || "",
      createdAt: Date.now()
    });

    loginStatus.textContent = "Usuario registrado. Redirigiendo...";
    setTimeout(() => (window.location.href = 'bienvenida.html'), 600);
  } catch (err) {
    loginStatus.textContent = "Error en registro: " + err.message;
  }
});

// Login
logForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('logEmail').value.trim();
  const pass = document.getElementById('logPass').value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    loginStatus.textContent = "Ingreso correcto. Redirigiendo...";
    setTimeout(() => (window.location.href = 'bienvenida.html'), 600);
  } catch (err) {
    loginStatus.textContent = "Error de inicio de sesión: " + err.message;
  }
});

// Logout
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      alert('No se pudo cerrar sesión. Intenta de nuevo.');
    }
  });
});
