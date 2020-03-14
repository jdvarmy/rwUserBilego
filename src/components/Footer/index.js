import React from 'react';
import { Layout } from 'antd';

/**
 * @return {number}
 */
function GetYear(){
  return new Date().getFullYear();
}

export default function Footer(){
  return (
    <Layout.Footer style={{ textAlign: 'right', position: 'fixed', width: '100%', bottom: 0, right: '16px' }}>Bilego event admin ©<GetYear /> Created by JDV</Layout.Footer>
  )
}
