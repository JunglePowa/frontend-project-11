import * as yup from 'yup';
import i18n from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import { renderForm, renderFeed, renderPosts } from './view.js';
import resources from './locales/index.js';

const errorMessage = '';

const validate = (url, urls) => {
  const schema = yup.string().trim().required().url()
    .notOneOf(urls);
  return schema.validate(url);
};

export default async () => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const initialState = {
    form: {
      error: '',
      valid: '',
      state: 'filling',
    },
    processing: {
      state: '',
      error: '',
    },
    urls: [],
    posts: [],
    feeds: [],
  };

  const parser = (xml) => {
    const toStringParser = new DOMParser();
    const parsedDOM = toStringParser.parseFromString(xml, 'application/xml');

    const feedsTitle = parsedDOM.querySelector('title');
    const feedsDescription = parsedDOM.querySelector('description');
    const postsArr = [...parsedDOM.querySelectorAll('item')];
    const parsedPosts = postsArr.map((post) => ({
      id: _.uniqueId(),
      title: post.querySelector('title').textContent,
      description: post.querySelector('description').textContent,
      link: post.querySelector('link').textContent,
    }));
    const parsedResult = {
      id: _.uniqueId(),
      title: feedsTitle.textContent,
      description: feedsDescription.textContent,
      posts: [...parsedPosts],
    };
    return parsedResult;
  };

  const readRssFlow = (url, watchedState) => {
    watchedState.processing.state = 'loading';
    watchedState.form.error = '';

    const proxy = 'https://allorigins.hexlet.app/raw?url=';
    const originUrl = new URL(url);
    const rssFlow = `${proxy}${originUrl}`;
    console.log(watchedState.feeds);
    return axios
      .get(rssFlow)
      .then((response) => parser(response.data))
      .then((data) => {
        const { id, title, description, posts } = data;
        watchedState.feeds.unshift({ id, title, description });
        watchedState.posts.unshift(posts);
        watchedState.processing.state = 'loaded';
        console.log(watchedState.posts);
        watchedState.feeds.map((el) => {
          console.log(`Это фиды после рендера ${el.id}`);
        });
      });
  };

  const elements = {
    formEl: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    feedBack: document.querySelector('.feedback'),
    feeds: document.querySelector('div.feeds'),
    posts: document.querySelector('div.posts'),

  };

  const watchedState = onChange(initialState, (path) => {
    console.log(path);
    if (path === 'form.valid' || path === 'form.erros' || path === 'urls') {
      renderForm(watchedState, elements, i18nInstance);
    } else if (path === 'processing.state') {
      renderFeed(watchedState, elements, i18nInstance);
      renderPosts(watchedState, elements, i18nInstance);
    }
  });
  // тут обрабатывается форма и ее кнопка
  elements.formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const url = data.get('url');
    console.log('Submit!');
    console.log(url);

    validate(url, watchedState.urls)
      .then((url) => {
        watchedState.urls.push(url);
        watchedState.form.valid = 'validated';
        readRssFlow(url, watchedState);
      })
      .catch((err) => {
        watchedState.form.error = err.type;
        watchedState.form.valid = 'notValidated';
        console.log(watchedState.form.error);
      });
  });
};

//  elements.formEL.addEventListener('click', () => {
// меняем состояние
// });
// console.log(watchedState);
