import requests from './helpers/requests';

export default {
  getActiveEvents: (apiRoot, filterParams) =>
    requests.get(apiRoot+'/event/slug', {...filterParams}),
}