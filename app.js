// app.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Элементы интерфейса
const loginScreen = document.getElementById('login-screen');
const appContent = document.getElementById('app-content');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Функция входа
if (loginBtn) {
    loginBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        loginError.style.display = 'none';
        loginBtn.textContent = 'Вход...';
        loginBtn.disabled = true;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            loginError.style.display = 'block';
            loginError.textContent = error.message;
            loginBtn.textContent = 'Войти';
            loginBtn.disabled = false;
        }
    });
}

// Слушатель состояния
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (loginScreen) loginScreen.classList.remove('active');
        if (appContent) appContent.classList.add('active');
    } else {
        if (loginScreen) loginScreen.classList.add('active');
        if (appContent) appContent.classList.remove('active');
    }
});

// Функция выхода (можно добавить кнопку)
window.logout = () => signOut(auth);