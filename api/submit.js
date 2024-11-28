const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const WEBHOOK_URL = ``;
const TIMEOUT_DURATION = 60000;
const IP_REQUESTS = {};

app.use(express.static(path.join(__dirname, './../public/')));

app.use(express.json());

app.post('/api/submit', async (req, res) => {
    const { nome, email, mensagem, ip } = req.body;

    if (!nome || !email || !mensagem || !ip) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        return;
    }

    const now = Date.now();
    if (IP_REQUESTS[ip] && now - IP_REQUESTS[ip] < TIMEOUT_DURATION) {
        res.status(429).json({ error: 'Você está enviando mensagens muito rápido. Tente novamente mais tarde.' });
        return;
    }

    IP_REQUESTS[ip] = now;

    const data = {
        content: `**Nome do Discord:** ${nome}\n**Email:** ${email}\n**Mensagem:** ${mensagem}`
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            res.status(200).json({ message: 'Formulário enviado com sucesso!' });
        } else {
            const errorText = await response.text();
            console.error('Erro na resposta do webhook:', response.status, errorText);
            res.status(500).json({ error: 'Erro ao enviar o formulário.', details: errorText });
        }
    } catch (error) {
        console.error('Erro ao enviar para o webhook:', error);
        res.status(500).json({ error: 'Erro ao enviar o formulário.', details: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
