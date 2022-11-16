import onChange from 'on-change';
import * as yup from 'yup';

export const app = () => {

    const state = {
        urlForm: {
            valid: false,
            rssUrls: [],
            url: '',
            errors: []
        }
    }

    //const schema = yup.object().shape({
     //   inputValue: yup.string().required('Input field is blank...').url('Incorrect Url...'),
      //});
    const input = document.querySelector('.input');
    const categorySpan = document.querySelector('span');
    const watchedState = onChange(state, (path, value) => {
        if (path === 'urlForm.valid') {
          if (value === 'false') {
            categorySpan.classList.add("border border-danger");
          }
          }
        })
    

      const form = document.querySelector(".row")
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const schema = yup.string().url('Incorrect Url...').required('Input field is blank...').notOneOf(state.urlForm.rssUrls);
        const url = formData.get('url');
        state.urlForm.url = url;
        if (schema.isValid(url)) {
            watchedState.urlForm.valid = true;
            watchedState.rssUrls.push(url);
          } else {
            watchedState.urlForm.valid = false;
          }
          watchedState.urlForm.valid = '';
        console.log('POP')
      });
}
