import _superagent from 'superagent';
import superagentPromise from 'superagent-promise';

const http = superagentPromise(_superagent, global.Promise);

const handleErrors = error => {
  // console.log(error)
  // console.log(error.rawResponse)
};

const handleCatch = (url, err) => {
  console.log(url, err)
};

const responseBody = res => res.body || res.text;

const tokenPlugin = request => {
  // todo: включить на проме, блокирует запросы с разных адресов
  // request.set('X-Requested-With', 'XMLHttpRequest');
  // request.set('X-NX-Origin', 'SG');
};

export default {
  get: (url, query = {}) =>
    http
      .get(`${url}`)
      .query(query)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody)
      .catch(err => handleCatch(url, err)),
  post: (url, query = {}, body = {}) =>
    http
      .post(`${url}`, body)
      .query(query)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody)
      .catch(err => handleCatch(url, err)),
  fileUpload: (url, query = {}, files = [], fields = []) => {
    let req = http.post(`${url}`);
    files.forEach((file)=> {
      req.attach(file.name, file);
    });
    fields.forEach( (field)=> {
      req.field(field);
    });

    return req
      .query(query)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody)
      .catch(err => handleCatch(url, err));
  },
};
