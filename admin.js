// admin.js
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Добавление домашнего задания
window.addHomework = async function() {
    const subject = document.getElementById('hw-subject').value;
    const task = document.getElementById('hw-task').value;
    const deadline = document.getElementById('hw-deadline').value;
    const responsible = document.getElementById('hw-responsible').value;

    if (!subject || !task || !deadline) {
        alert('Заполните все поля!');
        return;
    }

    try {
        await addDoc(collection(db, "homework"), {
            subject,
            task,
            deadline,
            responsible: responsible || '—',
            status: '⏳',
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

// Добавление предупреждения
window.addWarning = async function() {
    const student = document.getElementById('warn-student').value;
    const warning = document.getElementById('warn-text').value;

    if (!student || !warning) {
        alert('Заполните все поля!');
        return;
    }

    try {
        await addDoc(collection(db, "warnings"), {
            student,
            warning,
            date: new Date().toISOString()
        });
        alert('Предупреждение добавлено!');
        document.getElementById('warn-student').value = '';
        document.getElementById('warn-text').value = '';
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};