import storage from './helpers/storage';
import requests from './helpers/requests';

const key = 'user';

export default {
  set: storage.set.bind(null, key),
  get: storage.get.bind(null, key),
  clear: storage.remove.bind(null, key)
};
