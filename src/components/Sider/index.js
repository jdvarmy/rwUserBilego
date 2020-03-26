import React from 'react';
import { action, observable } from 'mobx';
import {inject, observer} from 'mobx-react';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import {
  RiseOutlined,
  PieChartOutlined
} from '@ant-design/icons';


import 'antd/es/layout/style/css';
import 'antd/es/menu/style/css';

const { SubMenu } = Menu;

const Logo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
`;

@inject('pageStore')
@observer
class Sider extends React.Component{
  @observable collapsed = true;
  @action
  onCollapse = (collapsed) => {
    this.collapsed = collapsed;
  };

  render() {
    return (
      <Layout.Sider collapsible collapsed={this.collapsed} onCollapse={this.onCollapse}>
        <Logo/>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <RiseOutlined/>
            <span>Events</span>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
    )
  }
}

export default Sider;
