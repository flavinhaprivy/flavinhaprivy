<script>
    document.getElementById('year').textContent = new Date().getFullYear();
    const btn = document.getElementById('btnAssinar');

    btn.addEventListener('click', async () => {
        btn.innerText = "PROCESSANDO PAGAMENTO...";
        btn.disabled = true;

        try {
            // URL DIRETA DA SUA N8N CLOUD (Conforme sua foto)
            const response = await fetch('https://flavinhaprivy.app.n8n.cloud/webhook-test/venda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors', 
                body: JSON.stringify({
                    produto: "Assinatura Nexus",
                    origem: "GitHub_Pages"
                })
            });

            if (!response.ok) throw new Error("Erro no n8n Cloud");

            const resultado = await response.json();

            if (resultado.url_checkout) {
                window.location.href = resultado.url_checkout;
            } else {
                alert("O n8n recebeu o clique, mas não devolveu o link de checkout.");
                resetBtn();
            }

        } catch (error) {
            console.error(error);
            alert("Falha na conexão com o n8n Cloud. Verifique se o Webhook está ouvindo.");
            resetBtn();
        }
    });

    function resetBtn() {
        btn.innerText = "ASSINAR AGORA";
        btn.disabled = false;
    }
</script>
