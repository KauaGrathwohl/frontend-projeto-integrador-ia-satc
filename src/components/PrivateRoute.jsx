import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Col, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../providers/AuthProvider';
import App from '../App';


export default function PrivateRoute() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/entrar');
    }

    axios.interceptors.response.use((response) => response, (response) => {
      if (response.status === 401) {
        auth.logout();
        navigate('/entrar');
      }

      return Promise.reject(response);
    });
  }, []);


  return (
    <React.Fragment>
      <Suspense fallback={
        <Row justify='center'
          gutter={[15, 5]}
          align='middle'
          style={{ height: 'calc(100vh - 16px)' }}>
          <Col style={{ fontSize: 20 }}>
            <LoadingOutlined />
          </Col>
          <Col style={{ fontSize: 20 }}>
            Carregando
          </Col>
        </Row>
      }>
        <App />
      </Suspense>
    </React.Fragment>
  );
}