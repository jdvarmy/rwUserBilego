import {configure, observable, action, flow} from 'mobx';
import { ordersService } from '../services';

configure({
  enforceActions: 'always'
});

class Orders{
  @observable isLoading = false;
  @observable orders = false;
  @observable tickets = false;

  @observable sortOrder = {columnKey: 'id', order: 'ascend'};
  @observable pagination = {current: 1, pageSize: 20, total: 1};

  @observable filters = {
    ordersId: undefined,
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    buyer: undefined,
    event: undefined,
    all: false,
  };

  @action
  setFilter = (filters) => {
    this.filters = { ...this.filters, ...filters };
    this.getOrders();
  };

  @action
  clearFilters = () => {
    this.filters = {
      ordersId: undefined,
      startDate: undefined,
      endDate: undefined,
      status: undefined,
      buyer: undefined,
      event: undefined,
      all: false,
    };
    this.getOrders();
  };

  @action
  initState = () => {
    this.isLoading = false;
    this.orders = [];
    this.tickets = [];
  };

  @action
  getOrders = flow(function* getOrders() {
    this.isLoading = true;
    try {
      const response = yield ordersService.getOrders(
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
          ordersId: this.filters.ordersId,
          startDate: this.filters.startDate
            ? this.filters.startDate.format('DD-MM-YYYY')
            : undefined,
          endDate: this.filters.endDate
            ? this.filters.endDate.format('DD-MM-YYYY')
            : undefined,
          status: this.filters.status,
          buyer: this.filters.buyer,
          event: this.filters.event,
          all: this.filters.all,
        }
      );

      this.orders = Object.keys(response).map(order => {
        let ticket = [];
        const line_items = response[order].line_items;
        line_items.map(item => {
          const { name, price, attendees } = item;
          attendees.map( t => {
            ticket.push({
              id: t.ticket_id,
              key: t.ticket_id,
              title: name,
              price: price,
              security: t.security
            })
          })
        });

        return {
          id: response[order].id,
          key: response[order].id,
          date: response[order].date,
          status: response[order].status,
          totalCur: response[order].total_cur,
          totalQuantity: response[order].total_quantity,
          customer: response[order].billing_address.email,
          event: response[order].event.title,
          ticket: ticket
        }
      });
      console.log(this.orders)

    } catch (e) {
      // return errorHandleStore.handleError('load learnings error. ' + e);
    } finally {
      this.isLoading = false;
    }
  }).bind(this);
}

export default new Orders();
