import storage from './helpers/storage';
const key = 'token';

export default {
  set: storage.set.bind(null, key),
  get: storage.get.bind(null, key),
  clear: storage.remove.bind(null, key),
};
