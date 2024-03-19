const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para tratar requisições JSON
app.use(express.json());

// Middleware CORS
app.use(cors());

// Informações sobre o criador da API
const criadorDaApi = 'Místico';

// Rota de documentação
app.get('/', (req, res) => {
  res.send(`Documentação da API criada por ${criadorDaApi}`);
});

// Rota para consulta de CEP
app.get('/consulta_cep/:cep', async (req, res) => {
  try {
    const cep = req.params.cep.replace(/\D/g, '');

    if (cep.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const viaCepUrl = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await axios.get(viaCepUrl);
    const data = response.data;

    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }

    const { logradouro, bairro, localidade, uf } = data;

    res.json({
      criador: criadorDaApi,
      cep: data.cep,
      logradouro,
      bairro,
      localidade,
      uf
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para gerar link compartilhável
app.post('/gerar_link', (req, res) => {
  // Lógica para gerar link com base nos dados recebidos em req.body
  const linkGerado = 'https://seusite.com/link/123'; // Substitua pelo código real de geração de link
  res.json({ link: linkGerado });
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erro genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
