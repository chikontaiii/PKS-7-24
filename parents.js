// parents.js
import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const warningsList = document.getElementById('warnings-list');

async function loadWarnings() {
    const q = query(collection(db, "warnings"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    // Создаём список ul с классом warnings-compact
    const ul = document.createElement('ul');
    ul.className = 'warnings-compact';

    if (snapshot.empty) {
        ul.innerHTML = '<li style="justify-content: center; opacity: 0.7;">Нет предупреждений</li>';
    } else {
        snapshot.forEach(doc => {
            const w = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="warning-student">${w.student}</span>
                <span class="warning-text">${w.warning}</span>
            `;
            ul.appendChild(li);
        });
    }

    // Очищаем контейнер и вставляем новый список
    warningsList.innerHTML = '';
    warningsList.appendChild(ul);
}

loadWarnings();