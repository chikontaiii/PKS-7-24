// students.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const tbody = document.getElementById('homework-body');

async function loadHomework() {
    const snapshot = await getDocs(collection(db, "homework"));
    tbody.innerHTML = ''; // очистим, если были тестовые строки
    snapshot.forEach(doc => {
        const hw = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="homework-subject">${hw.subject}</td>
            <td>${hw.task}</td>
            <td class="homework-deadline ${hw.deadline < new Date().toISOString().split('T')[0] ? 'urgent' : ''}">${hw.deadline}</td>
            <td><span class="homework-responsible">${hw.responsible || '—'}</span></td>
            <td>${hw.status || '⏳'}</td>
        `;
        tbody.appendChild(row);
    });
}

loadHomework();