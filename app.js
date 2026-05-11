try {
            // Link direto da tua n8n Cloud
            const response = await fetch('https://flavinhaprivy.app.n8n.cloud/webhook-test/venda', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                mode: 'cors', 
                body: JSON.stringify(dadosVenda)
            });

            if (!response.ok) throw new Error("Erro no servidor n8n");

            const resultado = await response.json();

            if (resultado.url_checkout) {
                window.location.href = resultado.url_checkout;
            } else {
                alert("Erro: Link de checkout não recebido.");
                resetBtn();
            }
