// schedule.js – автоматическое расписание с учётом числителя/знаменателя

// ===== НАСТРОЙКИ =====
// Стартовая дата семестра (первая неделя – числитель)
const SEMESTER_START = new Date(2026, 2, 16); // 1 сентября 2026 (месяцы: 0-11, поэтому 8 = сентябрь)

// ===== РАСПИСАНИЕ ЗВОНКОВ (для отображения в интерфейсе) =====
const bellSchedule = [
    { pair: 0, start: "08:35", end: "09:55", break: 5 },
    { pair: 1, start: "10:00", end: "11:20", break: 5 },
    { pair: 2, start: "11:25", end: "12:45", break: 20 },
    { pair: 3, start: "13:05", end: "14:25", break: 5 },
    { pair: 4, start: "14:30", end: "15:50", break: 5 },
    { pair: 5, start: "15:55", end: "17:15", break: 5 },
    { pair: 6, start: "17:20", end: "18:40", break: 5 },
    { pair: 7, start: "18:45", end: "20:05", break: 5 }
];

// ===== РАСПИСАНИЕ ЗАНЯТИЙ (числитель) =====
// Ключи: 1 – понедельник, 2 – вторник, ... 6 – суббота, 0 – воскресенье
const numeratorSchedule = {
    1: [ // Понедельник (числитель)
        { subject: "КГ 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "КГ 1пд / ТСИ 2пд", time: "15:55 - 17:15", room: "Ауд. 302 / Ауд. 305" },
        { subject: "ТА 1пд", time: "17:20 - 18:40", room: "Лаб. 302" },
        { subject: "КГ 1пд", time: "18:45 - 20:05", room: "Ауд. 302" }
    ],
    2: [ // Вторник (числитель)
        { subject: "ТСИ 1пд", time: "8:35 - 9:55", room: "Ауд. 305" },
        { subject: "ТСИ", time: "10:00 - 11:20", room: "Ауд. 305" },
        { subject: "Физ.воспитание", time: "11:25 - 12:45", room: "Ауд. 02" },
        { subject: "БЖД", time: "13:05 - 14:25", room: "Ауд. 106" },
        { subject: "ТА 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
    ],
    3: [ // Среда (числитель)
        { subject: "Кыргызский язык", time: "13:05 - 14:25", room: "Ауд. 304" },
        { subject: "История Кыргызстана", time: "14:30 - 15:50", room: "Ауд. 208" },
    ],
    4: [ // Четверг (числитель)
        { subject: "КГ", time: "11:25 - 12:45", room: "Ауд. 302" },
        { subject: "География", time: "13:05 - 14:25", room: "Ауд. 206" },
        { subject: "ТА", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "ТА 1пд", time: "15:55 - 17:15", room: "Ауд. 302" }
    ],
    5: [ // Пятница (числитель)
        { subject: "История Кыргызстана", time: "10:00 - 11:20", room: "Ауд. 208" },
        { subject: "Кыргызский язык", time: "11:25 - 12:45", room: "Ауд. 304" },
        { subject: "Английский язык", time: "13:05 - 14:25", room: "Ауд. 214 / Ауд. 216" },
    ],
    6: [ // Суббота – выходной
        { subject: "Выходной", time: "", room: "" }
    ],
    0: [ // Воскресенье – выходной
        { subject: "Выходной", time: "", room: "" }
    ]
};

// ===== РАСПИСАНИЕ ЗАНЯТИЙ (знаменатель) =====
// Заполните по аналогии с вашим расписанием на знаменатель
const denominatorSchedule = {
    1: [ // Понедельник (числитель)
        { subject: "КГ 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "КГ 1пд / ТСИ 2пд", time: "15:55 - 17:15", room: "Ауд. 302 / Ауд. 305" },
        { subject: "ТА 2пд", time: "17:20 - 18:40", room: "Лаб. 302" },
        { subject: "КГ 2пд", time: "18:45 - 20:05", room: "Ауд. 302" }
    ],
    2: [ // Вторник (числитель)
        { subject: "ТСИ 1пд", time: "8:35 - 9:55", room: "Ауд. 305" },
        { subject: "ТСИ", time: "10:00 - 11:20", room: "Ауд. 305" },
        { subject: "Физ.воспитание", time: "11:25 - 12:45", room: "Ауд. 02" },
        { subject: "БЖД", time: "13:05 - 14:25", room: "Ауд. 106" },
        { subject: "ТА 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
    ],
    3: [ // Среда (числитель)
        { subject: "Кыргызский язык", time: "13:05 - 14:25", room: "Ауд. 304" },
        { subject: "История Кыргызстана", time: "14:30 - 15:50", room: "Ауд. 208" },
    ],
    4: [ // Четверг (числитель)
        { subject: "ТСИ", time: "10:00 - 11:20", room: "Ауд. 305" },
        { subject: "КГ", time: "11:25 - 12:45", room: "Ауд. 302" },
        { subject: "География", time: "13:05 - 14:25", room: "Ауд. 206" },
        { subject: "ТА", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "ТА 1пд", time: "15:55 - 17:15", room: "Ауд. 302" }
    ],
    5: [ // Пятница (числитель)
        { subject: "История Кыргызстана", time: "10:00 - 11:20", room: "Ауд. 208" },
        { subject: "Кыргызский язык", time: "11:25 - 12:45", room: "Ауд. 304" },
        { subject: "Английский язык", time: "13:05 - 14:25", room: "Ауд. 214 / Ауд. 216" },
    ],
    6: [ // Суббота – выходной
        { subject: "Выходной", time: "", room: "" }
    ],
    0: [ // Воскресенье – выходной
        { subject: "Выходной", time: "", room: "" }
    ]
};

// ===== ОПРЕДЕЛЕНИЕ ТИПА НЕДЕЛИ =====
function getCurrentWeekType() {
    const today = new Date();
    // Разница в миллисекундах, переводим в дни, затем в недели
    const diffTime = today - SEMESTER_START;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // Номер недели от начала (0 – первая неделя)
    const weekNumber = Math.floor(diffDays / 7);
    // Если weekNumber чётное – числитель, иначе – знаменатель
    return (weekNumber % 2 === 0) ? 'numerator' : 'denominator';
}

// ===== ЗАГРУЗКА РАСПИСАНИЯ НА СЕГОДНЯ =====
function loadTodaySchedule() {
    const weekType = getCurrentWeekType(); // 'numerator' или 'denominator'
    const schedule = weekType === 'numerator' ? numeratorSchedule : denominatorSchedule;

    const today = new Date().getDay(); // 0 = Вс, 1 = Пн, ... 6 = Сб
    const scheduleForToday = schedule[today] || schedule[0]; // если дня нет – выходной

    const container = document.getElementById('schedule-items');
    if (!container) return;

    container.innerHTML = ''; // очищаем

    // Добавляем заголовок с типом недели (по желанию)
    const weekTypeTitle = weekType === 'numerator' ? 'Числитель' : 'Знаменатель';
    const titleElem = document.createElement('h3');
    titleElem.textContent = `Текущая неделя: ${weekTypeTitle}`;
    container.appendChild(titleElem);

    scheduleForToday.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <div>
                <div class="schedule-subject">${item.subject}</div>
                <div class="schedule-time">${item.time}</div>
            </div>
            <span class="schedule-room">${item.room}</span>
        `;
        container.appendChild(scheduleItem);
    });
}

// ===== ОТОБРАЖЕНИЕ РАСПИСАНИЯ ЗВОНКОВ (опционально) =====
function loadBellSchedule() {
    const container = document.getElementById('bell-schedule');
    if (!container) return;

    container.innerHTML = ''; // очищаем

    bellSchedule.forEach(item => {
        const bellItem = document.createElement('div');
        bellItem.className = 'bell-item';
        bellItem.innerHTML = `
            <div>
                <strong>${item.pair} пара:</strong> ${item.start} – ${item.end}
                <span style="margin-left: 20px;">перемена ${item.break} мин</span>
            </div>
        `;
        container.appendChild(bellItem);
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    loadTodaySchedule();
    loadBellSchedule(); // если нужен блок со звонками
});