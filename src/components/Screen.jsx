import React from 'react';
import { Col, Row } from 'antd';

export default function Screen({ children }) {

  return (
    <Row justify='center'>
      <Col span={23}>
        {children}
      </Col>
    </Row>
  );
}