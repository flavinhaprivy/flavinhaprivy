const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// URL DO SEU N8N CLOUD (Ajustada conforme seu print)
const URL_WEBHOOK = 'https://flavinhaprivy.app.n8n.cloud/webhook-test/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        alert("Por favor, insira um e-mail válido.");
        emailInput.focus();
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

        if (!response.ok) throw new Error("Erro na resposta do servidor.");

        const resultado = await response.json();

        // O n8n precisa devolver a chave 'url_checkout'
        if (resultado.url_checkout) {
            window.location.href = resultado.url_checkout;
        } else {
            console.error("Dados recebidos:", resultado);
            alert("Sucesso! Mas o n8n não enviou o link de checkout. Verifique o nó final.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível conectar. Verifique se o workflow no n8n está em modo de execução.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
