btn.addEventListener('click', async () => {
        btn.innerText = "PROCESSANDO...";
        btn.disabled = true;

        try {
            const response = await fetch('https://umpierre-vendas.loca.lt/webhook/venda', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'bypass-tunnel-reminder': 'true' // Isso pula a tela de aviso do localtunnel
                },
                body: JSON.stringify({ produto: "Assinatura Nexus" })
            });

            const resultado = await response.json();

            if (resultado.url_checkout) {
                window.location.href = resultado.url_checkout;
            } else {
                alert("O servidor não retornou o link de pagamento.");
                resetBtn();
            }

        } catch (error) {
            console.error(error);
            alert("Ainda não consegui conectar ao seu Debian. O túnel está aberto no terminal?");
            resetBtn();
        }
    });
