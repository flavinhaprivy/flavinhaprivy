const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');
const planCards = document.querySelectorAll('.plan-card');
let selectedPrice = "19.90"; // Padrão
let selectedPlanName = "SEMANAL";

// Lógica de seleção visual dos planos
planCards.forEach(card => {
    card.addEventListener('click', () => {
        planCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedPrice = card.getAttribute('data-price');
        selectedPlanName = card.getAttribute('data-name');
    });
});

const URL_WEBHOOK = 'https://flavinhaprivy.app.n8n.cloud/webhook-test/venda';

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) { alert("E-mail inválido."); return; }
    
    btn.innerText = "GERANDO PIX...";
    btn.disabled = true;

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email,
                valor: selectedPrice,
                plano: selectedPlanName
            })
        });
        
        const res = await response.json();
        
        if (res.url_checkout) {
            document.getElementById('formArea').style.display = 'none';
            document.getElementById('pixArea').style.display = 'block';
            document.getElementById('pixCode').value = res.url_checkout;
            await navigator.clipboard.writeText(res.url_checkout);
            alert("Pix Copiado! Pague para receber o acesso ao grupo.");
        }
    } catch (e) { alert("Erro de conexão."); }
    finally { btn.innerText = "GERAR PIX DE ACESSO"; btn.disabled = false; }
});
