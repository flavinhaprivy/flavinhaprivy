const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');
const pixArea = document.getElementById('pixArea');
const formArea = document.getElementById('formArea');
const pixCodeInput = document.getElementById('pixCode');
const btnCopy = document.getElementById('btnCopy');
const planCards = document.querySelectorAll('.plan-card');

const URL_WEBHOOK = 'https://flavinhaprivy.app.n8n.cloud/webhook-test/venda';

let selectedPlan = null;

planCards.forEach(card => {
    card.addEventListener('click', () => {
        planCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedPlan = {
            plan: card.dataset.plan,
            price: card.dataset.price,
            label: card.dataset.label
        };
        btn.disabled = false;
        btn.innerText = `GERAR PIX — R$ ${parseFloat(card.dataset.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    });
});

btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) { alert("E-mail inválido."); return; }
    if (!selectedPlan) { alert("Selecione um plano."); return; }

    btn.innerText = "PROCESSANDO...";
    btn.disabled = true;

    try {
        const response = await fetch(URL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                plano: selectedPlan.plan,
                valor: selectedPlan.price,
                descricao: `Plataforma Umpierre - Plano ${selectedPlan.label}`
            })
        });

        const res = await response.json();

        if (res.url_checkout) {
            formArea.style.display = 'none';
            pixArea.style.display = 'flex';
            pixCodeInput.value = res.url_checkout;
            try { await navigator.clipboard.writeText(res.url_checkout); } catch {}
            alert("✅ PIX GERADO! Código copiado automaticamente.");
        } else {
            alert("Não foi possível gerar o PIX. Tente novamente.");
            btn.innerText = "GERAR PIX";
            btn.disabled = false;
        }
    } catch (e) {
        alert("Erro de conexão com o servidor. Tente novamente.");
        btn.innerText = "GERAR PIX";
        btn.disabled = false;
    }
});

btnCopy.addEventListener('click', () => {
    pixCodeInput.select();
    document.execCommand('copy');
    btnCopy.innerText = "COPIADO!";
    setTimeout(() => btnCopy.innerText = "COPIAR", 2000);
});
