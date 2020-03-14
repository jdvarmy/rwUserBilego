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

import 'antd/es/layout/style/css';
import 'antd/es/menu/style/css';

const Wrapper = styled(Layout)`
  min-height: 100vh;
`;
const Content = styled(Layout.Content)`
  margin: 0 16px;
`;

const
  baseSize = 8,
  borderRadius = 2,
  borderWidth = 1,
  theme = {
    colors: {
      main: '#375362',
      electricBlue: '#E4E9EE',
    },
    sizes: {
      borderRadius: `${borderRadius}px`,
      base: `${baseSize}px`,
      xs: `${baseSize / 2}px`,
      md: `${baseSize * 2}px`,
      lg: `${baseSize * 3}px`,
      xl: `${baseSize * 4}px`,
      xxl: `${baseSize * 5}px`,
      borderWidth: `${borderWidth}px`,
    },
  };

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
    const { securityStore: {user} } = this.props;
    const routs = routes(user);

    !user
      ? history.push(`/login`)
      : history.location.pathname.indexOf('/login') + 1
        ? history.push(`/${user}`)
        : history.location.pathname.indexOf(`/${user}`) + 1
          ? history.push(path)
          : history.push(`/${user}`);

    return (
      <Wrapper>
        {user && <Sider />}
        <Layout className="site-layout">
          <Header />
          <Content>
            <Router history={history} path={path}>
              <Switch>
                {routs.map(props => (
                  <Route {...props} />
                ))}
              </Switch>
            </Router>
          </Content>
          <Footer />
        </Layout>
      </Wrapper>
    );
  }
}

export default BilegoUi;
