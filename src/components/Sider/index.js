import React from 'react';
import { action, observable } from 'mobx';
import {inject, observer} from 'mobx-react';
import { NavLink, withRouter } from 'react-router-dom';

import styled from 'styled-components';
import css from '../../theme';
import { Layout, Menu } from 'antd';
import {
  RiseOutlined,
  PieChartOutlined
} from '@ant-design/icons';

import 'antd/es/layout/style/css';
import 'antd/es/menu/style/css';

const Logo = styled.div`
  height: ${css.sizes.xl};
  background: rgba(255, 255, 255, 0.2);
  margin: ${css.sizes.md};
`;

@withRouter
@inject('pageStore', 'securityStore')
@observer
class Sider extends React.Component{
  @observable collapsed = true;
  @action
  onCollapse = (collapsed) => {
    this.collapsed = collapsed;
  };

  render() {
    const { securityStore:{ baseNameForRouting } } = this.props;

    const selected = this.props.history.location.pathname.indexOf('orders') !== -1
      ? 'orders'
      : 'events';

    return (
      <Layout.Sider collapsible collapsed={this.collapsed} onCollapse={this.onCollapse}>
        <Logo />
        <Menu
          theme="dark"
          selectedKeys={[selected]}
          mode="inline">
          <Menu.Item key="events">
            <NavLink to={`/${baseNameForRouting}/events`} exact>
              <RiseOutlined />
              <span>События</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="orders">
            <NavLink to={`/${baseNameForRouting}/orders`} exact>
              <PieChartOutlined/>
              <span>Заказы</span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
    )
  }
}

export default Sider;
