import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import render from './view.js';
import ru from './locales/index.js';

// валидация
const validate = (url, feed) => {
  const schema = yup.string().trim().required().url()
    .notOneOf(feed);
  return schema.validate(url);
};

// ДОБАВить ФУНКЦИю!
export default async () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const initialState = {
    form: {
      mode: '',
      sate: 'filling',
      inputState: '',
      error: null,
      feeds: [],
      valid: 'noData',
    },
    posts: [
      {
        id: 0,
        postId: 1,
      },
    ],
    feed: [
      {
        id: 0,
        feedId: 1, // Нормализация данных, посты и фиды связаны по ИД
      },
    ],
  };

  const elements = {
    formEl: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    feedBack: document.querySelector('.feedback'),
  };
  // console.log(elements);
  const watchedState = onChange(initialState, () => {
    render(watchedState, elements, i18n);
  });
  // тут обрабатывается форма и ее кнопка
  elements.formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const url = data.get('url');
    console.log('Submit!');

    validate(url, watchedState.form.feeds)
      .then((result) => {
        watchedState.form.inputState = 'validated';
        watchedState.form.feeds.push(result);
      })
      .catch((er) => {
        watchedState.form.inputState = 'notValidated';
        console.log('Errror');
      });
  });
};

//  elements.formEL.addEventListener('click', () => {
// меняем состояние
// });
// console.log(watchedState);
