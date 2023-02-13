import onChange from 'on-change';

const render = (state, elements) => {
  const renderForm = () => {
    if (state.form.inputState = 'validated') {
      elements.input.classList.remove('is-invalid');
      elements.feedBack.textContent = 'RSS успешно загружен';
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
    if (state.form.inputState = 'invalidated') {
      elements.input.classList.add('is-invalid');
      elements.feedBack.textContent = 'Ссылка должна быть валидным URL';
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
   
    }
    }
  }

  switch(state.mode) {
    case "posts": {
      renderPosts();
      break;
      }
    case "form": {
      renderForm();
      break;
  }
    default:
    //url
      throw new Error(`Uknow mode:${state.mode}`);
    }
}

  const watch = (state, elements) =>  onChange(initialState, (path, value, previousValue) => {
    render(watchedState, elements, i18nextInstance);
  });

  return watchedState;

export default render;