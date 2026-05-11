const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');
const pixArea = document.getElementById('pixArea');
const formArea = document.getElementById('formArea');
const pixCodeInput = document.getElementById('pixCode');
const btnCopy = document.getElementById('btnCopy');

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

        if (resultado.url_checkout) {
            const pix = resultado.url_checkout;

            // Esconde o formulário e mostra a área do Pix
            formArea.style.display = 'none';
            pixArea.style.display = 'block';
            
            // Coloca o código Pix no campo
            pixCodeInput.value = pix;

            // Copia automaticamente
            await navigator.clipboard.writeText(pix);
            alert("Pix Copiado! Basta colar no seu banco.");
            
        } else {
            alert("Erro ao gerar Pix. Tente novamente.");
            resetBtn();
        }
    } catch (error) {
        alert("Erro de conexão.");
        resetBtn();
    }
});

// Botão manual de copiar
btnCopy.addEventListener('click', () => {
    pixCodeInput.select();
    document.execCommand('copy');
    btnCopy.innerText = "COPIADO!";
    setTimeout(() => btnCopy.innerText = "COPIAR", 2000);
});

function resetBtn() {
    btn.innerText = "GERAR PAGAMENTO PIX";
    btn.disabled = false;
}
    }
});
