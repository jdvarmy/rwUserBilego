import storage from './helpers/storage';
import requests from './helpers/requests';

const key = '_bilego_user';

export default {
  set: storage.set.bind(null, key),
  get: storage.get.bind(null, key),
  clear: storage.remove.bind(null, key),

  getEventsOfUser: () =>
    requests.get('https://mos.bilego.ru/wp-json/bilego/v2/user/events'),
  getOrders: () =>
    requests.get('https://mos.bilego.ru/wp-json/bilego/v2/user/orders'),
};
