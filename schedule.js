const SEMESTER_START = new Date(2026, 8, 1); // 1 сентября 2026

function getWeekTypeForDate(date) {
    const start = new Date(SEMESTER_START);

    // делаем старт ближайшим ПОНЕДЕЛЬНИКОМ
    const startDay = start.getDay();
    const diffToMonday = (startDay === 0 ? -6 : 1 - startDay);
    start.setDate(start.getDate() + diffToMonday);

    // делаем текущую дату тоже понедельником своей недели
    const current = new Date(date);
    const currentDay = current.getDay();
    const currentDiff = (currentDay === 0 ? -6 : 1 - currentDay);
    current.setDate(current.getDate() + currentDiff);

    const diffTime = current - start;
    const weekNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

    return (weekNumber % 2 === 0) ? 'numerator' : 'denominator';
}

const numeratorSchedule = {
    1: [ // Понедельник
        { subject: "КГ 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "КГ 1пд / ТСИ 2пд", time: "15:55 - 17:15", room: "Ауд. 302 / Ауд. 305" },
        { subject: "ТА 1пд", time: "17:20 - 18:40", room: "Лаб. 302" },
        { subject: "КГ 1пд", time: "18:45 - 20:05", room: "Ауд. 302" }
    ],
    2: [ // Вторник
        { subject: "ТСИ 1пд", time: "8:35 - 9:55", room: "Ауд. 305" },
        { subject: "ТСИ", time: "10:00 - 11:20", room: "Ауд. 305" },
        { subject: "Физ.воспитание", time: "11:25 - 12:45", room: "Ауд. 02" },
        { subject: "БЖД", time: "13:05 - 14:25", room: "Ауд. 106" },
        { subject: "ТА 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
    ],
    3: [ // Среда
        { subject: "Кыргызский язык", time: "13:05 - 14:25", room: "Ауд. 304" },
        { subject: "История Кыргызстана", time: "14:30 - 15:50", room: "Ауд. 208" },
    ],
    4: [ // Четверг
        { subject: "КГ", time: "11:25 - 12:45", room: "Ауд. 302" },
        { subject: "География", time: "13:05 - 14:25", room: "Ауд. 206" },
        { subject: "ТА", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "ТА 1пд", time: "15:55 - 17:15", room: "Ауд. 302" }
    ],
    5: [ // Пятница
        { subject: "История Кыргызстана", time: "10:00 - 11:20", room: "Ауд. 208" },
        { subject: "Кыргызский язык", time: "11:25 - 12:45", room: "Ауд. 304" },
        { subject: "Английский язык", time: "13:05 - 14:25", room: "Ауд. 214 / Ауд. 216" },
    ],
    6: [ // Суббота
        { subject: "Выходной", time: "", room: "" }
    ],
    0: [ // Воскресенье
        { subject: "Выходной", time: "", room: "" }
    ]
};

const denominatorSchedule = {
    1: [ // Понедельник
        { subject: "КГ 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "КГ 1пд / ТСИ 2пд", time: "15:55 - 17:15", room: "Ауд. 302 / Ауд. 305" },
        { subject: "ТА 2пд", time: "17:20 - 18:40", room: "Лаб. 302" },
        { subject: "КГ 2пд", time: "18:45 - 20:05", room: "Ауд. 302" }
    ],
    2: [ // Вторник
        { subject: "ТСИ 1пд", time: "8:35 - 9:55", room: "Ауд. 305" },
        { subject: "ТСИ", time: "10:00 - 11:20", room: "Ауд. 305" },
        { subject: "Физ.воспитание", time: "11:25 - 12:45", room: "Ауд. 02" },
        { subject: "БЖД", time: "13:05 - 14:25", room: "Ауд. 106" },
        { subject: "ТА 2пд", time: "14:30 - 15:50", room: "Ауд. 302" },
    ],
    3: [ // Среда
        { subject: "Кыргызский язык", time: "13:05 - 14:25", room: "Ауд. 304" },
        { subject: "История Кыргызстана", time: "14:30 - 15:50", room: "Ауд. 208" },
    ],
    4: [ // Четверг
        { subject: "ТСИ", time: "10:00 - 11:20", room: "Ауд. 305" },
        { subject: "КГ", time: "11:25 - 12:45", room: "Ауд. 302" },
        { subject: "География", time: "13:05 - 14:25", room: "Ауд. 206" },
        { subject: "ТА", time: "14:30 - 15:50", room: "Ауд. 302" },
        { subject: "ТА 1пд", time: "15:55 - 17:15", room: "Ауд. 302" }
    ],
    5: [ // Пятница
        { subject: "История Кыргызстана", time: "10:00 - 11:20", room: "Ауд. 208" },
        { subject: "Кыргызский язык", time: "11:25 - 12:45", room: "Ауд. 304" },
        { subject: "Английский язык", time: "13:05 - 14:25", room: "Ауд. 214 / Ауд. 216" },
    ],
    6: [ // Суббота
        { subject: "Выходной", time: "", room: "" }
    ],
    0: [ // Воскресенье
        { subject: "Выходной", time: "", room: "" }
    ]
};

function loadScheduleForDay(dayOffset, containerId) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const weekType = getWeekTypeForDate(targetDate);
    const schedule = weekType === 'numerator' ? numeratorSchedule : denominatorSchedule;
    const dayOfWeek = targetDate.getDay();
    const scheduleForDay = schedule[dayOfWeek] || schedule[0];

    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // Если это завтрашний день и неделя отличается от сегодняшней – добавить подпись
    if (dayOffset === 1) {
        const todayWeekType = getWeekTypeForDate(new Date());
        if (weekType !== todayWeekType) {
            const weekLabel = document.createElement('div');
            weekLabel.className = 'week-type-badge-tomorrow';
            weekLabel.textContent = `Следующая неделя — ${weekType === 'numerator' ? 'Числитель (Белая)' : 'Знаменатель (Чёрная)'}`;
            container.appendChild(weekLabel);
        }
    }

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

function loadWeekInfo() {
    const weekType = getWeekTypeForDate(new Date());
    const weekTypeText = weekType === 'numerator' ? 'Числитель (Белая)' : 'Знаменатель (Чёрная)';
    const badge = document.getElementById('week-type-badge');
    if (badge) badge.textContent = `Текущая неделя: ${weekTypeText}`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadScheduleForDay(0, 'today-schedule');
    loadScheduleForDay(1, 'tomorrow-schedule');
    loadWeekInfo();
});