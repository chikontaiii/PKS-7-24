import { db } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ========== УПРАВЛЕНИЕ СТУДЕНТАМИ ==========
// Загрузка списка студентов в выпадающий список #warn-student
async function loadStudentsToSelect() {
    const studentSelect = document.getElementById('warn-student');
    if (!studentSelect) return;

    const snapshot = await getDocs(collection(db, "students"));
    studentSelect.innerHTML = '<option value="">-- Выберите студента --</option>';
    snapshot.forEach(doc => {
        const student = doc.data().name;
        const option = document.createElement('option');
        option.value = student;
        option.textContent = student;
        studentSelect.appendChild(option);
    });
}

// Отображение списка студентов в карточке управления
async function displayStudentList() {
    const container = document.getElementById('student-list');
    if (!container) return;

    const snapshot = await getDocs(collection(db, "students"));
    container.innerHTML = '';
    snapshot.forEach(docSnap => {
        const student = docSnap.data().name;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '0.5rem 0';
        div.style.borderBottom = '1px solid #F0F0F0';
        div.innerHTML = `
            <span>${student}</span>
            <button class="btn btn-outline" style="padding: 0.2rem 0.6rem; width: auto;" onclick="deleteStudent('${docSnap.id}')">Удалить</button>
        `;
        container.appendChild(div);
    });
}

// Добавление нового студента
window.addStudent = async function() {
    const nameInput = document.getElementById('new-student-name');
    const name = nameInput.value.trim();
    if (!name) {
        alert('Введите имя студента');
        return;
    }
    try {
        await addDoc(collection(db, "students"), { name });
        alert('Студент добавлен');
        nameInput.value = '';
        loadStudentsToSelect(); // обновляем выпадающий список
        displayStudentList(); // обновляем список
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// Удаление студента
window.deleteStudent = async function(studentId) {
    if (!confirm('Удалить студента?')) return;
    try {
        await deleteDoc(doc(db, "students", studentId));
        loadStudentsToSelect();
        displayStudentList();
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// ========== ДОМАШНЕЕ ЗАДАНИЕ ==========
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
        document.getElementById('hw-subject').value = '';
        document.getElementById('hw-task').value = '';
        document.getElementById('hw-deadline').value = '';
        document.getElementById('hw-responsible').value = '';
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// ========== ПРЕДУПРЕЖДЕНИЯ ==========
window.addWarning = async function() {
    const studentSelect = document.getElementById('warn-student');
    const student = studentSelect.value;
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
        // Очищаем только поле предупреждения, студент остаётся выбранным (опционально)
        document.getElementById('warn-text').value = '';
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};

// ========== ЗАГРУЗКА ФАЙЛОВ (прокси) ==========
const PROXY_URL = 'https://pks-upload-proxy-qear.vercel.app/api/upload';

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
    progressDiv.textContent = 'Загрузка на сервер...';

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('displayName', displayName);
    formData.append('type', type);
    formData.append('file', file);

    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `Ошибка сервера: ${response.status}`);
        }
        await addDoc(collection(db, "materials"), {
            subject: subject,
            name: displayName,
            fileUrl: result.fileUrl,
            fileName: file.name,
            type: type,
            createdAt: new Date().toISOString()
        });
        progressDiv.style.display = 'none';
        alert('✅ Материал успешно загружен!');
        document.getElementById('material-name').value = '';
        document.getElementById('material-file').value = '';
    } catch (error) {
        console.error(error);
        progressDiv.style.display = 'none';
        alert('Ошибка: ' + error.message);
    }
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========
// Загружаем список студентов при старте
loadStudentsToSelect();
displayStudentList();