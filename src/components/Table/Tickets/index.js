import React from 'react';
import { inject, observer } from 'mobx-react';

import { Table, Typography } from 'antd';

import 'antd/es/table/style/css';
import 'antd/es/badge/style/css';

const { Paragraph } = Typography;

@inject('ordersStore')
@observer
class Tickets extends React.Component{
  render() {
    const { tickets } = this.props;

    const columns = [
      {
        title: 'Билет',
        dataIndex: 'id',
        key: 'id',
        render: (text) => {
          return (<Paragraph>#{text}</Paragraph>)
        },
      },
      {
        title: 'Название',
        dataIndex: 'title',
        key: 'title',
        render: (text) => {
          return (<Paragraph>{text}</Paragraph>)
        },
      },
      {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        render: text => {
          return (<Paragraph>{text}p</Paragraph>)
        },
      },

      {
        title: 'Код безопасности',
        dataIndex: 'security',
        key: 'security',
        render: text => {
          return (<Paragraph>{text}p</Paragraph>)
        },
      }
    ];

    return (tickets.length > 0
      ? <Table
        columns={columns}
        dataSource={tickets}
        expandRowByClick={false}
        pagination={false}
      />
      : null
    )
  }
}

export default Tickets;
