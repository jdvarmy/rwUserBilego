import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import 'antd/es/form/style/css';
import 'antd/es/input/style/css';
import 'antd/es/button/style/css';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  align-content: center; 
  justify-content: center; 
  overflow: auto;
  .login__form-container{
    padding: 60px 60px 40px 60px;
    border: 1px solid white;
    form{
      width: 250px;
    }
  }
`;

@withRouter
@inject('securityStore')
@observer
class Login extends React.Component{
  componentDidMount() {

  }

  handleSubmit = () => {};

  render() {
    const { securityStore:{updatingUser} } = this.props,
      { Item } = Form;

    return (
      <Wrapper>
        <div className="login__form-container">
          <Form onSubmit={this.handleSubmit}>
            <Item
              name="username"
              rules={[{ required: true, message: 'Введите имя пользователя' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Имя пользователя"
              />
            </Item>
            <Item
              name="password"
              rules={[{ required: true, message: 'Введите пароль' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Пароль"
              />
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={updatingUser}
                className="login-form__button"
              >
                Войти
              </Button>
            </Item>
          </Form>
        </div>
      </Wrapper>
    )
  }
}

export default Login;
