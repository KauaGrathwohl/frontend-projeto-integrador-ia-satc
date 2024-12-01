import React, { useEffect, useState } from 'react';
import { Row, Col, Input, DatePicker, Form, Card, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import request from '../../utils/request';

export default function ListagemPlanosPage() {
    const [loading, setLoading] = useState(false);
    const [receitas, setReceitas] = useState([]);
    const location = useLocation();
    const planoData = location.state?.planoData || {};

    useEffect(() => {
        fetchReceitas();
    }, []);

    const fetchReceitas = () => {
        setLoading(true);
        request('/receitas', {
            method: 'GET',
        })
            .then((data) => {
                setLoading(false);
                setReceitas(data);
            })
            .catch((err) => {
                setLoading(false);
                console.error('Erro ao buscar receitas:', err);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Listagem de Planos</h2>
            <Form layout="vertical" initialValues={planoData}>
                <Row gutter={[16, 16]}>
                    <Col span={4}>
                        <Form.Item
                            name="dtInicial"
                            label="Data Inicial"
                            rules={[{ required: true, message: 'Campo obrigatório' }]}
                        >
                            <DatePicker placeholder="Data Inicial" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="dtFinal"
                            label="Data Final"
                            rules={[{ required: true, message: 'Campo obrigatório' }]}
                        >
                            <DatePicker placeholder="Data Final" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <h2>Informações Nutricionais Diárias:</h2>
                <Row gutter={[16, 16]}>
                    <Col span={4}>
                        <Form.Item
                            name="qtdDiariaCalorias"
                            label="Calorias"
                            rules={[{ required: true, message: 'Campo obrigatório' }]}
                        >
                            <Input placeholder="Calorias" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="qtdDiariaCarboidratos"
                            label="Carboidratos"
                            rules={[{ required: true, message: 'Campo obrigatório' }]}
                        >
                            <Input placeholder="Carboidratos" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="qtdDiariaGordura"
                            label="Gordura"
                            rules={[{ required: true, message: 'Campo obrigatório' }]}
                        >
                            <Input placeholder="Gordura" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="qtdDiariaProteina"
                            label="Proteína"
                            rules={[{ required: true, message: 'Campo obrigatório' }]}
                        >
                            <Input placeholder="Proteína" type="number" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <h2>Receitas Cadastradas:</h2>
        </div>
    );
}