const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');
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
            body: JSON.stringify({ email: email })
        });

        const resultado = await response.json();

        if (resultado.url_checkout) {
            const pix = resultado.url_checkout;

            // REGRA DE OURO: Se começar por '0002', é um código Pix, não um link!
            if (pix.startsWith('0002')) {
                await navigator.clipboard.writeText(pix);
                alert("✅ PIX COPIADO!\n\nO código 'Copia e Cola' foi copiado para o seu telemóvel. Abra o seu banco e cole para pagar.");
            } else {
                // Se for um link real (URL), ele navega normalmente
                window.location.href = pix;
            }
        } else {
            alert("Erro: Link não recebido do n8n.");
        }
    } catch (error) {
        alert("Erro de conexão com o servidor.");
    } finally {
        btn.innerText = "ASSINAR AGORA";
        btn.disabled = false;
    }
});
