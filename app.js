const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// URL ATUALIZADA DO SEU TUNEL LOCAL
const URL_WEBHOOK = 'https://eight-cameras-lose.loca.lt/webhook/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    // Validação básica de e-mail
    if (!email || !email.includes('@')) {
        alert("Por favor, digite um e-mail válido para prosseguir.");
        emailInput.focus();
        return;
    }

    // Feedback visual imediato
    btn.innerText = "PROCESSANDO...";
    btn.disabled = true;

    const dadosVenda = {
        produto: "Assinatura Nexus",
        email: email,
        origem: "Web_GitHub",
        data: new Date().toISOString()
    };

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'true' // Pula o aviso do localtunnel
            },
            mode: 'cors', 
            body: JSON.stringify(dadosVenda)
        });

        if (!response.ok) throw new Error("O n8n recebeu a chamada mas retornou um erro.");

        const resultado = await response.json();

        // O redirecionamento só acontece se o seu n8n retornar "url_checkout"
        if (resultado.url_checkout) {
            window.location.href = resultado.url_checkout;
        } else {
            console.error("Resposta recebida:", resultado);
            alert("Erro: O sistema não gerou o link de pagamento. Verifique o nó de resposta no n8n.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro na integração:", error);
        alert("Falha na conexão com o servidor Nexus. Verifique se o terminal do Debian está aberto com o túnel ativo.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
