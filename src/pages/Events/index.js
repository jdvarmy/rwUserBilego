import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import { round } from '../../components/functions';
import {Table, Input, DatePicker, Button, Typography, PageHeader} from 'antd';
import { OrderDetails } from '../../components/Table/Order';
import { SolutionOutlined, SearchOutlined, FilterOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ExportCSV } from '../../components/ExportCSV';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ru_RU';

import css from '../../theme';
import 'antd/es/table/style/css';
import 'antd/es/input/style/css';
import 'antd/es/button/style/css';
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
const StyledInput = styled(Input)`
  width: 188px;
  margin-bottom: ${css.sizes.base}; 
  display: block;
`;
const Span = styled.span`
  color: ${css.colors.grey};
  font-weight: 100;
`;
const Wrapper = styled.div`
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

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSearchBase = (selectedKeys) => {
    const { eventsStore:{ setFilter } } = this.props;
    setFilter(selectedKeys);
  };

  render() {
    const { eventsStore:{ filters, events, isLoading, clearFilters } } = this.props;
    const f = 'DD.MM.YYYY';

    const columns = [
      {
        title: <Flex>
          <div>Название</div>
          {filters.events !== undefined && <CloseCircleOutlined onClick={() => this.handleSearchBase({events: undefined})} />}
        </Flex>,
        width: '43%',
        dataIndex: 'event',
        key: 'event',
        render: text => filters.events !== undefined
          ? <Highlighter
            highlightStyle={{ backgroundColor: css.colors.yellow, padding: 0 }}
            searchWords={[filters.events.toString()]}
            autoEscape
            textToHighlight={text && text.toString()}
          />
          : text,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return(
            <StyledFilter>
              <StyledInput
                ref={node => {this.searchInput = node}}
                placeholder="Название события"
                value={selectedKeys[0]}
                onChange={ e => {
                  const {target:{value}} = e,
                    {events} = this.props.eventsStore.filters;
                  setSelectedKeys(value ? [value] : []);
                  value && value.length > 1
                    ? this.handleSearchBase( {events: value} )
                    : events !== undefined && this.handleSearchBase( {events: undefined} )
                }}
                onPressEnter={ () => confirm() }
              />
            </StyledFilter>
          )},
        filterIcon: filtered => <SearchOutlined style={{ color: this.props.eventsStore.filters.events ? css.colors.electricRed : undefined }} />,
        onFilterDropdownVisibleChange: visible => {visible && setTimeout(() => this.searchInput.select())},
      },



      {
        title: <Flex>
          <div>
            Дата концерта
            <div>
              <Span>
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
              </Span>
            </div>
          </div>
          {(filters.startDate !== undefined || filters.endDate !== undefined) && <CloseCircleOutlined onClick={() => this.handleSearchBase({startDate: undefined, endDate: undefined})} />}
        </Flex>,
        width: '24%',
        dataIndex: 'date',
        key: 'date',
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
        render: date => date,
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
      <Wrapper>
        <PageHeader
          title="Отчет по событиям"
          className="site-page-header"
          subTitle="просмотр ваших событий"
          extra={[
            <Button key="2" onClick={clearFilters}>Очистить фильтры</Button>,
            <Button key="1" type="primary" onClick={(e) => ExportCSV(events, 'Events')}>Скачать отчет</Button>
          ]}
        />
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

              money = round(sum + money);
              tickets += count;
              complitedMoney = round(sumC + complitedMoney);
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
      </Wrapper>
    )
  }
}

export default Events;
