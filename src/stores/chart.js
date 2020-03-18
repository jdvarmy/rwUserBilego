import { configure, observable, action, flow } from 'mobx';
import { userService } from '../services';

configure({
  enforceActions: 'always'
});

class Chart{
  @observable isLoading = false;

  @action
  clear = () => {

  };

  @action
  getEventsOfUser = flow( function* getEventsOfUser(token, params = {}){
    this.isLoading = true;
    try{
      const response = yield userService.getEventsOfUser(token, params);
      console.log(response)
    }catch(e){
      console.log(e);
    }finally {
      this.isLoading = false;
    }
  }).bind(this);
  @action
  getOrders = flow( function* getOrders(token, params = {}){
    this.isLoading = true;
    try{
      const response = yield userService.getOrders(token, params);
      console.log(response)
    }catch(e){
      console.log(e);
    }finally {
      this.isLoading = false;
    }
  }).bind(this);
}

export default new Chart();
