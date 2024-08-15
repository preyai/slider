
const startTime = new Date("2024-08-15T00:00:00").getTime();
const endTime = new Date("2024-08-15T12:00:00").getTime();
let intervalInMs = 60 * 60 * 1000; // Изначально 1 час

const timeline = document.getElementById('timeline');
const currentTimeDisplay = document.getElementById('current-time');

// Функция для создания временных меток на шкале
function createTicks() {
    timeline.innerHTML = ''; // очищаем текущие тики
    for (let time = startTime; time <= endTime; time += intervalInMs) {
        const tick = document.createElement('div');
        tick.className = 'tick';
        const date = new Date(time);
        tick.innerText = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        timeline.appendChild(tick);
    }
    updateCurrentTime();
}

createTicks(); // создаем начальные тики

let isDragging = false;
let isBlocked = false;
let startX;

timeline.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        isDragging = true;
        timeline.style.cursor = 'grabbing';
        startX = e.pageX - timeline.offsetLeft + timeline.scrollLeft;
    }
});

timeline.addEventListener('mousemove', (e) => {
    if (isDragging) {
        isBlocked = true;
        const currentX = e.pageX - timeline.offsetLeft + timeline.scrollLeft;
        timeline.scrollLeft -= (currentX - startX);
        startX = currentX;
        updateCurrentTime();
    }
});

timeline.addEventListener('mouseup', (e) => {
    if (!isBlocked) {
        const clickX = e.pageX - timeline.offsetLeft + timeline.scrollLeft;
        const selectedTime = xToTime(clickX);
        console.log(`Выбранное время: ${selectedTime.toLocaleString()}`);
    }

    isDragging = false;
    isBlocked = false;
    timeline.style.cursor = 'grab';
});

timeline.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        timeline.style.cursor = 'grab';
    }
});

timeline.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    // Изменение интервала времени: уменьшение при прокрутке вверх, увеличение при прокрутке вниз
    if (delta > 0) {
        intervalInMs = Math.min(intervalInMs * 2, 60 * 60 * 1000); // максимум 1 час
    } else {
        intervalInMs = Math.max(intervalInMs / 2, 30 * 1000); // минимум 30 секунда
    }
    createTicks();
});

function xToTime(x) {
    const totalDuration = endTime - startTime;
    const timelineWidth = timeline.scrollWidth;
    const timePosition = (x / timelineWidth) * totalDuration;
    return new Date(startTime + timePosition);
}

function updateCurrentTime() {
    const visibleWidth = timeline.clientWidth;
    const scrollLeft = timeline.scrollLeft;
    const middleX = scrollLeft + visibleWidth / 2;
    const currentTime = xToTime(middleX);
    currentTimeDisplay.innerText = `Текущее время: ${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
}

timeline.addEventListener('scroll', updateCurrentTime);