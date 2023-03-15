import * as yup from 'yup';
import i18n from 'i18next';
import onChange from 'on-change';
import render from './view.js';
import resources from './locales/index.js';

// валидация
const validate = (url, feed) => {
  const schema = yup.string().trim().required().url()
    .notOneOf(feed);
  return schema.validate(url);
};

// ДОБАВить ФУНКЦИю!
export default async () => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const initialState = {
    form: {
      mode: '',
      sate: 'filling',
      inputState: '',
      errors: [],
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
    render(watchedState, elements, i18nInstance);
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
        watchedState.form.errors.push(er.type);
        console.log(watchedState.form.errors);
      });
  });
};

//  elements.formEL.addEventListener('click', () => {
// меняем состояние
// });
// console.log(watchedState);
