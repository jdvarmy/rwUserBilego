import React from 'react';
import styled from 'styled-components';

import { Table } from 'antd';

const TableWithFixes = styled(Table)`
  .ui-table .ui-table__thead > tr > .ui-table__filter .ui-table__dropdown-filter {
    padding-right: 40px;
  }
  .ui-table-filter-dropdown__search {
    width: 100% !important;
  }
  padding-bottom: 80px;
  width: 100%;
`;

class Events extends React.Component{
  componentDidMount() {

  }

  render() {
    return (
      <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
        Bill is a cat.
      </div>
    )
  }
}

export default Events;
