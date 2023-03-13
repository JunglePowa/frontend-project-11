const render = (state, elements, i18n) => {
  switch (state.form.inputState) {
    case 'validated': {
      elements.input.classList.remove('is-invalid');
      elements.feedBack.textContent = i18n.t('success');
      elements.feedBack.classList.add('text-success');
      elements.feedBack.classList.remove('text-danger');
      elements.formEl.reset();
      elements.input.focus();
      break;
    }
    case 'notValidated': {
      elements.input.classList.add('is-invalid');
      elements.feedBack.textContent = i18n.t('validateErrors.invalidUrl');
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
