import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  inputData: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      iziToast.error({
        timeout: 2000,
        position: 'topRight',
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      refs.startBtn.disabled = false;
      userSelectedDate = selectedDates[0];

      iziToast.success({
        timeout: 2000,
        position: 'topRight',
        title: 'OK',
        message: 'Successfully!',
      });
    }
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

class Timer {
  constructor() {
    this.isActive = false;
    this.intervalId = null;
    refs.startBtn.disabled = true;
  }

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = userSelectedDate - currentTime;

      if (deltaTime <= 0) {
        clearInterval(this.intervalId);
        this.updateClockFace(convertMs(0));
        refs.inputData.disabled = false;
        return;
      }

      const time = convertMs(deltaTime);

      this.updateClockFace(time);
    }, 1000);

    refs.inputData.disabled = true;
    refs.startBtn.disabled = true;
  }

  updateClockFace({ days, hours, minutes, seconds }) {
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
  }
}

const timer = new Timer();

refs.startBtn.addEventListener('click', timer.start.bind(timer));

flatpickr(refs.inputData, options);
