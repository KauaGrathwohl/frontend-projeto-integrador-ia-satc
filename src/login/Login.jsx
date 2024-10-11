import React from 'react';
import { Button, Col, Form, Input, Row, notification } from 'antd';
import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/auth';
import { usuarios } from '../usuario/Usuario';
import './login.css';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const [form] = Form.useForm();
  const { user, setUser } = useAuth();

  const handleSubmit = (user) => {
    const userDB = usuarios.find((userDB) => {
      return userDB.login === user.usuário && userDB.senha === user.senha;
    });

    if (!userDB) {
      notification.error({
        message: 'Erro!',
        description: 'Login inválido',
      });

      return;
    }

    setUser({ ...userDB, senha: null });
  }

  if (user) {
    return (
      <Navigate replace
        to={{ pathname: '/dashboard' }} />
    );
  }

  return (
    <Row justify='center'
      align='middle'
      className='login'>
      <Col>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Row gutter={[10, 0]}
            justify='center'
            className='login-card'>
            <Col span={24}
              className='login-title'>
              Nutrysis
            </Col>
            <Col span={24}
              className='login-subtitle'>
              Informe seus dados no formulário abaixo para acessar o sistema.
            </Col>
            <Col span={24}>
              <Form.Item name='usuário'
                label='Usuário'
                rules={[{ required: true, message: 'Informe o usuário' }]}>
                <Input placeholder='Informe o usuário'
                  prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='senha'
                label='Senha'
                rules={[{ required: true, message: 'Informe a senha' }]}>
                <Input.Password placeholder='Informe a senha'
                  onPressEnter={form.submit}
                  prefix={<UnlockOutlined />} />
              </Form.Item>
            </Col>
            <Col xl={8}
              lg={9}
              md={8}
              sm={7}
              xs={24}>
              <Button block
                type='primary'
                style={{ backgroundColor: '#65BE8E', borderColor: '#65BE8E' }}
                onClick={form.submit}>
                Entrar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}