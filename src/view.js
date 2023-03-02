const render = (state, elements) => {
  switch (state.form.inputState) {
    case 'validated': {
      console.log('Positive in progress');
      elements.input.classList.remove('is-invalid');
      elements.feedBack.textContent = 'RSS успешно загружен';
      elements.feedBack.classList.add('text-success');
      elements.feedBack.classList.remove('text-danger');
      elements.formEl.reset();
      elements.input.focus();
      break;
    }
    case 'notValidated': {
      console.log('Negative');
      console.log('invalidated');
      elements.input.classList.add('is-invalid');
      elements.feedBack.textContent = 'Ссылка должна быть валидным URL';
      elements.feedBack.classList.add('text-danger');
      elements.feedBack.classList.remove('text-success');
      elements.formEl.reset();
      elements.input.focus();
      break;
    }
    default:
      break;
  }
};

export default render;
