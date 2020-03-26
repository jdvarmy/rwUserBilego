import React from 'react';
import styled from 'styled-components';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const Content = styled(Navbar)`
  background: #001529;
  color: #fff;
  height: 68px;
`;

export default function Header(){
  return (
    <Content>
      <Nav className="mr-auto" />
      <div inline>
        <div>User</div>
      </div>
    </Content>
  );
}
