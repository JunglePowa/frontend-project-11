const render = (state, elements, i18nInstance) => {
  switch (state.form.inputState) {
    case 'validated': {
      elements.input.classList.remove('is-invalid');
      elements.feedBack.textContent = i18nInstance.t('rssLoadSuccess');
      elements.feedBack.classList.add('text-success');
      elements.feedBack.classList.remove('text-danger');
      elements.formEl.reset();
      elements.input.focus();
      break;
    }
    case 'notValidated': {
      if (state.form.errors.includes('notOneOf')) {
        state.form.errors.length = 0;
        elements.input.classList.add('is-invalid');
        elements.feedBack.textContent = i18nInstance.t('notOneOf');
        elements.feedBack.classList.add('text-danger');
        elements.feedBack.classList.remove('text-success');
        elements.formEl.reset();
        elements.input.focus();
      } else {
        state.form.errors.length = 0;
        elements.input.classList.add('is-invalid');
        elements.feedBack.textContent = i18nInstance.t('url');
        elements.feedBack.classList.add('text-danger');
        elements.feedBack.classList.remove('text-success');
        elements.formEl.reset();
        elements.input.focus();
      }
      break;
    }
    default:
      break;
  }
};

export default render;
