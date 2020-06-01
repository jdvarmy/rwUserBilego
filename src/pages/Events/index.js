import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import styled from 'styled-components';

import { round } from '../../components/functions';
import { Table, Input, DatePicker, Button, Typography, PageHeader, Menu, Dropdown, Modal } from 'antd';
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
import 'antd/es/menu/style/css';
import 'antd/es/dropdown/style/css';
import 'antd/es/modal/style/css';
import 'antd/es/typography/style/css';

const Orders = styled.div`
  margin: ${css.sizes.xs} 0;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
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

  @observable modal = {
    title: null,
    link: null,
    visible: null,
  };
  @action setModal = (val) => {
    this.modal = val;
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSearchBase = (selectedKeys) => {
    const { eventsStore:{ setFilter } } = this.props;
    setFilter(selectedKeys);
  };

  xlsxFileName = () => {
    const { filters: {startDate, endDate} } = this.props.eventsStore,
      format = 'DD/MM/YYYY';

    return startDate && endDate
      ? `События с ${startDate.format(format)} по ${endDate.format(format)}-bilego`
      : !startDate && endDate
        ? `События по ${endDate.format(format)}-bilego`
        : startDate && !endDate
          ? `События с ${startDate.format(format)}-bilego`
          : `События с ${moment().format(format)}-bilego`
  };
  xlsxFileData = () => {
    const { response } = this.props.eventsStore;

    return response.map(event => {
      return {
        'ID события': event.id,
        'Название': event.title,
        'Сумма всех заказов': event.total_cur,
        'Кол-во всех заказов': event.total_quantity,
        'Сумма выполненых заказов': event.total_cur_completed,
        'Кол-во выполненых заказов': event.total_quantity_completed,
        'Сумма возмещения': 0,
        'Комиссия': 0,
        'Место': event.item_title,
        'Дата': event.date2,
        'Время': event.time,
        'Возраст': event.age,
      }
    });
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
        title: 'Управление',
        key: 'orders',
        width: '5%',
        render: (data) => {
          const { ordersInfo } = data;
          let csvData = [];

          Object.keys(ordersInfo).map( key =>{
            const items = ordersInfo[key].line_items,
              order = {
                id: ordersInfo[key].id,
                orderKey: ordersInfo[key].order_key,
                status: ordersInfo[key].status,
                date: ordersInfo[key].date,
                customerEmail: ordersInfo[key].billing_address.email,
                customerIp: ordersInfo[key].customer_ip,
                totalOrderCur: ordersInfo[key].total_cur,
                totalOrderQua: ordersInfo[key].total_quantity,
                currency: ordersInfo[key].currency,
                eventTitle: ordersInfo[key].event.title
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
                    'Check in': 'no', //a.check_in, todo: нужно программировать
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

          console.log(data)
          const menu = (
            <Menu>
              <Menu.Item key="1" onClick={() => ExportCSV(csvData, `Отчет по билетам ${data.event} bilego`)}>
                Скачать отчет по билетам
              </Menu.Item>
              <Menu.Item key="2" onClick={() => this.setModal({title: `Iframe для продажи билетов события ${data.event}`, link: data.ticketLink, visible: true})}>Сформировать Iframe билетов</Menu.Item>
            </Menu>
          );
          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Orders><SolutionOutlined /></Orders>
            </Dropdown>
          )
        }
      }
    ];

    return (
      <div>
        <PageHeader
          title="Отчет по событиям"
          className="site-page-header"
          subTitle="просмотр ваших событий"
          extra={[
            <Button key="2" onClick={clearFilters}>Очистить фильтры</Button>,
            <Button key="1" type="primary" onClick={() => ExportCSV(this.xlsxFileData(), this.xlsxFileName())}>Скачать отчет</Button>
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
                    <Text>{complitedMoney}p</Text>
                  </th>
                  <th>
                    <Text>{money}p</Text>
                  </th>
                  <td/>
                </tr>
              </>
            );
          }}
        />
        <Modal
          title={this.modal.title}
          visible={this.modal.visible}
          footer={null}
          onCancel={() => this.setModal({title: null, link: null, visible: null})}
        >
          <Typography>Скопируйте ссылку ниже и вставьте в любое место Вашего сайта:</Typography>
          <Input.TextArea style={{height: '90px'}} value={'<iframe src="' + this.modal.link + '" width="100%" height="645px"></iframe>'}></Input.TextArea>
        </Modal>
      </div>
    )
  }
}

export default Events;
