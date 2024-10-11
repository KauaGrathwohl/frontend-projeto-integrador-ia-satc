import React from 'react';
import { Col, Row } from 'antd';

export default function Screen({ children }) {

  return (
    <Row justify='space-around'
      align='middle'>
      <Col span={23}
        style={{ padding: '16px' }}>
        {children}
      </Col>
    </Row>
  );
}