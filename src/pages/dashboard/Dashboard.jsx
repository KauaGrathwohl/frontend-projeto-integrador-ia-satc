import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal, Spin } from 'antd'; // Importa o Spinner (Spin)
import { useAuth } from '../../providers/AuthProvider';
import { useTitle } from '../../hooks/useTitle';
import request from "../../utils/request.js";

export default function Dashboard() {
  const auth = useAuth();
  const [pacientesCount, setPacientesCount] = useState(0);
  const [receitasCount, setReceitasCount] = useState(0);
  const [planosCount, setPlanosCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useTitle('Dashboard');

  useEffect(() => {
      if (auth.isAuthenticated()) {
          fetchPacientesCount();
          fetchReceitasCount();
          fetchPlanosCount();
      }
  }, [auth]);

  // Função para buscar a quantidade de pacientes cadastrados

  const fetchPacientesCount = () => {
    setLoading(true);
    request('/paciente/quantidade', {
      method: 'GET',
    })
        .then((data) => {
          setPacientesCount(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
          Modal.error({
            title: 'Erro',
            content: err.message || 'Erro ao buscar dados',
          });
        });
  };

  // Função para buscar a quantidade de receitas cadastradas

  const fetchReceitasCount = () => {
    setLoading(true);
    request('/receita/quantidade', {
      method: 'GET',
    })
        .then((data) => {
          setReceitasCount(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
          Modal.error({
            title: 'Erro',
            content: err.message || 'Erro ao buscar dados',
          });
        });
  }

  const fetchPlanosCount = () => {
      setLoading(true);

      request('/plano-meta/quantidade', {
            method: 'GET',
      })
          .then((data) => {
              setPlanosCount(data);
              setLoading(false);
          })
          .catch((err) => {
              setLoading(false);
              setError(err);
              Modal.error({
                  title: 'Erro',
                  content: err.message || 'Erro ao buscar dados',
              });
          });
  }

  if (!auth.isAuthenticated()) {
    return null;
  }

  return (
      <Row
          gutter={[16, 16]}
          justify="center"
          align="middle"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingLeft: '2%',
            paddingRight: '2%',
          }}
      >
        <Col xs={24} sm={12} md={6}>
          <Card
              title="Pacientes cadastrados"
              bordered={false}
              style={{
                textAlign: 'center',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
          >
            {loading ? (
                <Spin /> // Exibe um spinner enquanto a requisição está sendo processada
            ) : (
                <h2>{pacientesCount}</h2> // Exibe o número de pacientes
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
              title="Receitas cadastradas"
              bordered={false}
              style={{
                textAlign: 'center',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
          >
              {loading ? (
                  <Spin />
              ) : (
                  <h2>{receitasCount}</h2>
              )}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
              title="Planos cadastrados"
              bordered={false}
              style={{
                textAlign: 'center',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
          >
            <h2>{planosCount}</h2>
          </Card>
        </Col>
      </Row>
  );
}
