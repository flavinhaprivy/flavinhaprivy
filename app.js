btn.addEventListener('click', async () => {
            btn.innerText = "GERANDO PAGAMENTO...";
            btn.disabled = true;

            try {
                // Se o seu n8n não tiver SSL (HTTPS), o GitHub Pages pode bloquear.
                // Certifique-se de usar http:// ou https:// corretamente conforme seu servidor.
                const response = await fetch('http://SEU-IP-DO-DEBIAN:5678/webhook/venda', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors', // Adicionado para evitar bloqueio de origem
                    body: JSON.stringify({
                        produto: "Assinatura Nexus",
                        cliente_id: "Eduardo_Web"
                    })
                });

                const dados = await response.json();

                if (dados.url_checkout) {
                    window.location.href = dados.url_checkout;
                } else {
                    alert("Erro ao receber link de pagamento.");
                    resetBtn();
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Erro de conexão. Verifique se o servidor no Debian está ativo.");
                resetBtn();
            }
        });