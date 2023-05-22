import * as yup from 'yup';
import i18n from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import {
  renderForm, renderFeed, renderPosts, renderUpdatedPosts, renderModal,
} from './view.js';
import resources from './locales/index.js';

export default () => {
  yup.setLocale({
    mixed: {
      default: 'field_invalid',
      notOneOf: 'notOneOf',
      required: 'required_feild',
    },
    string: {
      url: 'incorrect_format',
    },
  });
  const defaultLanguage = 'ru';
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  }).then(() => {
    const initialState = {
      form: {
        error: '',
        valid: '',
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
    const validate = (url, urls) => {
      const schema = yup.string().trim().required().url()
        .notOneOf(urls);
      return schema.validate(url);
    };

    const proxy = 'https://allorigins.hexlet.app/raw?url=';

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
      watchedState.processing.state = 'loading';
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
          watchedState.processing.state = 'loaded';
        })
        .catch((error) => {
          if (error.isAxiosError) {
            watchedState.rssForm.error = 'error_messages.network_error';
          } else if (error.isParsingError) {
            watchedState.form.error = 'error_messages.incorrect_url';
          } else {
            watchedState.form.error = 'error_messages.unknown_error';
          }
          watchedState.form.state = 'formFilling';
          watchedState.form.valid = 'notValidated';
        });
    };

    // сравнение новых и загруженных постов, возврщает новые посты
    const diffPosts = (arr1, arr2) => {
      const dif = _.differenceWith(arr1, arr2, _.isEqual);
      return dif;
    };

    // обновление постов
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
    const watchedState = onChange(initialState, (path) => {
      console.log(path);
      if (path === 'form.valid' || path === 'form.erros' || path === 'urls') {
        renderForm(watchedState, elements, i18nInstance);
      } else if (path === 'processing.state') {
        renderFeed(watchedState, elements, i18nInstance);
        renderPosts(watchedState, elements, i18nInstance);
      } else if (path === 'newPosts') {
        renderUpdatedPosts(watchedState);
      } else if (path === 'viewedPosts') {
        renderPosts(watchedState, elements, i18nInstance);
      } else if (path === 'modalPost') {
        renderModal(watchedState, elements);
      }
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
          watchedState.form.valid = 'validated';
          readRssFlow(url, watchedState);
        })
        .catch((err) => {
          watchedState.form.error = err.type;
          watchedState.form.valid = 'notValidated';
          console.log(watchedState.form.error);
        });
    });
    updatePosts(watchedState);
  });

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
};

// каждые 5 запускает обновление постов
