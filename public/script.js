async function getIP() {
  const response = await fetch('https://api64.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

document.getElementById('discordForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const nome = document.querySelector('input[name="Nome"]').value;
  const email = document.querySelector('input[name="Email"]').value;
  const mensagem = document.querySelector('textarea[name="Menssagem"]').value;

  const ip = await getIP();

  const webhookURL = '/api/submit';

  const data = {
      nome: nome,
      email: email,
      mensagem: mensagem,
      ip: ip
  };

  try {
      const response = await fetch(webhookURL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
          window.location.href = 'success.html';
      } else {
          alert(`Erro ao enviar o formulário: ${result.error}\nDetalhes: Aguarde 1 minuto e tente novamente.`);
      }
  } catch (error) {
      alert(`Erro ao enviar o formulário: ${error.message}`);
  }
});