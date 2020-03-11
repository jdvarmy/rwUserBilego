import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

const Content = styled(Layout.Header)`
  background-color: white;
`;

export default function Header(){
  return (
    <Content />
  );
}