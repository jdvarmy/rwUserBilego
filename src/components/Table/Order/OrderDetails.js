import React from 'react';
import { inject, observer } from 'mobx-react';
import style from 'styled-components';

import { Table, Badge, Typography, Tooltip } from 'antd';

import css from '../../../theme';
import 'antd/es/table/style/css';
import 'antd/es/badge/style/css';

const { Paragraph, Text } = Typography;
const Dot = style.span`
  ::before{
    content: "•";
    display: inline-block;
    margin: 0px 5px;
  }
`;

@observer
class OrderDetails extends React.Component{

  round = value => {
    return Number(Math.round(value + 'e' + 2) + 'e-' + 2);
  };

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
              <Badge status={
                text === 'Выполнен'
                  ? 'success'
                  : text === 'Отменен'
                    ? 'error'
                    : text === 'В ожидании оплаты'
                      ? 'processing'
                      : 'default'
              } />
              {text}
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
              {text}p
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
          return data.map((el, k)=>(
              <Paragraph key={k}>
                {el.name}<Dot/>x{el.quantity}<Dot/>{el.price}p
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
      data.length > 0
      ? <Table
        columns={columns}
        dataSource={data}
        expandRowByClick={false}
        pagination={false}
        summary={data => {
          let money = 0,
            tickets = 0,
            complitedMoney = 0,
            complitedTickets = 0;

          data.map(el => {
            const sum = parseFloat(el.totalCur), count = el.totalQuantity;

            if(el.status === 'Выполнен'){
              complitedMoney = this.round(sum + complitedMoney);
              complitedTickets += count;
            }
            money = this.round(sum + money);
            tickets += count;
          });

          return (
            <>
              <tr>
                <th colSpan={2}>Выполненые заказы</th>
                <th colSpan={2}>
                  <Text type="danger">{complitedMoney}p</Text>
                </th>
                <th colSpan={2}>
                  <Text>x{complitedTickets}</Text>
                </th>
              </tr>
              <tr>
                <th colSpan={2}>Всего</th>
                <th colSpan={2}>
                  <Text type="danger">{money}p</Text>
                </th>
                <th colSpan={2}>
                  <Text>x{tickets}</Text>
                </th>
              </tr>
            </>
          );
        }}
      />
      : null
    )
  }
}

export default OrderDetails;
