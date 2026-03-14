import { db } from "./firebase.js";
import { auth } from "./firebase.js";
console.log('Auth state:', auth.currentUser); // если null – не аутентифицирован
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
window.addHomework = async function() {
    const subject = document.getElementById('hw-subject').value.trim();
    const task = document.getElementById('hw-task').value.trim();
    const deadline = document.getElementById('hw-deadline').value;
    const responsible = document.getElementById('hw-responsible').value.trim() || '—';

    if (!subject || !task || !deadline) {
        alert('Заполните все поля (кроме ответственного)');
        return;
    }

    try {
        await addDoc(collection(db, "homework"), {
            subject,
            task,
            deadline,
            createdAt: new Date().toISOString()
        });
        alert('Домашнее задание добавлено!');
        // Очистка формы
        document.getElementById('hw-subject').value = '';
        document.getElementById('hw-task').value = '';
        document.getElementById('hw-deadline').value = '';
        document.getElementById('hw-responsible').value = '';
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// =====================================================
//  2. ДОБАВЛЕНИЕ ПРЕДУПРЕЖДЕНИЯ (работает как раньше)
// =====================================================
window.addWarning = async function() {
    const student = document.getElementById('warn-student').value.trim();
    const warning = document.getElementById('warn-text').value.trim();

    if (!student || !warning) {
        alert('Заполните все поля');
        return;
    }

    try {
        await addDoc(collection(db, "warnings"), {
            student,
            warning,
            date: new Date().toISOString().split('T')[0]
        });
        alert('Предупреждение добавлено!');
        // Очистка формы
        document.getElementById('warn-student').value = '';
        document.getElementById('warn-text').value = '';
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// =====================================================
//  3. ЗАГРУЗКА ФАЙЛОВ (через твой ПРОВЕРЕННЫЙ прокси)
// =====================================================
// ⚡⚡⚡ ВОТ ТВОЙ РАБОЧИЙ URL (возвращает 405 - это хорошо!) ⚡⚡⚡
const PROXY_URL = 'https://pks-upload-proxy-qear.vercel.app/api/upload';

window.uploadMaterial = async function() {
    // Получаем данные из формы
    const subject = document.getElementById('material-subject').value;
    const type = document.getElementById('material-type').value;
    const displayName = document.getElementById('material-name').value.trim();
    const fileInput = document.getElementById('material-file');
    const file = fileInput.files[0];

    // Валидация
    if (!subject || !type || !displayName || !file) {
        alert('Заполните все поля и выберите файл');
        return;
    }

    // Показываем индикатор загрузки
    const progressDiv = document.getElementById('upload-progress');
    progressDiv.style.display = 'block';
    progressDiv.textContent = 'Загрузка на сервер...';

    // Собираем данные для отправки
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('displayName', displayName);
    formData.append('type', type);
    formData.append('file', file);

    try {
        // 1. Отправляем файл на твой прокси (Vercel)
        const response = await fetch(PROXY_URL, {
            method: 'POST', // Это важно! Твой прокси ждёт именно POST
            body: formData
        });

        // Получаем ответ от прокси
        const result = await response.json();

        // Если прокси вернул ошибку
        if (!response.ok) {
            throw new Error(result.error || `Ошибка сервера: ${response.status}`);
        }

        // 2. Если файл загружен на GitHub, сохраняем ссылку в Firestore
        await addDoc(collection(db, "materials"), {
            subject: subject,
            name: displayName,
            fileUrl: result.fileUrl, // Ссылка на файл в CDN
            fileName: file.name,
            type: type,
            createdAt: new Date().toISOString()
        });

        // Всё хорошо
        progressDiv.style.display = 'none';
        alert('✅ Материал успешно загружен!');

        // Очистка формы
        document.getElementById('material-name').value = '';
        document.getElementById('material-file').value = '';

    } catch (error) {
        // Всё плохо
        console.error('❌ Ошибка загрузки:', error);
        progressDiv.style.display = 'none';
        alert('Ошибка: ' + error.message);
    }
};