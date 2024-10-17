import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Col, Form, Input, message, notification, Radio, Row } from 'antd';
import { MailOutlined, UnlockOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';

import './login.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const auth = useAuth();

  const handleSubmit = (values) => {
    setLoading(true);

    auth
      .login(values)
      .then(() => {
        setLoading(false);
        message.success('Login realizado com sucesso!');
      }).catch((err) => {
        setLoading(false);
        notification.error({
          message: 'Erro!',
          description: err,
        });
      });
  }

  if (auth.isAuthenticated()) {
    return (
      <Navigate to='/app/dashboard' />
    )
  }

  return (
      <Row justify='center' align='middle' className='login'>
        <Col>
          <Form form={form} layout='vertical' onFinish={handleSubmit}>
            <Row gutter={[10, 0]} justify='center' className='login-card'>
              <Col span={24} className='login-title'>
                Nutrysis
              </Col>
              <Col span={24} className='login-subtitle'>
                Informe seus dados no formulário abaixo para acessar o sistema.
              </Col>
              <Col span={24}>
                <Form.Item
                    name='usuario'
                    label='Usuário'
                    rules={[{ required: true, message: 'Informe o usuário' }]}
                >
                  <Input
                      placeholder='Informe o usuário'
                      prefix={<MailOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                    name='senha'
                    label='Senha'
                    rules={[{ required: true, message: 'Informe a senha' }]}
                >
                  <Input.Password
                      placeholder='Informe a senha'
                      onPressEnter={form.submit}
                      prefix={<UnlockOutlined />}
                      autoComplete='off'
                  />
                </Form.Item>
              </Col>
              <Col xl={8} lg={9} md={8} sm={7} xs={24}>
                <Button
                    block
                    type='primary'
                    loading={loading}
                    style={{ backgroundColor: '#65BE8E', borderColor: '#65BE8E' }}
                    onClick={form.submit}
                >
                  Entrar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
  );
}