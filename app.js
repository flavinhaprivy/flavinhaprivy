const btn = document.getElementById('btnAssinar');

btn.addEventListener('click', async () => {
    btn.innerText = "PROCESSANDO PAGAMENTO...";
    btn.disabled = true;

    try {
        const response = await fetch('https://flavinhaprivy.app.n8n.cloud/webhook-test/venda', {
            method: 'POST', // Precisa ser IGUAL ao que está no n8n
            headers: { 
                'Content-Type': 'application/json'
            },
            mode: 'cors', 
            body: JSON.stringify({
                produto: "Assinatura Nexus",
                origem: "GitHub_Pages"
            })
        });

        if (!response.ok) throw new Error("Erro no n8n Cloud");

        const resultado = await response.json();

        // O n8n precisa devolver um objeto com "url_checkout"
        if (resultado.url_checkout) {
            window.location.href = resultado.url_checkout;
        } else {
            alert("O n8n recebeu o clique, mas o seu fluxo ainda não devolveu o link de checkout.");
            resetBtn();
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Falha na conexão com o n8n Cloud. Verifique se clicou no botão laranja 'Ouça para o evento de teste'.");
        resetBtn();
    }
});

function resetBtn() {
    btn.innerText = "ASSINAR AGORA";
    btn.disabled = false;
}
