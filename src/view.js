const renderFeed = (state, elements) => {
  const { feeds } = elements;
  feeds.innerHTML = '';

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = ('Фиды');

  feeds.append(cardBorder);
  cardBorder.append(cardBody);
  cardBody.append(cardTitle);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  listGroup.innerHTML = '';

  const loadedFeeds = state.feeds;
  loadedFeeds.map((feed) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group', 'border-0', 'rounded-0');

    const subTitle = document.createElement('h3');
    subTitle.classList.add('h6', 'm-0');
    subTitle.textContent = (feed.title);

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = (feed.description);

    listGroupItem.append(subTitle, description);
    listGroup.append(listGroupItem);
  });
  feeds.append(listGroup);
};

const renderPosts = (state, elements) => {
  const { posts } = elements;
  posts.innerHTML = '';
  console.log('RENDERPOSTS');

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = ('Посты');

  posts.append(cardBorder);
  cardBorder.append(cardBody);
  cardBody.append(cardTitle);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  listGroup.setAttribute('id', 'posts');
  listGroup.innerHTML = '';

  cardBorder.append(listGroup);

  const loadedPosts = state.posts.flat();
  loadedPosts.map((post) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', `${post.id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';

    const link = document.createElement('a');
    if (state.viewedPosts.includes(post.id)) {
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal', 'link-secondary');
    } else {
      link.classList.add('fw-bold');
    }
    link.setAttribute('href', `${post.link}`);
    link.setAttribute('data-id', `${post.id}`);
    link.setAttribute('target', 'blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.textContent = post.title;

    console.log(link.textContent);

    listGroupItem.append(link);
    listGroupItem.append(button);
    listGroup.append(listGroupItem);
  });
};

const renderModal = (state, elements) => {
  console.log('RENDERMODAL');
  const postId = state.modalPost;
  const modalPost = state.posts.flat().find((post) => post.id === postId);
  const { title, description, link } = modalPost;
  elements.modal.title.textContent = title;
  elements.modal.body.textContent = description;
  elements.modal.button.setAttribute('href', `${link}`);
};

const renderUpdatedPosts = (state) => {
  console.log('RENDERNEWPOST');

  const listGroup = document.getElementById('posts');

  const loadedPosts = state.newPosts.flat();
  loadedPosts.map((post) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const link = document.createElement('a');
    link.classList.add('fw-bold');
    link.setAttribute('href', `${post.link}`);
    link.setAttribute('target', 'blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.textContent = post.title;

    console.log(link.textContent);

    listGroupItem.append(link);
    listGroup.append(listGroupItem);
  });
};
// Надо проверить рендер ошибок, тексты ошибок рисутются через отдельную функцию, проверить рендеры состояний
const renderNotValid = ({ button, input, feedBack }) => {
  button.disabled = false;
  input.classList.add('is-invalid');
  feedBack.classList.remove('text-success');
  feedBack.classList.remove('text-warning');
  feedBack.classList.add('text-danger');
  elements.input.focus();
};

const renderValid = ({
  button, input, feedBack, formEl,
}, i18next) => {
  button.disabled = false;
  input.classList.remove('is-invalid');
  feedBack.classList.remove('text-danger');
  feedBack.classList.remove('text-warning');
  feedBack.classList.add('text-success');
  feedBack.textContent = i18next.t('status.success');
  formEl.reset();
  input.focus();
};

const renderState = (elements, i18next, value) => {
  switch (value) {
    case 'notValidated':
      renderNotValid(elements);
      break;
    case 'validated': {
      renderValid(elements, i18next);
      break;
    }
    default:
      break;
  }
};

const renderError = (state, { feedBack }, i18next, error) => {
  if (error === null) {
    return;
  }

  feedBack.classList.add('text-danger');
  feedBack.textContent = i18next.t(`errors.${state.form.error}`);
};

const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'form.state':
      renderState(elements, i18next, value);
      break;
    case 'form.error':
      renderError(state, elements, i18next, value);
      break;
    case 'feeds':
      renderFeed(state, elements, i18next);
      renderPosts(state, elements, i18next);
      break;
    case 'modalPosts':
      renderModal(state, elements, value);
      break;
    case 'newPosts':
      renderUpdatedPosts(state);
      break;
    case 'viewedPosts':
      renderPosts(state, elements, i18next);
      break;
    default:
      break;
  }
};

export default render;
