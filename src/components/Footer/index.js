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
    <Layout.Footer style={{ textAlign: 'center' }}>Bilego ©<GetYear /> Created by JDV</Layout.Footer>
  )
}
