import * as yup from 'yup';
import i18next, { init } from 'i18next';
import render from './view.js';
import onChange from 'on-change';

// валидация
const validate = (url, feed) => {
  const schema = yup.string().trim().required().url().notOneOf(feed);
  return schema.validate(url);
};

export default async () => {
  const defaultLanguege = 'ru';
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: defaultLanguege,
    debug: false,
    resources: '',
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
    render(watchedState, elements);
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
 //  elements.formEL.addEventListener('click', () => {
    // меняем состояние
 // });
  // console.log(watchedState);
};
