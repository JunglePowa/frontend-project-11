import * as yup from 'yup';
import i18n from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import render from './view.js';
import resources from './locales/index.js';

const proxy = 'https://allorigins.hexlet.app/raw?url=';

const handleError = (error) => {
  if (error.isParsingError) {
    return 'notRss';
  }

  if (axios.isAxiosError(error)) {
    return 'networkError';
  }

  return error.message.key ?? 'unknown';
};

const parser = (xml) => {
  const toStringParser = new DOMParser();
  const parsedDOM = toStringParser.parseFromString(xml, 'application/xml');
  console.log(parsedDOM);

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
  watchedState.form.error = '';
  const originUrl = new URL(url);
  const rssFlow = `${proxy}${originUrl}`;
  console.log(watchedState.feeds);
  return axios
    .get(rssFlow)
    .then((response) => parser(response.data))
    .then((data) => {
      const {
        id, title, description, posts,
      } = data;
      watchedState.feeds.unshift({ id, title, description });
      watchedState.posts.unshift(posts);
      console.log(watchedState.posts);
    })
    .catch((error) => {
      watchedState.form.state = 'notValidated';
      watchedState.form.error = handleError(error);
    });
};

const updatePosts = (state) => {
  const recentPosts = state.posts;

  const newPosts = state.urls.map((url) => {
    const originUrl = new URL(url);
    const rssFlow = `${proxy}${originUrl}`;
    let newPosts = [];

    axios.get(rssFlow)
      .then((response) => parser(response.data))
      .then((data) => {
        newPosts = newPosts.concat(data.posts);
      });
  });
  const updatedPosts = diffPosts(newPosts, recentPosts);
  
  state.newPosts = updatedPosts.slice();
  console.log('GET NEW POSTS');
  console.log(state.newPosts);
  Promise.all(newPosts).finally(() => setTimeout(() => updatePosts(state), 5000));
};

const diffPosts = (arr1, arr2) => {
  const dif = _.differenceWith(arr1, arr2, _.isEqual);
  return dif;
};

export default () => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'url' }),
      required: () => ({ key: 'empty' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'notOneOf' }),
    },
  });

  const initialState = {
    form: {
      error: '',
      state: '',
    },
    processing: {
      state: '',
      error: '',
      update: '',
    },
    urls: [],
    posts: [],
    newPosts: [],
    feeds: [],
    viewedPosts: [],
    modalPost: '',
  };

  const elements = {
    formEl: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    feedBack: document.querySelector('.feedback'),
    feeds: document.querySelector('div.feeds'),
    posts: document.querySelector('div.posts'),
    modal: {
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      button: document.querySelector('.full-article'),
    },
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      const watchedState = onChange(initialState, render(initialState, elements, i18nInstance));

      const validate = (url, urls) => {
        const schema = yup.string().trim().required().url()
          .notOneOf(urls);
        return schema.validate(url);
      };

      elements.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const url = data.get('url');
        console.log('Submit!');
        console.log(url);
        // После нажатия кнопки идет валидация, после успешной валдации чтение рсс потока
        validate(url, watchedState.urls)
          .then((url) => {
            watchedState.urls.push(url);
            watchedState.form.state = 'validated';
            readRssFlow(url, watchedState);
          })
          .catch((err) => {
            watchedState.form.error = err.type;
            watchedState.form.state = 'notValidated';
            console.log(watchedState.form.error);
          });
      });

      elements.posts.addEventListener('click', ({ target }) => {
        const { id } = target.dataset;
        if (target.dataset.id) {
          if (!watchedState.viewedPosts.includes(id)) {
            watchedState.viewedPosts.push(id);
          }
          console.log(watchedState.viewedPosts);
          watchedState.modalPost = id;
        }
        return false;
      });
      updatePosts(watchedState);
    });
};

// каждые 5 запускает обновление постов
