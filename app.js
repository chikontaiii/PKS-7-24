// 1. Импорты Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 2. Ключи Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDNrR5Mxd9xG3C5354EF96r7CKWZme9FXM",
    authDomain: "pks-7-24-portal.firebaseapp.com",
    projectId: "pks-7-24-portal",
    storageBucket: "pks-7-24-portal.firebasestorage.app",
    messagingSenderId: "657797301237",
    appId: "1:657797301237:web:9be5433f4444b3896d56bc"
};

// 3. Инициализация Firebase
console.log("Firebase инициализация...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log("Firebase готов:", auth);

// 4. Элементы интерфейса
const loginScreen = document.getElementById('login-screen');
const appContent = document.getElementById('app-content');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// 5. Проверяем, что нашли все элементы
console.log("Элементы:", {
    loginScreen: !!loginScreen,
    appContent: !!appContent,
    emailInput: !!emailInput,
    passwordInput: !!passwordInput,
    loginBtn: !!loginBtn,
    loginError: !!loginError
});

// 6. Функция ВХОДА
if (loginBtn) {
    console.log("Кнопка входа найдена, добавляем обработчик");

    // Удаляем старые обработчики, чтобы не было дублирования
    loginBtn.replaceWith(loginBtn.cloneNode(true));

    // Получаем новую ссылку на кнопку
    const newLoginBtn = document.getElementById('login-btn');

    newLoginBtn.addEventListener('click', async function(e) {
        e.preventDefault(); // Предотвращаем любые стандартные действия
        console.log("Клик по кнопке входа!");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        console.log("Email:", email);
        console.log("Пароль:", password ? "введен" : "пустой");

        loginError.style.display = 'none';
        newLoginBtn.textContent = 'Вход...';
        newLoginBtn.disabled = true; // Блокируем кнопку

        try {
            console.log("Пытаемся войти...");
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Успешный вход!", userCredential.user.email);

            // Не скрываем логин здесь - это сделает onAuthStateChanged
        } catch (error) {
            console.error("Ошибка входа:", error);

            loginError.style.display = 'block';

            // Понятное сообщение об ошибке
            if (error.code === 'auth/user-not-found') {
                loginError.textContent = 'Пользователь не найден';
            } else if (error.code === 'auth/wrong-password') {
                loginError.textContent = 'Неверный пароль';
            } else if (error.code === 'auth/invalid-email') {
                loginError.textContent = 'Неверный формат email';
            } else if (error.code === 'auth/too-many-requests') {
                loginError.textContent = 'Слишком много попыток, попробуйте позже';
            } else {
                loginError.textContent = 'Ошибка входа: ' + error.message;
            }

            newLoginBtn.textContent = 'Войти';
            newLoginBtn.disabled = false;
        }
    });
}

// 7. Слушатель состояния авторизации
onAuthStateChanged(auth, async(user) => {
    console.log("Состояние авторизации изменилось:", user ? user.email : "нет пользователя");

    if (user) {
        // Человек вошел!
        console.log("Пользователь авторизован:", user.email);
        if (loginScreen) loginScreen.classList.remove('active');
        if (appContent) appContent.classList.add('active');
    } else {
        // Человек не вошел
        console.log("Пользователь не авторизован");
        if (loginScreen) loginScreen.classList.add('active');
        if (appContent) appContent.classList.remove('active');
    }
});

// 8. Функция выхода (добавьте кнопку выхода позже)
window.logout = function() {
    signOut(auth).then(() => {
        console.log("Выход выполнен");
    }).catch((error) => {
        console.error("Ошибка выхода:", error);
    });
};