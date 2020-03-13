import requests from './helpers/requests';

export default {
  login: (username, password) =>
    requests.post('/authenticate', {}, {username, password}),

  logout: () => requests.post('/logout'),
};
