import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let allAbsences = [];
let allWarnings = [];
let allStudents = [];

async function loadData() {
    // Загружаем пропуски
    const qAbs = query(collection(db, "absences"), orderBy("date", "desc"));
    const snapAbs = await getDocs(qAbs);
    allAbsences = snapAbs.docs.map(doc => doc.data());

    // Загружаем предупреждения
    const qWarn = query(collection(db, "warnings"), orderBy("date", "desc"));
    const snapWarn = await getDocs(qWarn);
    allWarnings = snapWarn.docs.map(doc => doc.data());

    // Загружаем студентов
    const snapStudents = await getDocs(collection(db, "students"));
    allStudents = snapStudents.docs.map(doc => doc.data().name);
    allStudents.sort((a, b) => a.localeCompare(b, 'ru'));

    updateStats();
    renderListView(getActiveFilter());
}

function getActiveFilter() {
    const activeBtn = document.querySelector('.filters button.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

function updateStats() {
    const totalPairs = allAbsences.length;
    const totalHours = totalPairs * 2;
    document.getElementById('totalAbsences').innerText = totalPairs;
    document.getElementById('totalHours').innerText = totalHours;
    const avgHours = totalPairs > 0 ? (totalHours / totalPairs).toFixed(1) : 0;
    document.getElementById('avgHours').innerText = avgHours;
}

function filterAbsencesByPeriod(period) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    if (period === 'today') return allAbsences.filter(a => a.date === today);
    if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return allAbsences.filter(a => new Date(a.date) >= weekAgo);
    }
    if (period === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(now.getDate() - 30);
        return allAbsences.filter(a => new Date(a.date) >= monthAgo);
    }
    return allAbsences;
}

function groupByDate(absences) {
    const groups = {};
    absences.forEach(a => {
        if (!groups[a.date]) groups[a.date] = [];
        groups[a.date].push(a);
    });
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
    return sortedDates.map(date => ({ date, items: groups[date] }));
}

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}.${year}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function renderListView(filter) {
    const filtered = filterAbsencesByPeriod(filter);
    const grouped = groupByDate(filtered);
    const container = document.getElementById('listContainer');
    if (grouped.length === 0) {
        container.innerHTML = '<div class="empty-message">Нет пропусков за выбранный период</div>';
        return;
    }
    container.innerHTML = grouped.map(day => `
        <div class="absence-day">
            <div class="absence-day-header">${formatDate(day.date)}</div>
            <ul class="absence-list">
                ${day.items.map(item => `
                    <li class="absence-item">
                        <span class="student-name">${escapeHtml(item.student)}</span>
                        <div class="absence-details">
                            <span class="absence-pair">${item.pair} пара (${item.hours} ч.)</span>
                            ${item.reason ? `<span class="absence-reason">${escapeHtml(item.reason)}</span>` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// ========== ЖУРНАЛ (студенты × даты) ==========
function renderJournal() {
    // Собираем все уникальные даты из пропусков и НБ
    const allDatesSet = new Set();
    allAbsences.forEach(a => allDatesSet.add(a.date));
    allWarnings.forEach(w => allDatesSet.add(w.date));
    const allDates = Array.from(allDatesSet).sort((a,b) => new Date(a) - new Date(b));
    if (allDates.length === 0) {
        document.getElementById('journalContainer').innerHTML = '<div class="empty-message">Нет данных для отображения</div>';
        return;
    }

    // Создаём карту: студент → дата → { absence: true/false, warning: true/false, pairText: '' }
    const journalData = {};
    allStudents.forEach(student => {
        journalData[student] = {};
    });

    allAbsences.forEach(absence => {
        const student = absence.student;
        if (journalData[student]) {
            journalData[student][absence.date] = {
                ...journalData[student][absence.date],
                absence: true,
                pair: absence.pair
            };
        }
    });

    allWarnings.forEach(warning => {
        const student = warning.student;
        if (journalData[student]) {
            journalData[student][warning.date] = {
                ...journalData[student][warning.date],
                warning: true
            };
        }
    });

    // Формируем HTML таблицы
    let html = '<div class="journal-container"><table class="journal-table"><thead><tr><th class="student-col">Студент</th>';
    allDates.forEach(date => {
        html += `<th>${formatDate(date)}</th>`;
    });
    html += '</tr></thead><tbody>';

    allStudents.forEach(student => {
        html += `<tr><td class="student-col">${escapeHtml(student)}</td>`;
        allDates.forEach(date => {
            const cell = journalData[student][date] || {};
            let content = '';
            if (cell.absence) {
                content = `<span class="absence-mark">${cell.pair} п</span>`;
            }
            if (cell.warning) {
                content += (content ? '<br>' : '') + `<span class="warning-mark">НБ</span>`;
            }
            if (!content) content = '<span class="empty-mark">—</span>';
            html += `<td>${content}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    document.getElementById('journalContainer').innerHTML = html;
}

// ========== ПЕРЕКЛЮЧЕНИЕ ВИДОВ ==========
document.getElementById('listViewBtn').addEventListener('click', () => {
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('journalViewBtn').classList.remove('active');
    document.getElementById('listContainer').style.display = 'block';
    document.getElementById('journalContainer').style.display = 'none';
    renderListView(getActiveFilter());
});

document.getElementById('journalViewBtn').addEventListener('click', () => {
    document.getElementById('journalViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
    document.getElementById('listContainer').style.display = 'none';
    document.getElementById('journalContainer').style.display = 'block';
    renderJournal();
});

// Фильтры (для списка) – при смене фильтра обновляем только список
document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (document.getElementById('listViewBtn').classList.contains('active')) {
            renderListView(btn.dataset.filter);
        }
    });
});

// Инициализация
loadData();