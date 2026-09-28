// schedule.js – автоматическое расписание на сегодня и завтра

// ===== НАСТРОЙКИ =====
const SEMESTER_START = new Date(2026, 2, 30); // 30 марта 2026 (месяцы 0-11)

// ===== РАСПИСАНИЕ ЗВОНКОВ =====
const bellSchedule = [
    { pair: 0, start: "07:30", end: "08:50", break: 10 },
    { pair: 1, start: "9:00", end: "10:20", break: 10 },
    { pair: 2, start: "10:30", end: "11:50", break: 10 },
    { pair: 3, start: "12:00", end: "13:20", break: 20 },
    { pair: 4, start: "13:40", end: "15:00", break: 10 },
    { pair: 5, start: "15:10", end: "16:30", break: 10 },
    { pair: 6, start: "16:40", end: "18:00", break: 10 },
    { pair: 7, start: "18:10", end: "19:30", break: 10 }
];

/// ===================== ЧИСЛИТЕЛЬ =====================

const numeratorSchedule = {

    // ПОНЕДЕЛЬНИК
    1: [{
            subject: "БД 1пд / РЭиС 2пд",
            time: "07:30 - 08:50",
            room: "Ауд. 103 / Ауд. 120"
        },
        {
            subject: "Арх.ЭВМ 1пд / СП 2пд",
            time: "9:00 - 10:20",
            room: "Ауд. 103 / Ауд. 312"
        },
        {
            subject: "СП 1пд / Арх.ЭВМ 2пд",
            time: "10:30 - 11:50",
            room: "Лаб. 312 / Ауд. 103"
        },
        {
            subject: "Физвоспитание",
            time: "12:00 - 13:20",
            room: "Ауд. 111"
        },
        {
            subject: "РЭиС 1пд / БД 2пд",
            time: "13:40 - 15:00",
            room: "Ауд. 120 / Ауд. 103"
        }
    ],

    // ВТОРНИК
    2: [{
            subject: "РЭиС",
            time: "13:40 - 15:00",
            room: "Ауд. 120"
        },
        {
            subject: "БД",
            time: "15:10 - 16:30",
            room: "Ауд. 103"
        },
        {
            subject: "РЭиС 1пд",
            time: "16:40 - 18:00",
            room: "Ауд. 120"
        }
    ],

    // СРЕДА
    3: [{
            subject: "Арх.ЭВМ 1пд / WEB-ОП 2пд",
            time: "13:40 - 15:00",
            room: "Ауд. 103 / Ауд. 303"
        },
        {
            subject: "WEB-ОП 1пд / Арх.ЭВМ 2пд",
            time: "15:10 - 16:30",
            room: "Ауд. 303 / Ауд. 103"
        },
        {
            subject: "WEB-ОП КП 1",
            time: "16:40 - 18:00",
            room: "Ауд. 303"
        }
    ],

    // ЧЕТВЕРГ
    4: [{
            subject: "ООП КП 1",
            time: "10:30 - 11:50",
            room: "Ауд. ---"
        },
        {
            subject: "Экономика отрасли",
            time: "12:00 - 13:20",
            room: "Ауд. 203"
        },
        {
            subject: "ООП КП 2",
            time: "13:40 - 15:00",
            room: "Ауд. ---"
        }
    ],

    // ПЯТНИЦА
    5: [{
            subject: "Арх.ЭВМ",
            time: "9:00 - 10:20",
            room: "Ауд. ---"
        },
        {
            subject: "Предпринимательство",
            time: "10:10 - 11:50",
            room: "Ауд. 114"
        },
        {
            subject: "СП",
            time: "12:00 - 13:20",
            room: "Ауд. 312"
        },
        {
            subject: "Прав. обеспечение",
            time: "13:40 - 15:00",
            room: "Ауд. ---"
        }
    ],

    // СУББОТА
    6: [{
        subject: "День КП",
        time: "",
        room: ""
    }],

    // ВОСКРЕСЕНЬЕ
    0: [{
        subject: "Выходной",
        time: "",
        room: ""
    }]
};


// ===================== ЗНАМЕНАТЕЛЬ =====================

const denominatorSchedule = {

    // ПОНЕДЕЛЬНИК
    1: [{
            subject: "БД 1пд / РЭиС 2пд",
            time: "07:30 - 08:50",
            room: "Ауд. 103 / Ауд. 120"
        },
        {
            subject: "Арх.ЭВМ 1пд / СП 2пд",
            time: "9:00 - 10:20",
            room: "Ауд. 103 / Ауд. 312"
        },
        {
            subject: "СП 1пд / Арх.ЭВМ 2пд",
            time: "10:30 - 11:50",
            room: "Лаб. 312 / Ауд. 103"
        },
        {
            subject: "Физвоспитание",
            time: "12:00 - 13:20",
            room: "Ауд. 111"
        },
        {
            subject: "РЭиС 1пд / БД 2пд",
            time: "13:40 - 15:00",
            room: "Ауд. 120 / Ауд. 103"
        }
    ],

    // ВТОРНИК
    2: [{
            subject: "РЭиС",
            time: "13:40 - 15:00",
            room: "Ауд. 120"
        },
        {
            subject: "БД",
            time: "15:10 - 16:30",
            room: "Ауд. 103"
        },
        {
            subject: "РЭиС 1пд",
            time: "16:40 - 18:00",
            room: "Ауд. 120"
        }
    ],

    // СРЕДА
    3: [{
            subject: "Арх.ЭВМ 1пд / WEB-ОП 2пд",
            time: "13:40 - 15:00",
            room: "Ауд. 103 / Ауд. 303"
        },
        {
            subject: "WEB-ОП 1пд / Арх.ЭВМ 2пд",
            time: "15:10 - 16:30",
            room: "Ауд. 303 / Ауд. 103"
        },
        {
            subject: "WEB-ОП КП 2",
            time: "16:40 - 18:00",
            room: "Ауд. 303"
        }
    ],

    // ЧЕТВЕРГ
    4: [{
            subject: "ООП КП 1",
            time: "10:30 - 11:50",
            room: "Ауд. ---"
        },
        {
            subject: "Экономика отрасли",
            time: "12:00 - 13:20",
            room: "Ауд. 203"
        },
        {
            subject: "ООП КП 2",
            time: "13:40 - 15:00",
            room: "Ауд. ---"
        }
    ],

    // ПЯТНИЦА
    5: [{
            subject: "Арх.ЭВМ",
            time: "9:00 - 10:20",
            room: "Ауд. ---"
        },
        {
            subject: "Предпринимательство",
            time: "10:10 - 11:50",
            room: "Ауд. 114"
        },
        {
            subject: "СП",
            time: "12:00 - 13:20",
            room: "Ауд. 312"
        },
        {
            subject: "Прав. обеспечение",
            time: "13:40 - 15:00",
            room: "Ауд. ---"
        }
    ],

    // СУББОТА
    6: [{
        subject: "День КП",
        time: "",
        room: ""
    }],

    // ВОСКРЕСЕНЬЕ
    0: [{
        subject: "Выходной",
        time: "",
        room: ""
    }]
};

// ===== ОПРЕДЕЛЕНИЕ ТИПА НЕДЕЛИ ДЛЯ ДАТЫ =====
function getWeekTypeForDate(date) {
    const diffTime = date - SEMESTER_START;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7);
    return (weekNumber % 2 === 0) ? 'numerator' : 'denominator';
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function getDayName(dayNumber) {
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    return days[dayNumber] || "";
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2,"0")}.${month.toString().padStart(2,"0")}.${year}`;
}

// ===== ЗАГРУЗКА РАСПИСАНИЯ С КРАСИВЫМ ЗАГОЛОВКОМ =====
function loadScheduleForDay(dayOffset, containerId) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);

    const weekType = getWeekTypeForDate(targetDate);
    const schedule = weekType === 'numerator' ? numeratorSchedule : denominatorSchedule;
    const dayOfWeek = targetDate.getDay();

    const scheduleForDay = schedule[dayOfWeek] || schedule[0];

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    // Заголовок: день недели, дата, тип недели
    const header = document.createElement('div');
    header.className = "schedule-header";
    header.innerHTML = `<strong>${getDayName(dayOfWeek)}, ${formatDate(targetDate)}</strong> — ${weekType === 'numerator' ? "Числитель (Белая)" : "Знаменатель (Чёрная)"}`;
    container.appendChild(header);

    // Пары
    scheduleForDay.forEach(item => {
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

// ===== ЗАГРУЗКА ЗВОНКОВ =====
function loadBellSchedule() {
    const container = document.getElementById('bell-schedule');
    if (!container) return;

    container.innerHTML = '';
    bellSchedule.forEach(item => {
        const bellItem = document.createElement('div');
        bellItem.className = 'bell-item';
        bellItem.innerHTML = `<div><strong>${item.pair} пара:</strong> ${item.start} – ${item.end} <span style="margin-left:20px;">перемена ${item.break} мин</span></div>`;
        container.appendChild(bellItem);
    });
}

// ===== ЗАГРУЗКА ТЕКУЩЕЙ НЕДЕЛИ =====
function loadWeekInfo() {
    const today = new Date();
    const weekType = getWeekTypeForDate(today);
    const weekTypeText = weekType === 'numerator' ? 'Числитель (Белая)' : 'Знаменатель (Чёрная)';
    const badge = document.getElementById('week-type-badge');
    if (badge) badge.textContent = `Текущая неделя: ${weekTypeText}`;
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    loadScheduleForDay(0, 'today-schedule'); // Сегодня
    loadScheduleForDay(1, 'tomorrow-schedule'); // Завтра
    loadBellSchedule(); // Звонки
    loadWeekInfo(); // Тип недели
});