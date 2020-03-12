import React from 'react';
import { inject, observer, Provider as MobxProvider } from 'mobx-react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';

import * as stores from './stores';
import {
  EventsPage,
  LoginPage
} from './pages';
import Footer from './components/Footer';
import Sider from './components/Sider';
import Header from './components/Header';

import 'antd/es/layout/style/css';
import 'antd/es/menu/style/css';
import 'antd/es/breadcrumb/style/css';

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

@inject('securityStore')
@observer
class BilegoUiRouter extends React.Component {
  selectStartPage = (user) => {
    if (!user || !user.roles) {
      return '/login';
    } else {
      return '/';
    }
  };

  render() {
    const { securityStore: { permissions, user} } = this.props;

    return (
      <Wrapper>
        <Sider />
        <Layout className="site-layout">
          <Header />
          <Content>
            <BrowserRouter basename={`/${user}`}>
              <Switch>
                <Route path="/login" exact component={LoginPage} />
                <Route from="/events" exact component={EventsPage} />
                <Route from="/" exact component={EventsPage} />
              </Switch>
            </BrowserRouter>
          </Content>
          <Footer />
        </Layout>
      </Wrapper>
    );
  }
}

export default BilegoUi;
