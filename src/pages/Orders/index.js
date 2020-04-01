import React from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import styled from 'styled-components';

import {Table, Input, Divider, DatePicker, Button, Typography} from 'antd';
import { Concert } from '../../components/Table';
import { OrderDetails } from '../../components/Table/Order';
import { SolutionOutlined, SearchOutlined, FilterOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ru_RU';

import css from '../../theme';
import 'antd/es/table/style/css';
import 'antd/es/input/style/css';
import 'antd/es/button/style/css';
import 'antd/es/divider/style/css';
import 'antd/es/date-picker/style/css';

const Flex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  .anticon{
    font-size: 12px;
    color: ${css.colors.electricRed};
    cursor: pointer;
    margin-right: 6px;
  }
`;

@inject('ordersStore', 'securityStore')
@observer
class Orders extends React.PureComponent{
  componentDidMount() {
    const { ordersStore:{ getOrders, initState } } = this.props;

    initState();
    getOrders();
  };

  round = value => {
    return Number(Math.round(value + 'e' + 2) + 'e-' + 2);
  };

  render() {
    const { ordersStore:{ orders, isLoading } } = this.props;

    const columns = [
      {
        title: <Flex><div>Ордер</div></Flex>,
        dataIndex: 'id',
        key: 'id',
        render: text => '#'+text,
      },
      {
        title: <Flex><div>Дата</div></Flex>,
        dataIndex: 'date',
        key: 'date',
        render: text => text,
      },
      {
        title: <Flex><div>Статус</div></Flex>,
        dataIndex: 'status',
        key: 'status',
        render: text => text,
      },
      {
        title: <Flex><div>Сумма</div></Flex>,
        dataIndex: 'totalCur',
        key: 'totalCur',
        render: text => text,
      },
      {
        title: <Flex><div>Количество</div></Flex>,
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        render: text => text,
      },
      {
        title: <Flex><div>Покупатель</div></Flex>,
        dataIndex: 'customer',
        key: 'customer',
        render: text => text,
      },
      {
        title: <Flex><div>Событие</div></Flex>,
        dataIndex: 'event',
        key: 'event',
        render: text => text,
      },
    ];

    return (
      <div className="site-layout-background bilego">
        <Divider />
        <Table
          columns={columns}
          dataSource={orders}
          expandRowByClick={false}
          loading={isLoading}
          bordered={true}
          pagination={false}
        />
      </div>
    )
  }
}

export default Orders;
