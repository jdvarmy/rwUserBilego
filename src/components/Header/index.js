import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const Content = styled(Navbar)`
  background: #001529;
  color: #fff;
  height: 68px;
`;

@inject('securityStore')
@observer
class Header extends React.Component{
  render() {
    const { securityStore: { user } } = this.props;
    return (
      <Content>
        <Nav className="mr-auto"/>
        <div inline>
          <div>{user.displayname}</div>
        </div>
      </Content>
    )
  }
}

export default Header;
