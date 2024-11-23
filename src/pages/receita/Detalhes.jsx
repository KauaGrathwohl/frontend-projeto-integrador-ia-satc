import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, Button, InputNumber, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredientes, setIngredientes] = useState([]);
  const [form] = Form.useForm();
  const [gerarModoPreparoIA, setGerarModoPreparoIA] = useState(false);

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (id) {
      fetch();
    }
  };

  const fetch = () => {
    if (!id) return;

    setLoading(true);

    request(`/receita/${id}`, {
      method: 'GET',
    })
        .then(({ ingredientes, ...data }) => {
          setLoading(false);
          setIngredientes(ingredientes || []);
          form.setFieldsValue(data);
        })
        .catch((err) => {
          setLoading(false);
          Modal.error({
            title: 'Erro!',
            content: err,
          });
        });
  };

  const handleSubmit = (values) => {
    setLoading(true);

    let url = '/receita';
    if (id) url += `/${id}`;

    request(url, {
      method: id ? 'PUT' : 'POST',
      body: { ...values, ingredientes, id },
    })
        .then(() => {
          setLoading(false);
          handleClear();
          onClose?.();
        })
        .catch((err) => {
          setLoading(false);
          Modal.error({
            title: 'Erro!',
            content: err,
          });
        });
  };

  const handleClear = () => {
    form.resetFields();
    setLoading(false);
    setVisible(false);
    setIngredientes([]);
    setGerarModoPreparoIA(false);
  };

  const addIngrediente = () => {
    setIngredientes([...ingredientes, {}]);
  };

  const changeIngrediente = (value, key, index) => {
    const nIngredientes = [...ingredientes];
    nIngredientes[index][key] = value;
    setIngredientes([...nIngredientes]);
  };

  const removeIngrediente = (index) => {
    const nIngredientes = [...ingredientes];
    nIngredientes.splice(index, 1);
    setIngredientes([...nIngredientes]);
  };

  const handleCalculoIA = () => {
    const values = form.getFieldsValue();

    const payload = {
      nome: values.nome,
      ingredientes: ingredientes.map((ingrediente) => ({
        nome: ingrediente.ingrediente,
        quantidade: ingrediente.quantidade,
        unidade: ingrediente.unidade,
      })),
      preparo: values.preparo,
      gramasPorPorcao: values.gramas,
      tipoRefeicao: values.tipo,
    };

    setLoading(true);

    request('https://run.mocky.io/v3/c3e6ba05-74fc-40e3-bb3c-14fd2faba708', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          setLoading(false);

          const updatedFields = {
            proteinas: response.macros.proteinas,
            gorduras: response.macros.gorduras,
            carboidratos: response.macros.carboidratos,
            calorias: response.macros.calorias,
          };

          if (gerarModoPreparoIA) {
            updatedFields.preparo = response.preparo;
            updatedFields.gramas = response.gramasPorPorcao;
          }
          form.setFieldsValue(updatedFields);
        })
        .catch((error) => {
          setLoading(false);
          Modal.error({
            title: 'Erro ao calcular os dados',
            content: 'Ocorreu um erro ao processar a receita. Tente novamente.',
          });
        });
  };

  return (
      <span>
      <span onClick={modal} style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal
          open={visible}
          title="Cadastro de Receita"
          okText="Salvar"
          centered
          destroyOnClose
          onCancel={handleClear}
          onOk={form.submit}
          width={850}
          footer={[
            <Row justify="space-between" style={{ width: '100%' }}>
              <Button key="calculoIA" type="default" onClick={handleCalculoIA}>
                Cálculo IA
              </Button>
              <div>
                <Button key="cancel" onClick={handleClear} style={{ marginRight: 20 }}>
                  Cancelar
                </Button>
                <Button key="submit" type="primary" onClick={form.submit}>
                  Salvar
                </Button>
              </div>
            </Row>,
          ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]} justify="center">
              <Col span={24} style={{ marginBottom: 10 }}>
                <Form.Item name="nome">
                  <Input placeholder="Nome" />
                </Form.Item>
              </Col>

              {ingredientes.map((el, i) => (
                  <Col key={i} span={24}>
                    <Row gutter={[10, 5]}>
                      <Col span={14}>
                        <Input
                            placeholder="Ingrediente"
                            value={el.ingrediente}
                            onChange={(e) =>
                                changeIngrediente(e.target.value, 'ingrediente', i)
                            }
                        />
                      </Col>
                      <Col span={5}>
                        <InputNumber
                            placeholder="Qtd."
                            value={el.quantidade}
                            style={{ width: '100%' }}
                            onChange={(value) =>
                                changeIngrediente(value, 'quantidade', i)
                            }
                        />
                      </Col>
                      <Col span={4}>
                        <Input
                            placeholder="UN"
                            maxLength={2}
                            value={el.unidade}
                            onChange={(e) =>
                                changeIngrediente(e.target.value, 'un', i)
                            }
                        />
                      </Col>
                      <Col span={1}>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeIngrediente(i)}
                        />
                      </Col>
                    </Row>
                  </Col>
              ))}

              <Col style={{ marginTop: 10 }}>
                <Button onClick={addIngrediente}>Adicionar Ingrediente</Button>
              </Col>

              <Col span={24} style={{ marginTop: 10 }}>
                <Row justify="space-between" align="middle">
                  <Col style={{ fontSize: 20, fontWeight: 'bold', opacity: 0.8 }}>
                    Modo de Preparo
                  </Col>
                  <Col>
                    <Checkbox
                        checked={gerarModoPreparoIA}
                        onChange={(e) => setGerarModoPreparoIA(e.target.checked)}
                    >
                      Gerar modo de preparo por IA
                    </Checkbox>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Form.Item name="preparo">
                  <Input.TextArea rows={10} />
                </Form.Item>
              </Col>

              <Row gutter={[21, 10]} justify="space-between">
                <Col span={6}>
                  <Form.Item name="proteinas" label="Proteínas (g)">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="gorduras" label="Gorduras (g)">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="carboidratos" label="Carboidratos (g)">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="calorias" label="Calorias (kcal)">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="gramas" label="Gramas por Porção (g)">
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}