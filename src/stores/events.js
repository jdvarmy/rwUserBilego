import {configure, observable, action, flow} from 'mobx';
import { eventsService } from '../services';

configure({
  enforceActions: 'always'
});

class Events{
  @observable isLoading = false;
  @observable events = false;
  @observable orders = false;

  @observable sortOrder = {columnKey: 'id', order: 'ascend'};
  @observable pagination = {current: 1, pageSize: 20, total: 1};

  @observable filters = {
    events: undefined,
    startDate: undefined,
    endDate: undefined,
    all: false,
  };

  @action
  setFilter = (filters) => {
    this.filters = { ...this.filters, ...filters };
    this.getEventsOfUser();
  };

  @action
  clearFilters = () => {
    this.filters = {
      events: undefined, // не используется. данные фильтруются без запроса в БД
      startDate: undefined,
      endDate: undefined,
      all: false,
    };
    this.fetchEvents();
  };

  @action
  initState = () => {
    this.events = [];
    this.orders = [];
    this.isLoading = false;
  };

  @action
  getEventsOfUser = flow(function* getEventsOfUser() {
    this.isLoading = true;
    try {
      const response = yield eventsService.getEventsOfUser(
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
          events: this.filters.events,
          startDate: this.filters.startDate
            ? this.filters.startDate.format('DD-MM-YYYY')
            : undefined,
          endDate: this.filters.endDate
            ? this.filters.endDate.format('DD-MM-YYYY')
            : undefined,
          all: this.filters.all,
        }
      );

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
