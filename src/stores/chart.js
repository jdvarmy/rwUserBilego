import { configure, observable, action, flow } from 'mobx';
import { chartService } from '../services';

configure({
  enforceActions: 'always'
});

class Chart{
  @observable isLoading = false;
  @observable dataTicketsToMonth = null;

  @action
  clear = () => {
    this.dataTicketsToMonth = null;
  };

  @action
  getTicketsToMonth = flow( function* getTicketsToMonth(params){
    this.isLoading = true;
    try{
      const response = yield chartService.getTicketsToMonth(params);
      this.dataTicketsToMonth = response;
    }catch(e){
      console.log(e);
    }finally {
      this.isLoading = false;
    }
  }).bind(this);
}

export default new Chart();
