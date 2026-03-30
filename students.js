// students.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

async function loadHomework() {
    const tbody = document.getElementById('homework-body');

    // 🔥 защита от ошибки (если элемента нет)
    if (!tbody) {
        console.warn("homework-body не найден — пропускаем загрузку ДЗ");
        return;
    }

    try {
        const snapshot = await getDocs(collection(db, "homework"));

        tbody.innerHTML = ''; // очистка

        snapshot.forEach(doc => {
            const hw = doc.data();

            const deadlineClass =
                hw.deadline &&
                hw.deadline < new Date().toISOString().split('T')[0] ?
                'urgent' :
                '';

            const row = document.createElement('tr');

            row.innerHTML = `
                <td data-label="Предмет" class="homework-subject">${hw.subject || ''}</td>
                <td data-label="Задание">${hw.task || ''}</td>
                <td data-label="Дедлайн" class="homework-deadline ${deadlineClass}">
                    ${hw.deadline || ''}
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Ошибка загрузки ДЗ:", error);
    }
}

// запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    loadHomework();
});