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

const Orders = styled.div`
  margin: ${css.sizes.xs} 0;
  vertical-align: middle;
  text-align: center;
`;
const StyledFilter = styled.div`
  padding: ${css.sizes.base};
  .ant-picker-suffix{display: none;}
`;
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

const { RangePicker } = DatePicker;
const { Text } = Typography;

@inject('eventsStore', 'securityStore')
@observer
class Events extends React.PureComponent{
  componentDidMount() {
    const { eventsStore:{ getEventsOfUser, initState } } = this.props;

    initState();
    getEventsOfUser();
  };

  round = value => {
    return Number(Math.round(value + 'e' + 2) + 'e-' + 2);
  };

  state = {
    searchText: '',
    searchedColumn: '',
    clearFilters: undefined
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      return(
        <StyledFilter>
          <Input
            ref={node => {this.searchInput = node}}
            placeholder="Поиск событий"
            value={selectedKeys[0]}
            onChange={ e => setSelectedKeys(e.target.value ? [e.target.value] : []) }
            onPressEnter={ () => this.handleSearch(selectedKeys, confirm, dataIndex, clearFilters) }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex, clearFilters)}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Искать
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Сбросить
          </Button>
        </StyledFilter>
    )},
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? css.colors.electricRed : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex
        ?
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        :
          text,
  });
  getDateSearchProps = () => ({
    filterDropdown: () => {
      const { eventsStore: { filters: { startDate, endDate } } } = this.props;
      return (
        <StyledFilter>
          <RangePicker
            bordered={false}
            locale={locale}
            ranges={{
              'Сегодня': [moment(), moment()],
              'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
              'Этот год': [moment().startOf('year'), moment().endOf('year')],
            }}
            onCalendarChange={dates => {
              if(dates[0] === startDate && dates[1] === endDate) return;
              this.handleSearchBase(dates ? {startDate: dates[0], endDate: dates[1]} : [])}
            }
            value={[startDate, endDate]}
            allowClear={false}
          />
        </StyledFilter>
      )},
    filterIcon: filtered => <FilterOutlined style={{ color: this.props.eventsStore.filters.startDate || this.props.eventsStore.filters.endDate ? css.colors.electricRed : undefined }} />,
  });

  handleSearch = (selectedKeys, confirm, dataIndex, clearFilters) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
      clearFilters: clearFilters,
    });
  };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSearchBase = (selectedKeys) => {
    const { eventsStore:{ setFilter } } = this.props;
    setFilter(selectedKeys);
  };

  render() {
    const { eventsStore:{ filters, events, isLoading } } = this.props;
    const f = 'DD.MM.YYYY';

    const columns = [
      {
        title: <Flex>
          <div>
            Название
            <div>
              <span
              style={{color: css.colors.grey}}>
                {`${this.state.searchText ? `Фильтр: ${this.state.searchText}` : `Отображаем все события`}`}
              </span>
            </div>
          </div>
          {/*{this.state.searchText && <CloseCircleOutlined onClick={() => this.handleReset(this.state.clearFilters)} />}*/}
        </Flex>,
        width: '43%',
        dataIndex: 'event',
        key: 'event',
        render: events => <Concert concert={events} />,
        ...this.getColumnSearchProps('event')
      },
      {
        title: <Flex>
          <div>
            Дата концерта
            <div>
              <span
                style={{color: css.colors.grey}}>
                {
                  `${filters.startDate && filters.endDate 
                    ? `с ${filters.startDate.format(f)} по ${filters.endDate.format(f)}`
                    : filters.startDate && filters.endDate === undefined
                      ? `с ${filters.startDate.format(f)}`
                      : filters.startDate === undefined && filters.endDate
                        ? `по ${filters.endDate.format(f)}`
                        : `c ` + moment().format(f)
                  }`
                }
              </span>
            </div>
          </div>
          {(filters.startDate !== undefined || filters.endDate !== undefined) && <CloseCircleOutlined onClick={() => this.handleSearchBase({startDate: undefined, endDate: undefined})} />}
        </Flex>,
        width: '24%',
        dataIndex: 'date',
        key: 'date',
        render: date => date,
        ...this.getDateSearchProps()
      },
      {
        title: 'Билеты',
        width: '13%',
        children: [
          {
            title: 'Выполненые',
            dataIndex: 'totalQuantityCompleted',
            key: 'totalQuantityCompleted',
            render: text => 'x'+text
          },
          {
            title: 'Всего',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            render: text => 'x'+text
          }
        ]
      },
      {
        title: 'На сумму',
        width: '13%',
        children: [
          {
            title: 'Выполненые',
            dataIndex: 'totalCurCompleted',
            key: 'totalCurCompleted',
            render: text => text + 'p'
          },
          {
            title: 'Всего',
            dataIndex: 'totalCur',
            key: 'totalCur',
            render: text => text + 'p'
          }
        ],
      },
      {
        title: 'Отчеты',
        key: 'orders',
        width: '5%',
        render: () => <Orders onClick={() => {}}><SolutionOutlined /></Orders>
      }
    ];

    return (
      <div className="site-layout-background bilego">
        <Divider />
        <Table
          columns={columns}
          dataSource={events}
          expandRowByClick={false}
          loading={isLoading}
          expandable={{
            expandedRowRender: orders => <OrderDetails orders={orders.ordersInfo}/>,
          }}
          bordered={true}
          pagination={false}
          summary={data => {
            let money = 0,
              tickets = 0,
              complitedMoney = 0,
              complitedTickets = 0;

            data.map(el => {
              const sum = parseFloat(el.totalCur),
                count = el.totalQuantity,
                sumC = parseFloat(el.totalCurCompleted),
                countC = el.totalQuantityCompleted;

              money = this.round(sum + money);
              tickets += count;
              complitedMoney = this.round(sumC + complitedMoney);
              complitedTickets += countC;
            });

            return (
              <>
                <tr>
                  <th colSpan={3}>Всего</th>
                  <th>
                    <Text>x{complitedTickets}</Text>
                  </th>
                  <th>
                    <Text>x{tickets}</Text>
                  </th>
                  <th>
                    <Text type="danger">{complitedMoney}p</Text>
                  </th>
                  <th>
                    <Text type="danger">{money}p</Text>
                  </th>
                  <td/>
                </tr>
              </>
            );
          }}
        />
      </div>
    )
  }
}

export default Events;
