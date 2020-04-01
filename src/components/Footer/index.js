import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

const CustomFooter = styled(Layout.Footer)`
  text-align: right;
  position: fixed;
  width: 100%;
  bottom: 2px;
  right: 2px;
  &.ant-layout-footer {
    padding: 0;
    color: rgba(0, 0, 0, 0.55);
    font-size: 12px;
    background: none;
  }
`;

/**
 * @return {number}
 */
function GetYear(){
  return new Date().getFullYear();
}

export default function Footer(){
  return (
    <CustomFooter>Bilego event admin ©<GetYear /> created by jdv</CustomFooter>
  )
}
