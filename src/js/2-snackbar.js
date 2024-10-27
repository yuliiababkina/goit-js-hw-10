import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const delay = document.querySelector('input[name=delay]');

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const eventDelay = Number(delay.value);
  const stateStatus = document.querySelector('input[name=state]:checked').value;

  createPromise(eventDelay, stateStatus)
    .then(delay => {
      iziToast.success({
        timeout: 2000,
        position: 'topRight',
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        timeout: 2000,
        position: 'topRight',
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });

  form.reset();
}

function createPromise(delay, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (status === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
