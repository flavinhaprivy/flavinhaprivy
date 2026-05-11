const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// URL DO SEU WEBHOOK (Sempre use /webhook-test/ para testar no n8n)
const URL_WEBHOOK = 'https://flavinhaprivy.app.n8n.cloud/webhook-test/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    btn.innerText = "GERANDO PIX...";
    btn.disabled = true;

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify({ email: email })
        });

        const resultado = await response.json();

        if (resultado.url_checkout) {
            const pix = resultado.url_checkout;
            
            // Tenta copiar para a área de transferência
            await navigator.clipboard.writeText(pix);
            alert("✅ PIX GERADO!\n\nO código foi copiado. Cole no seu banco para pagar.");
            
            // Backup caso o cliente queira ver o código
            console.log("Pix Copia e Cola:", pix);
        } else {
            alert("Erro ao gerar Pix. Verifique o fluxo no n8n.");
        }
    } catch (error) {
        alert("Erro de conexão. O n8n está em execução?");
    } finally {
        btn.innerText = "ASSINAR AGORA";
        btn.disabled = false;
    }
});
