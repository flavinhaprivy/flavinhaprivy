const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// URL DO SEU WEBHOOK (Certifique-se de estar no modo 'Execute' ou use a URL de Production)
const URL_WEBHOOK = 'https://flavinhaprivy.app.n8n.cloud/webhook-test/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        alert("Por favor, insira um e-mail válido.");
        emailInput.focus();
        return;
    }

    btn.innerText = "GERANDO PIX...";
    btn.disabled = true;

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify({
                email: email,
                produto: "Assinatura Nexus"
            })
        });

        if (!response.ok) throw new Error("Erro na conexão com o n8n.");

        const resultado = await response.json();

        // O n8n entrega o código Pix na chave 'url_checkout'
        if (resultado.url_checkout) {
            const pixCopiaCola = resultado.url_checkout;

            // 1. Tenta copiar automaticamente para a área de transferência
            try {
                await navigator.clipboard.writeText(pixCopiaCola);
                alert("✅ PIX GERADO!\n\nO código 'Copia e Cola' foi copiado para sua área de transferência. Basta colar no seu banco.");
            } catch (err) {
                // Caso o navegador bloqueie a cópia automática, mostra o código em um prompt
                window.prompt("Copia e Cola gerado! Copie o código abaixo para pagar no seu banco:", pixCopiaCola);
            }

            resetBtn();
        } else {
            alert("Erro: O Nexus não enviou o código Pix. Verifique o fluxo no n8n.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro detalhado:", error);
        alert("Falha ao conectar com o servidor. Verifique se o n8n está em execução.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
