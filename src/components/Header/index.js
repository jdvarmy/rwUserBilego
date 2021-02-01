import React from 'react';
import { inject, observer } from 'mobx-react';
import {NavLink, withRouter} from 'react-router-dom';
import styled from 'styled-components';
import { isMobile } from 'mobile-device-detect';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Menu, Dropdown, Button} from 'antd';
import {
  RiseOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import css from '../../theme';

import logo from './Bilego-logo_inverted.png';

const Content = styled(Navbar)`
  background: #001529;
  color: #fff;
  height: 68px;
`;
const Logo = styled.div`
  background-image: url(${logo});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  width: ${isMobile ? '68px' : '166px'};
  ${isMobile && 'margin-left: 24px;'}
  height: 100%;
`;
const Logout = styled.div`
  margin-left: ${css.sizes.base};
  cursor: pointer;
`;
const Link = styled(NavLink)`
  display: flex!important;
  justify-content: center;
  align-items: center;
  & > span:last-child{
    margin-left: 8px;
  }
`;

@withRouter
@inject('securityStore')
@observer
class Header extends React.Component{
  logout = () => {
    const { securityStore: { logout } } = this.props;
    logout();
    this.props.history.push('/login');
  };

  render() {
    const { securityStore: { baseNameForRouting, user } } = this.props;

    const menu = (
      <Menu>
        <Menu.Item key="events">
          <Link to={`/${baseNameForRouting}/events`} exact>
            <RiseOutlined />
            <span>События</span>
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="orders">
          <Link to={`/${baseNameForRouting}/orders`} exact>
            <PieChartOutlined/>
            <span>Заказы</span>
          </Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <Content>
        {isMobile && (
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <Button key="1" type="primary">Меню</Button>
            </a>
          </Dropdown>
        )}
        <Logo />
        <Nav className="mr-auto"/>
        <div>
          <div>{user.displayname}</div>
        </div>
        <Logout onClick={this.logout}>выйти</Logout>
      </Content>
    )
  }
}

export default Header;
