import {configure, observable, action, flow} from 'mobx';
import { eventsService } from '../services';

configure({
  enforceActions: 'always'
});

class Events{
  @observable isLoading = false;
  @observable events = false;
  @observable response = false;

  @observable sortOrder = {columnKey: 'id', order: 'ascend'};
  @observable pagination = {current: 1, pageSize: 20, total: 1};

  @observable filters = {
    events: undefined,
    startDate: undefined,
    endDate: undefined,
    all: false,
  };

  cache = {};
  searchCache = {
    remove: (resource) => {
      delete this.cache[resource];
    },
    exist: (resource) => {
      return this.cache.hasOwnProperty(resource) && this.cache[resource] !== null;
    },
    get: (resource) => {
      return this.cache[resource];
    },
    set: (resource, cachedData) => {
      this.searchCache.remove(resource);
      this.cache[resource] = cachedData;
    },
  };
  getKey = () => {
    const { events, startDate, endDate, all } = this.filters;
    let key = '';

    all ? key = 'true' : key = 'false';
    events !== undefined ? key += events.toString() : key += '';
    startDate !== undefined ? key += startDate.format('DDMMYYYY') : key += '';
    endDate !== undefined ? key += endDate.format('DDMMYYYY') : key += '';

    return key;
  };

  @action
  setFilter = (filters) => {
    this.filters = { ...this.filters, ...filters };
    this.getEventsOfUser();
  };

  @action
  clearFilters = () => {
    this.filters = {
      events: undefined,
      startDate: undefined,
      endDate: undefined,
      all: false,
    };
    this.cache = {};
    this.getEventsOfUser();
  };

  @action
  initState = () => {
    this.events = [];
    this.response = [];
    this.isLoading = false;
  };

  @action
  getEventsOfUser = flow(function* getEventsOfUser() {
    this.isLoading = true;
    try {
      let response;
      const key = this.getKey();
      if(this.searchCache.exist(key)) {
        response = this.searchCache.get(key);
      }else {
        const {events, startDate, endDate, all} = this.filters;
        response = yield eventsService.getEventsOfUser(
          {
            page: this.pagination.current,
            size: this.pagination.pageSize,
            sortField: this.sortOrder.columnKey,
            direction: this.sortOrder.order
              ? this.sortOrder.order === 'descend'
                ? 'desc'
                : 'asc'
              : null,
          },
          {
            events: events,
            startDate: startDate ? startDate.format('DD-MM-YYYY') : undefined,
            endDate: endDate ? endDate.format('DD-MM-YYYY') : undefined,
            all: all,
          }
        );
        this.searchCache.set(key, response)
      }

      this.response = response;
      this.events = response.map(event => {
        return {
          key: event.id,
          event: event.title,
          date: event.date2,
          totalCur: event.total_cur,
          totalQuantity: event.total_quantity,
          totalCurCompleted: event.total_cur_completed,
          totalQuantityCompleted: event.total_quantity_completed,
          ordersInfo: event.orders_info,
        }
      });
    } catch (e) {
      // return errorHandleStore.handleError('load learnings error. ' + e);
    } finally {
      this.isLoading = false;
    }
  }).bind(this);
}

export default new Events();
