import { observable, action } from 'mobx';

export class errors {
  @observable errors = [];

  @action
  handleError (text, errorCode, type = 'error') {
    this.errors.push({
      text: errorCode ? text + '. HTTP code: ' + errorCode : text,
      type: type
    });
  };

  @action
  deleteError (ind) {
    this.errors.splice(ind, 1);
  };
}

export default new errors();
