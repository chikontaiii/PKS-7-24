import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const warningsList = document.getElementById('warnings-list');

async function loadWarnings() {
    const q = query(collection(db, "warnings"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    const ul = document.createElement('ul');
    ul.className = 'warnings-compact';

    if (snapshot.empty) {
        ul.innerHTML = '<li style="justify-content: center; opacity: 0.7;">Нет предупреждений</li>';
    } else {
        snapshot.forEach(doc => {
            const w = doc.data();
            const li = document.createElement('li');
            // Форматируем дату из формата YYYY-MM-DD в DD.MM.YYYY
            let formattedDate = w.date || '';
            if (formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [year, month, day] = formattedDate.split('-');
                formattedDate = `${day}.${month}.${year}`;
            }
            li.innerHTML = `
                <div class="warning-info">
                    <span class="warning-student">${w.student}</span>
                    <span class="warning-date">${formattedDate}</span>
                </div>
                <div class="warning-text">${w.warning}</div>
            `;
            ul.appendChild(li);
        });
    }

    warningsList.innerHTML = '';
    warningsList.appendChild(ul);
}

loadWarnings();