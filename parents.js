// parents.js
import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const warningsContainer = document.getElementById('warnings-list'); // это div внутри карточки

async function loadWarnings() {
    // Сортируем от новых к старым
    const q = query(collection(db, "warnings"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    // Создаём список ul
    const list = document.createElement('ul');
    list.className = 'warnings-compact-list'; // для стилей

    snapshot.forEach(doc => {
        const w = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="warning-student-name">${w.student}</span>
            <span class="warning-text">${w.warning}</span>
        `;
        list.appendChild(li);
    });

    // Если предупреждений нет, покажем сообщение
    if (snapshot.empty) {
        list.innerHTML = '<li style="justify-content: center; opacity:0.7;">Нет предупреждений</li>';
    }

    // Очищаем контейнер и вставляем новый список
    warningsContainer.innerHTML = '';
    warningsContainer.appendChild(list);
}

loadWarnings();