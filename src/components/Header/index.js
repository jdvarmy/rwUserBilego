import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
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
  width: 166px;
  height: 100%;
`;
const Logout = styled.div`
  margin-left: ${css.sizes.base};
  cursor: pointer;
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
    const { securityStore: { user } } = this.props;
    return (
      <Content>
        <Logo />
        <Nav className="mr-auto"/>
        <div inline>
          <div>{user.displayname}</div>
        </div>
        <Logout onClick={this.logout}>выйти</Logout>
      </Content>
    )
  }
}

export default Header;
