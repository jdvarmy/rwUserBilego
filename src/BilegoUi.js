import React from 'react';
import { inject, observer, Provider as MobxProvider } from 'mobx-react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import {Router, Route, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Layout } from 'antd';

import * as stores from './stores';
import routes from './routes';

import Footer from './components/Footer';
import Sider from './components/Sider';
import Header from './components/Header';

import theme from './theme';

const Wrapper = styled(Layout)`
  min-height: 100vh;
`;

class BilegoUi extends React.Component {
  render() {
    return (
      <MobxProvider {...stores}>
        <ThemeProvider theme={theme}>
          <BilegoUiRouter />
        </ThemeProvider>
      </MobxProvider>
    );
  }
}

const history = createBrowserHistory();
const path = window.location.pathname;

@inject('securityStore')
@observer
class BilegoUiRouter extends React.Component {
  render() {
    const { securityStore: {user, token} } = this.props;
    const routs = routes(user && user.nicename ? user.nicename : '');

    !user || !token
      ? history.push(`/login`)
      : history.location.pathname.indexOf('/login') + 1
        ? history.push(`/${user.nicename}`)
        : history.location.pathname.indexOf(`/${user.nicename}`) + 1
          ? history.push(path)
          : history.push(`/${user.nicename}`);

    return (
      <Wrapper>
        <Router history={history} path={path}>
          {(user && token) && <Sider />}
          <Layout className="site-layout">
            {(user && token) && <Header />}
            <Layout.Content>
                <Switch>
                  {routs.map(props => (
                    <Route {...props} />
                  ))}
                </Switch>
            </Layout.Content>
            <Footer />
          </Layout>
        </Router>
      </Wrapper>
    );
  }
}

export default BilegoUi;
