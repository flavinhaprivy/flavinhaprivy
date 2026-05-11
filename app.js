const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// SUA NOVA URL DO N8N CLOUD
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

    const dadosVenda = {
        produto: "Assinatura Nexus",
        email: email,
        origem: "Landing_Page",
        data: new Date().toISOString()
    };

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            mode: 'cors', 
            body: JSON.stringify(dadosVenda)
        });

        // Como você configurou "When Last Node Finishes", o n8n vai esperar todo o fluxo
        const resultado = await response.json();

        if (resultado.url_checkout) {
            window.location.href = resultado.url_checkout;
        } else {
            console.error("Resposta do n8n:", resultado);
            alert("Erro: O n8n não retornou o campo 'url_checkout'. Verifique o último nó do seu workflow.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Falha ao conectar com o n8n. Verifique se você clicou em 'Execute Workflow' antes de testar.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
