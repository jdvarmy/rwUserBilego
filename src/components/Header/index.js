import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import logo from './Bilego-logo_inverted.png'

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

@inject('securityStore')
@observer
class Header extends React.Component{
  render() {
    const { securityStore: { user } } = this.props;
    return (
      <Content>
        <Logo />
        <Nav className="mr-auto"/>
        <div inline>
          <div>{user.displayname}</div>
        </div>
      </Content>
    )
  }
}

export default Header;
