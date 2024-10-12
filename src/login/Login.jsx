import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, notification } from 'antd';
import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';

export default function Login() {
  const [form] = Form.useForm();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('/auth/login', {
        usuario: values.usuario,
        senha: values.senha,
      });

      if (response.status === 200) {
        const { token } = response.data;
        setUser({ token });
        notification.success({
          message: 'Sucesso!',
          description: 'Login realizado com sucesso',
        });

        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      notification.error({
        message: 'Erro!',
        description: error.response?.data?.message || 'Falha na autenticação',
      });
      form.resetFields();
    }
  };

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
                  prefix={<UserOutlined />}
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