import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import {
  Table,
  Input,
  DatePicker,
  Button,
  Typography,
  Badge,
  Tooltip,
  Checkbox,
  Row,
  Col,
  PageHeader,
} from 'antd';
import { round } from '../../components/functions';
import Tickets from '../../components/Table/Tickets';
import { SearchOutlined, FilterOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ExportCSV } from '../../components/ExportCSV';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ru_RU';

import css from '../../theme';
import 'antd/es/table/style/css';
import 'antd/es/input/style/css';
import 'antd/es/button/style/css';
import 'antd/es/date-picker/style/css';
import 'antd/es/tooltip/style/css';
import 'antd/es/page-header/style/css';
import 'antd/es/col/style/css';
import 'antd/es/row/style/css';
import 'antd/es/checkbox/style/css';
import 'antd/es/badge/style/css';

const Flex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  .anticon{
    font-size: 12px;
    color: ${css.colors.electricRed};
    cursor: pointer;
    margin: 0 4px 0 6px;
  }
`;
const StyledFilter = styled.div`
  padding: ${css.sizes.base};
  .ant-picker-suffix{display: none;}
`;
const Span = styled.span`
  color: ${css.colors.grey};
  font-weight: 100;
`;
const StyledInput = styled(Input)`
  width: 188px;
  margin-bottom: ${css.sizes.base}; 
  display: block;
`;
const Wrapper = styled.div`
  .image{
    margin: 0 0 0 60px;
    display: flex;
    align-items: center;
  }
  .ant-page-header-rtl .example-link{
    float: right;
    margin-right: 0;
    margin-left: ${css.sizes.md};
  }
  .ant-page-header-rtl .example-link-icon{
    margin-right: 0;
    margin-left: ${css.sizes.base};
  }
  @media (max-width: 768px){
    .image{
      flex: 100%;
      margin: ${css.sizes.lg} 0 0;
    }
  }
`;

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

@inject('ordersStore', 'securityStore')
@observer
class Orders extends React.PureComponent{
  componentDidMount() {
    const { ordersStore:{ getOrders, initState } } = this.props;

    initState();
    getOrders();
  };
  componentWillUnmount(){
    clearTimeout(this.time);
  };

  statuses = [
    {value: 'completed', name: 'Выполнен'},
    {value: 'cancelled', name: 'Отменен'},
    {value: 'pending', name: 'В ожидании оплаты'},
    {value: 'refunded', name: 'Возращён'},
    {value: 'failed', name: 'Неудачно'},
    {value: 'processing', name: 'Обработка'},
    {value: 'on-hold', name: 'На удержании'},
  ];

  handleSearchBase = (selectedKeys) => {
    const { ordersStore:{ setFilter } } = this.props;
    this.time = setTimeout(function(){
      setFilter(selectedKeys);
    }, 100);
  };

  xlsxFileName = () => {
    const { filters: {startDate, endDate} } = this.props.ordersStore,
      format = 'DD/MM/YYYY';

    return startDate && endDate
      ? `Заказы с ${startDate.format(format)} по ${endDate.format(format)}-bilego`
      : !startDate && endDate
        ? `Заказы по ${endDate.format(format)}-bilego`
        : startDate && !endDate
          ? `Заказы с ${startDate.format(format)}-bilego`
          : `Заказы bilego`
  };
  xlsxFileData = () => {
    const { response } = this.props.ordersStore;
    let csvData = [];

    Object.keys(response).map( key =>{
      const items = response[key].line_items,
        order = {
          id: response[key].id,
          orderKey: response[key].order_key,
          status: response[key].status,
          date: response[key].date,
          customerEmail: response[key].billing_address.email,
          customerIp: response[key].customer_ip,
          totalOrderCur: response[key].total_cur,
          totalOrderQua: response[key].total_quantity,
          currency: response[key].currency,
          eventTitle: response[key].event.title
        };

      items.map(el => {
        const { attendees } = el,
          ticket = {
            name: el.name,
            price: el.price,
            quantity: el.quantity,
            total: el.total
          };

        attendees && attendees.length > 0
          ? attendees.map(a => {
            csvData.push({
              'ID заказа': order.id,
              'Дата покупки': order.date,
              'Статус': order.status,
              'Сумма заказа': order.totalOrderCur,
              'Валюта': order.currency,
              'Кол-во билетов в заказе': order.totalOrderQua,

              'Событие': order.eventTitle,
              'ID билета': a.ticket_id,
              'Билет': ticket.name,
              'Цена': ticket.price,
              'Количество': 1,
              'Сумма': ticket.price,
              'Код безопасности': a.security,
              'Покупатель': order.customerEmail,
              'IP покупателя': order.customerIp,
              'Check in': a.check_in ? 'yes' : 'no'
            });
          })
          : csvData.push({
            'ID заказа': order.id,
            'Дата покупки': order.date,
            'Статус': order.status,
            'Сумма заказа': order.totalOrderCur,
            'Валюта': order.currency,
            'Кол-во билетов в заказе': order.totalOrderQua,

            'Событие': order.eventTitle,
            'ID билета': '',
            'Билет': ticket.name,
            'Цена': ticket.price,
            'Количество': ticket.quantity,
            'Сумма': ticket.total,
            'Код безопасности': '',
            'Покупатель': order.customerEmail,
            'IP покупателя': order.customerIp,
            'Check in': 'no',
          });
      });
    } );

    return csvData;
  };

  render() {
    const { ordersStore:{ orders, isLoading, filters, clearFilters } } = this.props;
    const f = 'DD.MM.YYYY';

    const columns = [
      {
        title: <Flex>
          <div>Заказ</div>
          {filters.orderId !== undefined && <CloseCircleOutlined onClick={() => this.handleSearchBase({orderId: undefined})} />}
        </Flex>,
        dataIndex: 'id',
        key: 'id',
        render: text => filters.orderId !== undefined
          ? <>#<Highlighter
            highlightStyle={{ backgroundColor: css.colors.yellow, padding: 0 }}
            searchWords={[filters.orderId.toString()]}
            autoEscape
            textToHighlight={text && text.toString()}
          /></>
          : '#'+text,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return(
            <StyledFilter>
              <StyledInput
                ref={node => {this.searchInput = node}}
                placeholder="Номер заказа"
                value={selectedKeys[0]}
                onChange={ e => {
                  const {target:{value}} = e,
                    {orderId} = this.props.ordersStore.filters;
                  setSelectedKeys(value ? [value] : []);
                  value && value.length > 1
                  ? this.handleSearchBase( {orderId: value} )
                  : orderId !== undefined && this.handleSearchBase( {orderId: undefined} )
                }}
                onPressEnter={ () => confirm() }
              />
            </StyledFilter>
          )},
        filterIcon: filtered => <SearchOutlined style={{ color: this.props.ordersStore.filters.orderId ? css.colors.electricRed : undefined }} />,
        onFilterDropdownVisibleChange: visible => {visible && setTimeout(() => this.searchInput.select())},
      },
      {
        title: <Flex>
          <div>
            Дата
            <div>
              <Span>
                {
                  `${filters.startDate && filters.endDate
                    ? `с ${filters.startDate.format(f)} по ${filters.endDate.format(f)}`
                    : filters.startDate && filters.endDate === undefined
                      ? `с ${filters.startDate.format(f)}`
                      : filters.startDate === undefined && filters.endDate
                        ? `по ${filters.endDate.format(f)}`
                        : ''
                    }`
                }
              </Span>
            </div>
          </div>
          {(filters.startDate !== undefined || filters.endDate !== undefined) && <CloseCircleOutlined onClick={() => this.handleSearchBase({startDate: undefined, endDate: undefined})} />}
        </Flex>,
        dataIndex: 'date',
        key: 'date',
        filterDropdown: () => {
          const { ordersStore: { filters: { startDate, endDate } } } = this.props;
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
        filterIcon: filtered => <FilterOutlined style={{ color: this.props.ordersStore.filters.startDate || this.props.ordersStore.filters.endDate ? css.colors.electricRed : undefined }} />,
        render: text => text,
      },
      {
        title: <Flex>
          <div>
            Статус
            <div>
              <Span>{
                filters.status !== undefined && this.statuses.filter(el=>{
                  return filters.status.indexOf(el.value)+1
                }).map(el=>{
                  return <div key={el.value}>{el.name}</div>
                })
              }</Span>
            </div>
          </div>
          {(filters.status !== undefined) && <CloseCircleOutlined onClick={() => this.handleSearchBase({status: undefined})} />}
        </Flex>,
        dataIndex: 'status',
        key: 'status',
        render: text => <Paragraph>
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
        </Paragraph>,
        filterDropdown: () => {
          const { status } = this.props.ordersStore.filters;
          return(
            <StyledFilter>
              <Checkbox.Group style={{ width: '100%' }} onChange={e => this.handleSearchBase({status: e.length !== 0 ? e : undefined})}>
                <Row gutter={[css.sizes.base, css.sizes.base]}>
                  {this.statuses.map(s => (
                    <Col key={s.value} span={24}>
                      <Checkbox checked={status && !!status.indexOf(s.value)} value={s.value}>{s.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </StyledFilter>
          )
        },
        filterIcon: filtered => <FilterOutlined style={{ color: this.props.ordersStore.filters.status ? css.colors.electricRed : undefined }} />,
      },
      {
        title: <Flex><div>Сумма</div></Flex>,
        dataIndex: 'totalCur',
        key: 'totalCur',
        render: text => text+'p',
      },
      {
        title: <Flex><div>Количество</div></Flex>,
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
        render: text => text,
      },
      {
        title: <Flex>
          <div>Покупатель</div>
          {filters.customer !== undefined && <CloseCircleOutlined onClick={() => this.handleSearchBase({customer: undefined})} />}
        </Flex>,
        dataIndex: 'customer',
        key: 'customer',
        render: text => filters.customer !== undefined
          ?<Tooltip title={`Билеты куплены через: ${text.userAgent}`}>
            <Paragraph>
              <Highlighter
                highlightStyle={{ backgroundColor: css.colors.yellow, padding: 0 }}
                searchWords={[filters.customer.toString()]}
                autoEscape
                textToHighlight={text && text.email.toString()}
              />
            </Paragraph>
            <Paragraph>
              ip: <Highlighter
                highlightStyle={{ backgroundColor: css.colors.yellow, padding: 0 }}
                searchWords={[filters.customer.toString()]}
                autoEscape
                textToHighlight={text && text.ip.toString()}
              />
            </Paragraph>
          </Tooltip>
        : <Tooltip title={`Билеты куплены через: ${text.userAgent}`}>
            <Paragraph>
              {text.email}
            </Paragraph>
            <Paragraph>
              ip: {text.ip}
            </Paragraph>
          </Tooltip>,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return(
            <StyledFilter>
              <StyledInput
                ref={node => {this.searchInput = node}}
                placeholder="Поиск по email или ip"
                value={selectedKeys[0]}
                onChange={ e => {
                  const {target:{value}} = e,
                    {customer} = this.props.ordersStore.filters;
                  setSelectedKeys(value ? [value] : []);
                  value && value.length > 1
                    ? this.handleSearchBase( {customer: value})
                    : customer !== undefined && this.handleSearchBase({customer: undefined})
                }}
                onPressEnter={ () => confirm() }
              />
            </StyledFilter>
          )},
        filterIcon: filtered => <SearchOutlined style={{ color: this.props.ordersStore.filters.customer ? css.colors.electricRed : undefined }} />,
        onFilterDropdownVisibleChange: visible => {visible && setTimeout(() => this.searchInput.select())},
      },
      {
        title: <Flex>
          <div>Событие</div>
          {filters.event !== undefined && <CloseCircleOutlined onClick={() => this.handleSearchBase({event: undefined})} />}
        </Flex>,
        dataIndex: 'event',
        key: 'event',
        render: text => filters.event !== undefined
          ? <Highlighter
            highlightStyle={{ backgroundColor: css.colors.yellow, padding: 0 }}
            searchWords={[filters.event.toString()]}
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
                    {event} = this.props.ordersStore.filters;
                  setSelectedKeys(value ? [value] : []);
                  value && value.length > 1
                    ? this.handleSearchBase( {event: value} )
                    : event !== undefined && this.handleSearchBase( {event: undefined} )
                }}
                onPressEnter={ () => confirm() }
              />
            </StyledFilter>
          )},
        filterIcon: filtered => <SearchOutlined style={{ color: this.props.ordersStore.filters.event ? css.colors.electricRed : undefined }} />,
        onFilterDropdownVisibleChange: visible => {visible && setTimeout(() => this.searchInput.select())},
      },
    ];

    return (
      <Wrapper>
        <PageHeader
          title="Отчет по заказам"
          className="site-page-header"
          subTitle="просмотр заказов ваших клиентов"
          extra={[
            <Button key="2" onClick={clearFilters}>Очистить фильтры</Button>,
            <Button key="1" type="primary" onClick={() => ExportCSV(this.xlsxFileData(), this.xlsxFileName())}>Скачать отчет</Button>,
          ]}
        />
        <Table
          columns={columns}
          dataSource={orders}
          expandRowByClick={false}
          loading={isLoading}
          bordered={true}
          pagination={false}
          expandable={{
            expandedRowRender: orders => <Tickets tickets={orders.tickets} />,
          }}
          summary={data => {
            let money = 0,
              tickets = 0,
              complitedMoney = 0,
              complitedTickets = 0;

            data.map(el => {
              const sum = parseFloat(el.totalCur), count = el.totalQuantity;

              if(el.status === 'Выполнен'){
                complitedMoney = round(sum + complitedMoney);
                complitedTickets += count;
              }
              money = round(sum + money);
              tickets += count;
            });

            return (
              <>
                <tr>
                  <th colSpan={4}>Выполненые заказы</th>
                  <th colSpan={1}>
                    <Text type="danger">{complitedMoney}p</Text>
                  </th>
                  <th colSpan={1}>
                    <Text>x{complitedTickets}</Text>
                  </th>
                  <td colSpan={2}/>
                </tr>
                <tr>
                  <th colSpan={4}>Всего</th>
                  <th colSpan={1}>
                    <Text type="danger">{money}p</Text>
                  </th>
                  <th colSpan={1}>
                    <Text>x{tickets}</Text>
                  </th>
                  <td colSpan={2}/>
                </tr>
              </>
            );
          }}
        />
      </Wrapper>
    )
  }
}

export default Orders;
