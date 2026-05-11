const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');
const pixArea = document.getElementById('pixArea');
const formArea = document.getElementById('formArea');
const pixCodeInput = document.getElementById('pixCode');
const btnCopy = document.getElementById('btnCopy');

const URL_WEBHOOK = 'https://flavinhaprivy.app.n8n.cloud/webhook-test/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) { alert("E-mail inválido."); return; }
    
    btn.innerText = "PROCESSANDO...";
    btn.disabled = true;

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        
        const res = await response.json();
        
        // Verifica se o n8n retornou o código Pix (url_checkout)
        if (res.url_checkout) {
            formArea.style.display = 'none';
            pixArea.style.display = 'block';
            pixCodeInput.value = res.url_checkout;
            
            await navigator.clipboard.writeText(res.url_checkout);
            alert("✅ PIX GERADO! O código foi copiado automaticamente.");
        }
    } catch (e) { alert("Erro de conexão com o servidor."); }
    finally { btn.innerText = "GERAR PAGAMENTO PIX"; btn.disabled = false; }
});

btnCopy.addEventListener('click', () => {
    pixCodeInput.select();
    document.execCommand('copy');
    btnCopy.innerText = "COPIADO!";
    setTimeout(() => btnCopy.innerText = "COPIAR", 2000);
});
