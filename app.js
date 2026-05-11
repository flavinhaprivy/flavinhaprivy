const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');
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
            body: JSON.stringify({ email: email })
        });

        const resultado = await response.json();

        // Verificamos se a URL existe e se não é o nosso link de erro de exemplo
        if (resultado.url_checkout && !resultado.url_checkout.includes("erro")) {
            window.location.href = resultado.url_checkout;
        } else {
            console.error("Dados do n8n:", resultado);
            alert("O link de pagamento ainda não foi gerado. Verifique se o nó do Nexus no n8n está configurado corretamente.");
            resetBtn();
        }
    } catch (error) {
        alert("Erro de conexão com o servidor n8n.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
