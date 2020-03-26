import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import { Table, Tooltip, Input } from 'antd';
import { Concert } from '../../components/Table';
import { OrderDetails } from '../../components/Table/Order';
import { SolutionOutlined } from '@ant-design/icons';

import css from '../../theme';
import 'antd/es/table/style/css';
import 'antd/es/tooltip/style/css';
import 'antd/es/input/style/css';

const Orders = styled.div`
  margin: ${css.sizes.xs} 0;
  vertical-align: middle;
  text-align: center;
`;

@inject('userStore', 'securityStore')
@observer
class Events extends React.PureComponent{
  componentDidMount() {
    const { userStore:{ getEventsOfUser, initState } } = this.props;

    initState();
    getEventsOfUser();
  };

  render() {
    // todo создать массив с цветами для блоков. подобрать красивые и правильные цвета

    const { userStore:{ filters, events } } = this.props;

    const columns = [
      {
        title: 'Концерт',
        dataIndex: 'concert',
        key: 'concert',
        filterLine: (
          <Tooltip trigger={['hover','click']} placement="topLeft" type="footnote" title="Поиск событий" >
            <div>
              <Input.Search onPressEnter={this.onSearch} placeholder={'Поиск'} />
            </div>
          </Tooltip>
        ),
        render: concert => <Concert concert={concert} />
      },
      {
        title: 'Дата концерта',
        dataIndex: 'date',
        key: 'date',
        filterLine: (
          <Tooltip trigger={['hover','click']} placement="topLeft" type="footnote" title="Дата" >
            <div>
              <Input.Search onPressEnter={this.onSearch} placeholder={'Поиск'} />
            </div>
          </Tooltip>
        ),
        render: date => date
      },
      {
        title: 'Продано билетов',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        width: 154,
        render: totalCur => totalCur
      },
      {
        title: 'На сумму',
        dataIndex: 'totalCur',
        key: 'totalCur',
        width: 124,
        render: totalQuantity => totalQuantity
      },
      {
        title: 'Отчеты',
        key: 'orders',
        width: 1,
        render: () => <Orders onClick={() => {}}><SolutionOutlined /></Orders>
      }
    ];

    return (
      <div className="site-layout-background bilego">
        <Table
          columns={columns}
          dataSource={events}
          // onChange={this.tableChange}
          expandRowByClick={false}
          expandable={{
            expandedRowRender: orders => <OrderDetails orders={orders.ordersInfo}/>,
          }}
          // pagination={{
          //   defaultPageSize: 20,
          //   pageSizeOptions: ['20', '50', '100'],
          //   showSizeChanger: true,
          //   total: pagination.total,
          //   current: pagination.current
          // }}
        />
      </div>
    )
  }
}

export default Events;
