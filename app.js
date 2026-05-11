const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// NOVA URL DO SEU TÚNEL CLOUDFLARE NO WINDOWS
const URL_WEBHOOK = 'https://yamaha-aruba-translated-politics.trycloudflare.com/webhook/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    // Validação básica de e-mail
    if (!email || !email.includes('@')) {
        alert("Por favor, insira um e-mail válido.");
        emailInput.focus();
        return;
    }

    // Feedback visual
    btn.innerText = "PROCESSANDO...";
    btn.disabled = true;

    const dadosVenda = {
        produto: "Assinatura Nexus",
        email: email,
        origem: "Web_Windows10",
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

        if (!response.ok) throw new Error("O servidor n8n respondeu com erro.");

        const resultado = await response.json();

        // O redirecionamento depende do link enviado pelo seu n8n
        if (resultado.url_checkout) {
            window.location.href = resultado.url_checkout;
        } else {
            console.error("Resposta do servidor:", resultado);
            alert("Erro: O n8n não retornou o campo 'url_checkout'.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro na integração:", error);
        alert("Não foi possível conectar ao Nexus. Verifique se o n8n está aberto no seu PC e se o túnel do Cloudflare continua ativo no terminal.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
