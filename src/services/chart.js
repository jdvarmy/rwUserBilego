import requests from './helpers/requests';

export default {
  getTicketsToMonth: () =>
    requests.get('https://mos.bilego.ru/wp-json/bilego/v2/chart/ticketsToMonth', {}),
};
