import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { UserOutlined, LockOutlined, LoadingOutlined, RightCircleOutlined } from '@ant-design/icons';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

import theme from '../../theme';
import image from './img/image.jpg';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  .bg-img-holder.section-image{
    background-image: url(${image});
    z-index: 1;
  }
  .btn.btn-primary.btn-block{
    svg{
      vertical-align: baseline;
      margin-right: ${theme.sizes.base};
    }
  }
`;

@withRouter
@inject('securityStore')
@observer
class Login extends React.Component{
  @observable email = '';
  @observable pass = '';
  @observable message = null;

  @observable invalidEmail = false;
  @observable invalidPass = false;

  @action
  handleChange = (event) => {
    this[event.target.name] = event.target.value;
  };
  @action
  setMessage = message => {
    this.message = message
  };

  @action
  handleSubmit = async (e) => {
    e.preventDefault();
    const { securityStore, history } = this.props;

    this.email === '' ? this.invalidEmail = true : this.invalidEmail = false;
    this.pass === '' ? this.invalidPass = true : this.invalidPass = false;
    if(this.email === '' || this.pass === ''){
      return false;
    }

    if (!securityStore.updatingUser) {
      try {
        await securityStore.login(this.email, this.pass);
        history.push(`/${securityStore.user.nicename}`);
      } catch (error) {
        this.handleErrors(error, {email: this.email, password: this.pass});
      }
    }
  };

  handleErrors = (error, values) => {
    const message = error.message || "Проверьте правильность ввода Email и Пароля";

    this.setMessage(message);
  };

  render() {
    const { securityStore:{updatingUser} } = this.props;

    return (
      <Wrapper>
        <div className="login__form-container">
          <section className="min-vh-100 d-flex align-items-center">
            <div className="bg-img-holder section-image top-0 left-0 col-lg-6 col-xl-7 z-10 vh-100 d-none d-lg-block" />
            <div className="container-fluid py-5">
              <div className="row align-items-center">
                <div className="col-sm-10 col-lg-6 col-xl-5 mx-auto mr-lg-0">
                  <div className="px-1 px-xl-6">
                    <div>
                      <div className="text-left text-sm-center">
                        <h1>Вход</h1>
                      </div>
                      <Form>
                        <Form.Group controlId="formBasicEmail">
                          <InputGroup>
                            <InputGroup.Prepend>
                              <InputGroup.Text>
                                <UserOutlined />
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                              name="email"
                              type="email"
                              placeholder="Введите email"
                              onChange={this.handleChange}
                              value={this.email}
                              isInvalid={this.invalidEmail}
                            />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                          <InputGroup>
                            <InputGroup.Prepend>
                              <InputGroup.Text>
                                <LockOutlined />
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                              name="pass"
                              type="password"
                              placeholder="Пароль"
                              onChange={this.handleChange}
                              value={this.pass}
                              isInvalid={this.invalidPass}
                            />
                          </InputGroup>
                        </Form.Group>
                        <Button variant="primary" block type="submit" onClick={this.handleSubmit}>
                          {updatingUser ? <LoadingOutlined /> : <RightCircleOutlined />}
                          Войти
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Wrapper>
    )
  }
}

export default Login;
