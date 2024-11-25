import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, Button, InputNumber, Checkbox, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import request from '../../utils/request';

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredientes, setIngredientes] = useState([{ unidade: 'u'}]);
  const [form] = Form.useForm();
  const [gerarModoPreparoIA, setGerarModoPreparoIA] = useState(false);
  const [isDisabledCalculoIa, setIsDisabledCalculoIa] = useState(true);

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
    setIngredientes([...ingredientes, { unidade: 'ml' }]);
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

  const handleOnChangeCheckbox = (e) => {
    if (!e.target.checked && !form.getFieldValue('preparo').length) {
      setIsDisabledCalculoIa(true);
    } else if (!e.target.checked && form.getFieldValue('preparo').length) {
      setIsDisabledCalculoIa(false);
    } else if (e.target.checked) {
      setIsDisabledCalculoIa(false);
    }
    setGerarModoPreparoIA(e.target.checked);
  }

  const handleOnChangeModoPreparo = () => {
    if (!gerarModoPreparoIA && !form.getFieldValue('preparo').length) {
      setIsDisabledCalculoIa(true);
    } else if (!gerarModoPreparoIA && form.getFieldValue('preparo').length) {
      setIsDisabledCalculoIa(false);
    } else if (gerarModoPreparoIA) {
      setIsDisabledCalculoIa(false);
    }
  }

  const handleCalculoIA = () => {
    const values = form.getFieldsValue();

    console.log(gerarModoPreparoIA)
    const payload = {
      nome: values.nome,
      gerarModoPreparo: gerarModoPreparoIA,
      ingredientes: ingredientes.map((ingrediente) => ({
        nome: ingrediente.ingrediente,
        quantidade: ingrediente.quantidade,
        unidade: ingrediente.unidade,
      })),
      modoPreparo: values.preparo,
      gramasPorPorcao: values.gramas
    };

    setLoading(true);
    let url = '/receita/calcular';

    request(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        setLoading(false);

        const updatedFields = {
          proteinas: response.macronutrientes.proteinas,
          gorduras: response.macronutrientes.gorduras,
          carboidratos: response.macronutrientes.carboidratos,
          calorias: response.macronutrientes.calorias,
        };

        if (gerarModoPreparoIA) {
          updatedFields.preparo = response.modoPreparo;
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
              <Button key="calculoIA" type="default" onClick={handleCalculoIA} disabled={isDisabledCalculoIa}>
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
            </Row>
          ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]} justify="left">
              <Col span={24} style={{ marginBottom: 10 }}>
                <Form.Item name="nome" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input placeholder="Nome" />
                </Form.Item>
              </Col>
              <Col style={{ fontSize: 20, fontWeight: 'bold', opacity: 0.8 }}>
                Ingredientes:
              </Col>
              {ingredientes.map((el, i) => (
                  <Col key={i} span={24}>
                    <Row gutter={[10, 5]}>
                      <Col span={14}>
                        <Form.Item name={`ingrediente-${i}`} rules={[{ required: true, message: 'Campo obrigatório' }]}>
                          <Input
                              placeholder="Ingrediente"
                              value={el.ingrediente}
                              onChange={(e) =>
                                  changeIngrediente(e.target.value, 'ingrediente', i)
                              }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item name={`quantidade-${i}`} rules={[{ required: true, message: 'Campo obrigatório' }]}>
                          <InputNumber
                              placeholder="Qtd."
                              value={el.quantidade}
                              style={{ width: '100%' }}
                              onChange={(value) =>
                                  changeIngrediente(value, 'quantidade', i)
                              }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Select
                          value={el.unidade}
                          onChange={(e) => changeIngrediente(e, 'unidade', i)}
                          style={{ width: 120 }}
                          options={[
                            { value: 'u', label: 'Unidade' },
                            { value: 'ml', label: 'ml' },
                            { value: 'g', label: 'g' }
                          ]}
                        />
                      </Col>
                      <Col span={1}>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            disabled={ingredientes.length === 1}
                            onClick={() => removeIngrediente(i)}
                        />
                      </Col>
                    </Row>
                  </Col>
              ))}

              <Col style={{ marginTop: 10 }} offset={9}>
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
                        onChange={(e) => handleOnChangeCheckbox(e)}
                    >
                      Gerar modo de preparo por IA
                    </Checkbox>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Form.Item name="preparo" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Input.TextArea rows={10} disabled={gerarModoPreparoIA} onChange={() => handleOnChangeModoPreparo()}/>
                </Form.Item>
              </Col>

              <Row gutter={[21, 10]} justify="space-between">
                <Col span={6}>
                  <Form.Item name="proteinas" label="Proteínas (g)" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="gorduras" label="Gorduras (g)" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="carboidratos" label="Carboidratos (g)" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="calorias" label="Calorias (kcal)" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="gramas" label="Gramas por Porção (g)" rules={[{ required: true, message: 'Campo obrigatório' }]}>
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