import React from 'react';
import { inject, observer } from 'mobx-react';
import style from 'styled-components';

import { Table, Badge, Typography, Tooltip } from 'antd';

import css from '../../../theme';
import 'antd/es/table/style/css';
import 'antd/es/badge/style/css';

const { Paragraph } = Typography;
const Dot = style.span`
  ::before{
    content: "•";
    display: inline-block;
    margin: 0px 5px;
  }
`;

@observer
class OrderDetails extends React.Component{
  render() {
    const { orders } = this.props;

    const columns = [
      {
        title: 'Заказ',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => {
          return (
            <Paragraph>
              #{text}
            </Paragraph>
          )
        },
      },
      {
        title: 'Дата заказа',
        dataIndex: 'date',
        key: 'date',
        render: text => {
          return (
            <Paragraph>
              {text}
            </Paragraph>
          )
        },
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return (
            <Paragraph>
              <Badge status="success" />
              Finished
            </Paragraph>
          )
        },
      },
      {
        title: 'На сумму',
        dataIndex: 'totalCur',
        key: 'totalCur',
        render: text => {
          return (
            <Paragraph>
              {text}
            </Paragraph>
          )
        },
      },
      {
        title: 'Покупатель',
        dataIndex: 'customer',
        key: 'customer',
        render: data => {
          return (
            <Tooltip title={`Билеты куплены через: ${data.user_agent}`}>
              <Paragraph>
                {data.email}
              </Paragraph>
              <Paragraph>
                ip: {data.ip}
              </Paragraph>
            </Tooltip>
          )
        },
      },
      {
        title: 'Билеты',
        dataIndex: 'tickets',
        key: 'tickets',
        render: data => {
          return data.map(el=>(
              <Paragraph>
                {el.name}<Dot/>{el.quantity}<Dot/>{el.total}
              </Paragraph>
            ))
        },
      },
    ];

    const data = [];
    Object.keys(orders).map(key => {
      data.push({
        id: orders[key].id,
        key: key,
        status: orders[key].status,
        date: orders[key].date,
        totalCur: orders[key].total_cur,
        totalQuantity: orders[key].total_quantity,
        customer: {
          email: orders[key].billing_address.email,
          ip: orders[key].customer_ip,
          user_agent: orders[key].customer_user_agent,
        },
        tickets: orders[key].line_items
      })
    });

    return (
      <Table
        columns={columns}
        dataSource={data}
        expandRowByClick={false}
        pagination={false}
      />
    )
  }
}

export default OrderDetails;
