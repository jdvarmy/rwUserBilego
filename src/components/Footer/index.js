import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { isMobile } from 'mobile-device-detect';


const CustomFooter = styled(Layout.Footer)`
  ${isMobile && 'display: none;'}
  text-align: right;
  position: fixed;
  width: 100%;
  bottom: 2px;
  right: 2px;
  &.ant-layout-footer {
    padding: 0;
    color: rgba(0, 0, 0, 0.55);
    font-size: 10px;
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
