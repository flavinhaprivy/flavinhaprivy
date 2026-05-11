const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// URL DO SEU N8N CLOUD
const URL_WEBHOOK = 'https://flavinhaprivy.app.n8n.cloud/webhook-test/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    btn.innerText = "PROCESSANDO...";
    btn.disabled = true;

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors', 
            body: JSON.stringify({
                produto: "Assinatura Nexus",
                email: email
            })
        });

        const resultado = await response.json();

        // O n8n precisa devolver a chave 'url_checkout'
        if (resultado.url_checkout) {
            window.location.href = resultado.url_checkout;
        } else {
            console.error("Resposta do n8n:", resultado);
            alert("Sucesso no n8n, mas o campo 'url_checkout' não foi encontrado. Verifique o nó final do seu fluxo.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Falha na conexão. Certifique-se de que o workflow está em execução no n8n.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
