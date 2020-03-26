import { configure, observable, action, flow } from 'mobx';
import { userService } from '../services';

configure({
  enforceActions: 'always'
});

class User{
  @observable isLoading = false;
  @observable events = false;
  @observable orders = false;

  @observable sortOrder = {columnKey: 'startDate', order: 'ascend'};
  @observable pagination = {current: 1, pageSize: 20, total: 1};

  @observable filters = {
    concert: undefined,
    date: undefined,
  };

  @action
  setFilter = (filters) => {
    this.filters = { ...this.filters, ...filters };
    this.fetchEvents();
  };

  @action
  clearFilters = () => {
    this.filters = {
      concert: undefined,
      date: undefined,
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
      const response = yield userService.getEventsOfUser(
        {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          sortField: this.sortOrder.columnKey,
          direction: this.sortOrder.order ? this.sortOrder.order === 'descend' ? 'desc' : 'asc' : null,
        }, this.filters
      );
      this.events = response.map(event => {
        console.log(event);

        return {
          key: event.id,
          concert: event.title,
          date: event.date2,
          totalCur: event.total_cur,
          totalQuantity: event.total_quantity,
          ordersInfo: event.orders_info,
        }
      });
    } catch (e) {
      // return errorHandleStore.handleError('load learnings error. ' + e);
    } finally {
      this.isLoading = false;
    }
  }).bind(this);







  @action
  getOrders = flow( function* getOrders(params = {}){
    this.isLoading = true;
    try{
      const response = yield userService.getOrders(params);
      console.log(response)
      this.orders = response;
    }catch(e){
      console.log(e);
    }finally {
      this.isLoading = false;
    }
  }).bind(this);
}

export default new User();
