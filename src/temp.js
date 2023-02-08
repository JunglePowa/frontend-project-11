//это для примера вью сло формы
const render = (watchedState, elements, i18nextInstance) => {
    const renderPosts = () => {
        container.innerHTML = "";
        const buttons = state.posts.map()
  
        container.append(...buttons);
  
    }
  //это для примера вью слой формы
    const renderForm = () => {
        return i18nextInstance.t('')
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
  
        //вью слой на ончендж
    const watchedState = onChange(state, (path, value, previousValue) => {
      render(watchedState, elements, i18nextInstance);
    });
  
    return watchedState;
  
  }   