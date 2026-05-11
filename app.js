const btn = document.getElementById('btnAssinar');
const emailInput = document.getElementById('email');
const pixArea = document.getElementById('pixArea');
const formArea = document.getElementById('formArea');
const pixCodeInput = document.getElementById('pixCode');
const btnCopy = document.getElementById('btnCopy');
const planCards = document.querySelectorAll('.plan-card');

const URL_WEBHOOK = 'https://temperatures-dealers-exterior-shopper.trycloudflare.com/webhook-test/venda';

// Estado do plano selecionado
let selectedPlan = null;

// Seleção de plano
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
        btn.innerText = `GERAR PIX — ${card.dataset.label} R$ ${parseFloat(card.dataset.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    });
});

// Clique no botão de gerar PIX
btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    if (!selectedPlan) {
        alert("Selecione um plano antes de continuar.");
        return;
    }

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
            pixArea.style.display = 'block';
            pixCodeInput.value = res.url_checkout;

            try {
                await navigator.clipboard.writeText(res.url_checkout);
                alert("✅ PIX GERADO! O código foi copiado automaticamente.");
            } catch {
                // clipboard pode falhar em alguns browsers; usuário ainda pode copiar manualmente
            }
        } else {
            alert("Não foi possível gerar o PIX. Tente novamente.");
        }

    } catch (e) {
        alert("Erro de conexão com o servidor. Tente novamente.");
    } finally {
        btn.innerText = `GERAR PIX — ${selectedPlan.label}`;
        btn.disabled = false;
    }
});

// Botão copiar manual
btnCopy.addEventListener('click', () => {
    pixCodeInput.select();
    document.execCommand('copy');
    btnCopy.innerText = "COPIADO!";
    setTimeout(() => btnCopy.innerText = "COPIAR", 2000);
});
