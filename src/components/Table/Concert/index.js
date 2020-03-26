import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import css from '../../../theme';

const MedalIcon = styled.svg`
  width: ${css.sizes.lg};
  height: 100%;
  margin: auto 0;
`;
const Student = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: ${css.sizes.xl};
  margin: 0 -${css.sizes.base};
`;

@withRouter
class StudentList extends React.Component {
  render() {
    const {concert} = this.props;
    return <Student>
      {concert}
    </Student>;
  }
}

export default StudentList;
