import React from 'react';
import {inject, observer} from 'mobx-react';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// /chart/ticketsToMonth

@inject('chartStore')
@observer
class Events extends React.PureComponent{
  componentDidMount() {
    const { chartStore: {getTicketsToMonth} } = this.props;
    getTicketsToMonth();
  }

  render() {
    const { chartStore: {dataTicketsToMonth} } = this.props;

    // todo создать массив с цветами для блоков. подобрать красивые и правильные цвета

    return (
      <div className="site-layout-background bilego" style={{padding: 24}}>
        {dataTicketsToMonth
          ? <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataTicketsToMonth.data}
                      margin={{top: 20, right: 30, left: 20, bottom: 5}}>
              {/*<CartesianGrid strokeDasharray="3 3"/>*/}
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              {dataTicketsToMonth.concerts.map((el, k)=>{
                console.log(dataTicketsToMonth.concerts)
                return <Bar dataKey={el} key={k} stackId="a" fill={'#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase()}/>
              })}
            </BarChart>
          </ResponsiveContainer>
          : 'loading'
        }
      </div>
    )
  }
}

export default Events;
