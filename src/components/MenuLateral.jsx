import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Drawer, Menu, Row } from 'antd';
import { LogoutOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useAuth } from '../providers/AuthProvider';

export default function MenuLateral() {
  const [selectedKey, setSelectedKey] = useState('');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const itens = [
    {
      key: 'dashboard',
      label: 'Dashboard',
    },
    {
      key: 'pacientes',
      label: 'Pacientes',
    },
    {
      key: 'receitas',
      label: 'Receitas',
    },
    {
      key: 'sair',
      label: 'Sair',
      icon: <LogoutOutlined />,
      style: { color: 'red' },
    },
  ];

  useEffect(() => {
    if (!selectedKey) {
      setSelectedKey(window.location.pathname.substring(1));
    }
  }, []);

  const onSelect = (e) => {
    const { key } = e;

    if (key === 'sair') {
      auth.logout();
      navigate('/entrar');

      return;
    }

    setVisible(false);
    setSelectedKey(key);
    navigate(key);
  }

  return (
    <React.Fragment>
      <Row gutter={[10, 5]}
        justify='center'
        style={{
          background: '#65BE8E',
          padding: '10px 20px',
        }}>
        <Col span={24}>
          <Button size='large'
            style={{ margin: '10px 0px' }}
            onClick={() => setVisible(!visible)}
            icon={<UnorderedListOutlined />} />
        </Col>
        <Col style={{
          position: 'absolute',
          color: 'white',
          textAlign: 'center',
          fontSize: 40,
        }}>
          Nutrisys
        </Col>
      </Row>
      <Drawer closable={false}
        onClose={() => setVisible(false)}

        width={300}
        open={visible}
        placement='left'
        styles={{
          body: {
            padding: 0,
            backgroundColor: '#edf5ef',
          },
        }}>
        <Menu mode='vertical'
          items={itens}
          onSelect={onSelect}
          selectedKeys={[selectedKey]}
          style={{ backgroundColor: '#edf5ef', color: '#000' }} />
      </Drawer>
    </React.Fragment>
  );
}