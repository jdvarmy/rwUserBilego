import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

const Logo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
`;

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
            <PieChartOutlined/>
            <span>Option 1</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                  <UserOutlined/>
                  <span>User</span>
                </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
        </Menu>
      </Layout.Sider>
    )
  }
}

export default Sider;
