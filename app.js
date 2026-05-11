const btn = document.getElementById('btnAssinar');
const planCards = document.querySelectorAll('.plan-card');
let selectedPrice = "19.90";
let selectedPlanName = "SEMANAL";
planCards.forEach(card => {
card.addEventListener('click', () => {
planCards.forEach(c => c.classList.remove('active'));
card.classList.add('active');
selectedPrice = card.getAttribute('data-price');
selectedPlanName = card.getAttribute('data-name');
});
});
btn.addEventListener('click', async () => {
const email = document.getElementById('email').value.trim();
if (!email || !email.includes('@')) { alert("E-mail inválido."); return; }
btn.innerText = "PROCESSANDO..."; btn.disabled = true;
try {
const response = await fetch('https://flavinhaprivy.app.n8n.cloud/webhook-test/venda',
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email: email, valor: selectedPrice, plano:
selectedPlanName })
});
const res = await response.json();
if (res.url_checkout) {
document.getElementById('formArea').style.display = 'none';
document.getElementById('pixArea').style.display = 'block';
document.getElementById('pixCode').value = res.url_checkout;

alert(" PIX GERADO! O código foi copiado automaticamente.");
}
} catch (e) { alert("Erro de conexão com o servidor."); }
finally { btn.innerText = "GERAR PIX DE ACESSO"; btn.disabled = false; }
});
