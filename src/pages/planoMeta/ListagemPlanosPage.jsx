import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Input, Form, Modal, Card, notification, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import DatePicker from '../../components/DatePicker';
import request from '../../utils/request';
import ListagemReceitas from './ListagemReceitas';

export default function ListagemPlanosPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [receitas, setReceitas] = useState([]);
    const [planoMeta, setPlanoMeta] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchPlanoMeta();
    }, []);

    const fetchReceitas = () => {
        setLoading(true);
        notification.open({
            message: 'Aguarde',
            description: 'Buscando receitas...',
            icon: <LoadingOutlined />,
            duration: 0,
        });

        request(`/plano-meta/${id}/gerar`, {
            method: 'POST',
        })
            .then((data) => {
                notification.destroy();
                setLoading(false);
                setReceitas(data);
            })
            .catch((err) => {
                notification.destroy();
                setLoading(false);
                Modal.error({
                    title: 'Erro ao buscar receitas!',
                    content: err,
                });
            });
    };

    const fetchPlanoMeta = () => {
        request(`/plano-meta/${id}/detalhes`, {
            method: 'GET',
        })
            .then((data) => {
                setPlanoMeta(data);
                fetchReceitas();
            })
            .catch((err) => {
                Modal.error({
                    title: 'Erro ao buscar plano!',
                    content: err.message,
                });
            });
    }

    const handleSubmit = () => {
        setSaving(true);

        const body = {
            idPlano: id,
            planoGeradoDto: receitas,
        };

        request('/plano-meta', {
            method: 'PUT',
            body,
        }).then(() => {
            setSaving(false);
            Modal.success({
                title: 'Sucesso!',
                content: 'O plano foi salvo com sucesso, deseja retornar a tela de pacientes?',
                onOk: () => navigate('/app/pacientes'),
            });
        }).catch((err) => {
            setSaving(false);
            Modal.error({
                title: 'Erro ao salvar plano!',
                content: err.message,
            });
        })
    }

    return (
        <Row gutter={[10, 20]} style={{ padding: 20 }}>
            <Col span={24}>
                <Card title='Listagem de Planos'>
                    <Form layout="vertical">
                        <Row gutter={[16, 16]}>
                            <Col span={4}>
                                <Form.Item label="Data Inicial">
                                    <DatePicker placeholder="Data Inicial" style={{ width: '100%' }} value={planoMeta.dtInicioMeta} />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="Data Final">
                                    <DatePicker placeholder="Data Final" style={{ width: '100%' }} value={planoMeta.dtFinalMeta} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Card size='small' title='Informações Nutricionais Diárias'>
                            <Row gutter={[16, 16]}>
                                <Col span={4}>
                                    <Form.Item label="Calorias">
                                        <Input placeholder="Calorias" type="number" value={planoMeta.qtdDiariaCalorias} />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item label="Carboidratos">
                                        <Input placeholder="Carboidratos" type="number" value={planoMeta.qtdDiariaCarboidratos} />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item label="Gordura">
                                        <Input placeholder="Gordura" type="number" value={planoMeta.qtdDiariaGordura} />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item label="Proteína">
                                        <Input placeholder="Proteína" type="number" value={planoMeta.qtdDiariaProteina} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Card>
            </Col>
            <Col span={24}>
                <Card title='Receitas Cadastradas' loading={loading}>
                    <ListagemReceitas data={receitas} />
                </Card>
            </Col>
            <Col span={3} offset={21}>
                <Button block disabled={false} type='primary' onClick={handleSubmit}>
                    Salvar
                </Button>
            </Col>
        </Row>
    );
}