import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, Button, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredientes, setIngredientes] = useState([]);
  const [form] = Form.useForm();

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (id) {
      fetch();
    }
  }

  const fetch = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    request(`/receita/${id}`, {
      method: 'GET',
    }).then(({ ingredientes, ...data }) => {
      setLoading(false);
      setIngredientes(ingredientes || []);
      form.setFieldsValue(data);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err,
      });
    });
  }

  const handleSubmit = (values) => {
    setLoading(true);

    let url = '/receita';

    if (id) {
      url += `/${id}`;
    }

    request(url, {
      method: id ? 'PUT' : 'POST',
      body: { ...values, ingredientes, id },
    }).then(() => {
      setLoading(false);
      handleClear();
      onClose?.();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err,
      });
    });
  }

  const handleClear = () => {
    form.resetFields();
    setLoading(false);
    setVisible(false);
    setIngredientes([]);
  }

  const addIngrediente = () => {
    setIngredientes([...ingredientes, {}]);
  }

  const changeIngrediente = (value, key, index) => {
    const nIngredientes = [...ingredientes];

    nIngredientes[index][key] = value;

    setIngredientes([...nIngredientes]);
  }

  const removeIngrediente = (index) => {
    const nIngredientes = [...ingredientes];

    nIngredientes.splice(index, 1);

    setIngredientes([...nIngredientes]);
  }

  return (
    <span>
      <span onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal open={visible}
        title='Cadastro de Receita'
        okText='Salvar'
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}
        width={850}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}
              justify='center'>
              <Col span={24}
                style={{ marginBottom: 10 }}>
                <Form.Item name='nome'>
                  <Input placeholder='Nome' />
                </Form.Item>
              </Col>
              {ingredientes.map((el, i) => (
                <Col key={i}
                  span={24}>
                  <Row gutter={[10, 5]}>
                    <Col span={14}>
                      <Input placeholder='Ingrediente'
                        value={el.ingrediente}
                        onChange={(e) => changeIngrediente(e.target.value, 'ingrediente', i)} />
                    </Col>
                    <Col span={5}>
                      <InputNumber placeholder='Qtd.'
                        value={el.quantidade}
                        style={{ width: '100%' }}
                        onChange={(value) => changeIngrediente(value, 'quantidade', i)} />
                    </Col>
                    <Col span={4}>
                      <Input placeholder='UN'
                        maxLength={2}
                        value={el.unidade}
                        onChange={(e) => changeIngrediente(e.target.value, 'un', i)} />
                    </Col>
                    <Col span={1}>
                      <Button danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeIngrediente(i)} />
                    </Col>
                  </Row>
                </Col>
              ))}
              <Col style={{ marginTop: 10 }}>
                <Button onClick={addIngrediente}>
                  Adicionar Ingrediente
                </Button>
              </Col>
              <Col span={24}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  opacity: 0.8,
                }}>
                Modo de Preparo
              </Col>
              <Col span={24}>
                <Form.Item name='preparo'>
                  <Input.TextArea rows={10} />
                </Form.Item>
              </Col>
              <Col span={24}
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  opacity: 0.8,
                  marginTop: 10,
                }}>
                Informações Nutricionais
              </Col>
              <Col span={5}>
                <Form.Item name='gramas'
                  label='Gramas por Porção'>
                  <InputNumber min={0}
                    precision={0}
                    suffix='g'
                    controls={false}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item name='tipo'
                  label='Tipo de Refeição'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}