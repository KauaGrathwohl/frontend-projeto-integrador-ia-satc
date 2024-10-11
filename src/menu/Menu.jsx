import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as AntMenu } from 'antd';
import { useAuth } from '../context/auth';
import Screen from '../components/Screen';

export default function Menu() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const items = [
    { key: '/dashboard', label: 'Dashboard' },
    { key: '/', label: 'Sair', style: { marginLeft: 'auto' }, onClick: () => setUser(null) },
  ];

  useEffect(() => {
    if (selected?.includes('/')) {
      navigate(selected);
    }
  }, [selected]);

  return (
    <Screen>
      <AntMenu
        items={items}
        mode='horizontal'
        selectedKeys={[selected]}
        onSelect={(e) => setSelected(e?.key)}
        style={{ lineHeight: '30px', background: 'transparent', border: 'none' }}
      />
    </Screen>
  );
}