// warnings-stats.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const listContainer = document.getElementById('warnings-stats-list');
const footerContainer = document.getElementById('warnings-stats-footer');

async function loadWarningsStats() {
    const snapshot = await getDocs(collection(db, "warnings"));
    const warnings = snapshot.docs.map(doc => doc.data());

    // Группируем по студенту и считаем количество
    const studentWarnings = {};
    warnings.forEach(w => {
        const student = w.student;
        if (!studentWarnings[student]) studentWarnings[student] = 0;
        studentWarnings[student]++;
    });

    // Преобразуем в массив для сортировки (по количеству предупреждений, по алфавиту)
    const studentsArray = Object.entries(studentWarnings).map(([student, count]) => ({ student, count }));
    studentsArray.sort((a, b) => b.count - a.count || a.student.localeCompare(b.student));

    // Формируем список
    listContainer.innerHTML = '';
    studentsArray.forEach(({ student, count }) => {
        const warningItem = document.createElement('div');
        warningItem.className = 'warning-item';
        warningItem.innerHTML = `
            <span class="warning-student">${student}</span>
            <div class="warning-count">
                <span class="warning-badge ${count >= 2 ? '' : 'low'}">${count}</span>
                <span class="warning-level">${count >= 2 ? 'Испытательный срок' : 'Предупреждение'}</span>
            </div>
        `;
        listContainer.appendChild(warningItem);
    });

    // Общая статистика
    const totalWarnings = warnings.length;
    const probationCount = studentsArray.filter(s => s.count >= 2).length;
    footerContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
            <span>Всего предупреждений: ${totalWarnings}</span>
            <span style="color: #A51C30;">${probationCount} на испытательном сроке</span>
        </div>
    `;
}

loadWarningsStats();