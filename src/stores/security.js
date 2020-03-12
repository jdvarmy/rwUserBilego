import { configure, observable, action, flow } from 'mobx';
import { errorsStore } from './';

configure({
  enforceActions: 'always'
});

class Security{
  // @observable permissions = userService.get() ? permissionsService.get(userService.get().roles) : {};

  @observable token = tokenService.get() || null;

  @observable user = userService.get() || {};

  @observable updatingUser = false;

  @action
  login = flow(function* login(username, password) {
    try {
      yield tokenService.clear();
      this.updatingUser = true;
      const {token, userDetail}  = yield securityService.login(username, password);
      this.token = token;
      this.user = userDetail;
      this.permissions = permissionsService.get(userDetail.roles);
      tokenService.set(token);
      userService.set(userDetail);
      i18n.changeLanguage(userDetail.settings.lang.toLowerCase());
      return true;
    } catch(e) {
      throw new Error('login error. ' + e);
    } finally {
      this.updatingUser = false;
    }
  });

  @action
  logout = function() {
    try {
      this.updatingUser = true;
      // TODO: инвалидация токена на сервере
      tokenService.clear();
      userService.clear();
      this.user = null;
      this.token = null;
      i18n.changeLanguage('en');
      return true;
    } catch (e) {
      return errorsStore.handleError('logout error. ' + e);
    } finally {
      this.updatingUser = false;
    }
  };
}

export default new Security();
