const render = (state, elements) => {
  const renderForm = () => {
    if (state.form.inputState === 'validated') {
      console.log('Positive in progress');
      elements.feedback.textContent = '';
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
      elements.input.classList.remove('is-invalid');
      elements.feedBack.textContent = 'RSS успешно загружен';
      elements.form.reset();
      elements.input.focus();
    }
    if (state.form.inputState === 'invalidated') {
      console.log('invalidated');
      elements.feedback.textContent = '';
      elements.input.classList.add('is-invalid');
      elements.feedBack.textContent = 'Ссылка должна быть валидным URL';
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
    }
  };

  switch (state.mode) {
    case 'posts': {
      renderPosts();
      break;
    }
    case 'form': {
      renderForm(state, elements);
      console.log('Case Form in Progress');
      break;
    }
    default:
      break;
  }
};

export default render;
