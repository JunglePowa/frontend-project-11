import { container } from 'webpack';
import render from './view.js';
import * as yup from 'yup';
import i18next from 'i18next';

// валидация должна быть через функцию валидейт и асинхронной
const validate = async (url, feed) => {
  const schema = yup.string().trim().required.url().notOneOf(feed);
  return schema.validate(url);
};

// главная функция

export default async () => {
  const defaultLanguege = 'ru';
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: defaultLanguege,
    debug: false,
    resources: '',
  });

  const state = {
    mode: '',
    form: {
      processState: 'filling',
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
    formEL: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    feedBack: document.querySelector('.feedback'),
  };

  const watchedState = render(state, elements); // ту обрабатываеся вью

  // тут обрабатывается форма и ее кнопка
  elements.formEL.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const url = data.get('url');
    state.mode = 'form';

    validate(url, state.form.feeds)
      .then((url) => {
        state.form.feeds.push(url);
        state.form.inputState = 'validated';
      })
      .catch((e) => {
        state.form.inputState = 'notValidated';
      });
  });

  elements.formEL.addEventListener('click', () => {
    // меняем состояние
  });
};
