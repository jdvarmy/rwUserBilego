import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

import Events from './components/Events';
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

class App extends React.Component {

  render() {
    return (
      <Wrapper>
        <Sider />
        <Layout className="site-layout">
          <Header />
          <Content>
            <Events />
          </Content>
          <Footer />
        </Layout>
      </Wrapper>
    );
  }
}

export default App;
