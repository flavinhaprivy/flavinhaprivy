const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');

// ATENÇÃO: Substitua pela URL atual gerada no seu Debian
const URL_WEBHOOK = 'https://eight-cameras-lose.loca.lt/webhook/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value;

    // Validação simples
    if (!email || !email.includes('@')) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    // Feedback visual
    btn.innerText = "PROCESSANDO PAGAMENTO...";
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
                'Bypass-Tunnel-Reminder': 'true' 
            },
            mode: 'cors', 
            body: JSON.stringify(dadosVenda)
        });

        if (!response.ok) throw new Error("Servidor offline ou erro no n8n.");

        const resultado = await response.json();

        // O n8n precisa retornar um JSON com a chave "url_checkout"
        if (resultado.url_checkout) {
            window.location.href = resultado.url_checkout;
        } else {
            console.error("Resposta do servidor:", resultado);
            alert("Erro: O servidor n8n não enviou o link de checkout.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("Não foi possível conectar ao Nexus. Verifique se o túnel no Debian está ativo.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
