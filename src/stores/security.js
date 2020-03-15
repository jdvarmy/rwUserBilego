import { configure, observable, action, flow } from 'mobx';
import { errorsStore } from './';
import {
  securityService,
  tokenService,
  userService,
} from '../services';

configure({
  enforceActions: 'always'
});

class Security{
  @observable token = tokenService.get() || null;

  @observable user = userService.get() || null;

  @observable updatingUser = false;

  @action
  login = flow(function* login(email, password) {
    try {
      yield tokenService.clear();
      this.updatingUser = true;
      const {token, user_email, user_nicename, user_display_name} = yield securityService.login(email, password),
        userDetail = {email: user_email, nicename: user_nicename, displayname: user_display_name};
      this.token = token;
      this.user = userDetail;
      tokenService.set(token);
      userService.set(userDetail);
      return true;
    } catch(e) {
      return errorsStore.handleError('login error. ' + e);
    } finally {
      this.updatingUser = false;
    }
  });

  @action
  logout = function() {
    try {
      this.updatingUser = true;
      tokenService.clear();
      userService.clear();
      this.user = null;
      this.token = null;
      return true;
    } catch (e) {
      return errorsStore.handleError('logout error. ' + e);
    } finally {
      this.updatingUser = false;
    }
  };
}

export default new Security();
