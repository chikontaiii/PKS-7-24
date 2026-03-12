// parents.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const warningsList = document.getElementById('warnings-list');

async function loadWarnings() {
    const snapshot = await getDocs(collection(db, "warnings"));
    warningsList.innerHTML = '';
    snapshot.forEach(doc => {
        const w = doc.data();
        const card = document.createElement('div');
        card.className = 'parent-card'; // используем тот же стиль, что и другие карточки
        card.innerHTML = `
            <h4>${w.student}</h4>
            <p>${w.warning}</p>
            <div class="parent-contact">
                <span>📅 ${new Date(w.date || Date.now()).toLocaleDateString('ru-RU')}</span>
            </div>
        `;
        warningsList.appendChild(card);
    });
}

loadWarnings();