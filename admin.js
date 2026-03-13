// admin.js
import { db } from "./firebase.js"; // storage больше не нужен, удалили
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Константы для GitHub – проверь и исправь при необходимости
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'chikontaiii'; // твой логин на GitHub
const REPO_NAME = 'pks-materials'; // название репозитория (должен быть public)
const BRANCH = 'main'; // основная ветка

// Вспомогательная функция для загрузки файла на GitHub
async function uploadToGitHub(file, subject) {
    const path = `${subject}/${Date.now()}_${file.name}`; // папка по предмету + уникальное имя

    // Читаем файл как base64
    const reader = new FileReader();
    const base64Content = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]); // отделяем data:...;base64,
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    // Отправляем запрос к GitHub API
    const response = await axios.put(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
            message: `Upload ${file.name}`,
            content: base64Content,
            branch: BRANCH
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    );

    // Возвращаем публичную ссылку через jsDelivr CDN
    return `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${BRANCH}/${path}`;
}

// Добавление домашнего задания (без изменений)
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
            responsible,
            status: '⏳',
            createdAt: new Date().toISOString()
        });
        alert('Домашнее задание добавлено!');
        document.getElementById('hw-subject').value = '';
        document.getElementById('hw-task').value = '';
        document.getElementById('hw-deadline').value = '';
        document.getElementById('hw-responsible').value = '';
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// Добавление предупреждения (без изменений)
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
        document.getElementById('warn-student').value = '';
        document.getElementById('warn-text').value = '';
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// Загрузка материала (новая версия – на GitHub, без optional chaining)
window.uploadMaterial = async function() {
    const subject = document.getElementById('material-subject').value;
    const type = document.getElementById('material-type').value;
    const displayName = document.getElementById('material-name').value.trim();
    const fileInput = document.getElementById('material-file');
    const file = fileInput.files[0];

    if (!subject || !type || !displayName || !file) {
        alert('Заполните все поля и выберите файл');
        return;
    }

    const progressDiv = document.getElementById('upload-progress');
    progressDiv.style.display = 'block';
    progressDiv.textContent = 'Загрузка на GitHub...';

    try {
        // 1. Загружаем файл на GitHub
        const fileUrl = await uploadToGitHub(file, subject);

        // 2. Сохраняем информацию в Firestore
        await addDoc(collection(db, "materials"), {
            subject,
            name: displayName,
            fileUrl,
            fileName: file.name,
            type,
            createdAt: new Date().toISOString()
        });

        progressDiv.style.display = 'none';
        alert('Материал успешно загружен!');

        // Очистка формы
        document.getElementById('material-name').value = '';
        document.getElementById('material-file').value = '';

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        progressDiv.style.display = 'none';

        // Безопасное получение сообщения об ошибке (без optional chaining)
        let errorMsg = error.message;
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        }
        alert('Ошибка: ' + errorMsg);
    }
};