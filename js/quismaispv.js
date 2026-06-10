/* ==========================================================
   BHC Hair® — JavaScript da Landing Page (quismaispv.html)
   Lógica: Nome do quiz, player de vídeo, Exit Intent, scroll
   ========================================================== */

// Inicializa ícones Lucide após o DOM estar pronto
document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();

    // ─── Personalização com o nome vindo do Quiz pela URL ───────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('nome');

    if (userName && userName.trim() !== '') {
        // Pega só o primeiro nome, capitalizado, com limite de 30 caracteres (segurança)
        const firstNameRaw = userName.trim().split(/\s+/)[0].slice(0, 30);
        const nomeFormatado = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase();

        // Atualiza o badge de continuidade do quiz
        const badge = document.getElementById('display-nome-badge');
        if (badge) badge.innerText = nomeFormatado + ', o BHC Hair é para você!';

        // Mostra e preenche o subtítulo personalizado
        const spanTitulo = document.getElementById('display-nome-titulo');
        if (spanTitulo) {
            spanTitulo.innerText = 'Preparamos a sua fórmula, ' + nomeFormatado + '.';
            spanTitulo.classList.remove('hidden');
        }
    }

    // ─── Player de Vídeo (carrega iframe YouTube ao clicar) ─────────────────
    const videoPlaceholder = document.getElementById('video-placeholder');
    if (videoPlaceholder) {
        const videoId = videoPlaceholder.dataset.videoId || 'vSLb3KS7LFs';
        const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&controls=1`;

        videoPlaceholder.addEventListener('click', function () {
            if (this.dataset.loaded === 'true') return;
            this.innerHTML = `<iframe src="${videoUrl}" title="Video Oficial BHC Hair" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute inset-0 w-full h-full rounded-3xl"></iframe>`;
            this.dataset.loaded = 'true';
        });
    }

    // ─── Exit Intent Modal (Retenção de Usuário) ─────────────────────────────
    const exitModal = document.getElementById('exit-modal');
    const closeModalBtn = document.getElementById('close-exit-modal');
    let exitModalTriggered = false;

    function showExitModal() {
        if (exitModalTriggered || !exitModal) return;
        exitModalTriggered = true;
        exitModal.classList.remove('hidden');
        void exitModal.offsetWidth; // Força reflow para a transição CSS funcionar
        exitModal.classList.remove('opacity-0');
        exitModal.querySelector('div').classList.remove('scale-95');
        lucide.createIcons(); // Garante que os ícones do modal estejam renderizados
    }

    function hideExitModal() {
        if (!exitModal) return;
        exitModal.classList.add('opacity-0');
        exitModal.querySelector('div').classList.add('scale-95');
        setTimeout(() => { exitModal.classList.add('hidden'); }, 300);
    }

    // Gatilho Desktop: mouse sai pela borda superior (tentativa de fechar aba)
    document.addEventListener('mouseleave', function (e) {
        if (e.clientY <= 0) showExitModal();
    });

    // Gatilho Mobile: botão "Voltar" do navegador
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function () {
        showExitModal();
        window.history.pushState(null, null, window.location.href); // Bloqueia saída
    });

    // Gatilho Mobile: Scroll Rápido para Cima (Intent de sair)
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    
    window.addEventListener('scroll', function () {
        if (exitModalTriggered) return;
        
        const currentScrollY = window.scrollY;
        const currentTime = Date.now();
        
        // Verifica se scrollou para cima e não está no topo
        if (currentScrollY < lastScrollY && currentScrollY > 300) {
            const distance = lastScrollY - currentScrollY;
            const timeDiff = currentTime - lastScrollTime;
            
            // Velocidade em px por milissegundo (> 2.0 é um flick rápido no mobile)
            if (timeDiff > 0 && (distance / timeDiff) > 2.5) {
                showExitModal();
            }
        }
        
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
    }, { passive: true });

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideExitModal);

    // Fecha clicando no fundo escuro fora do modal
    if (exitModal) {
        exitModal.addEventListener('click', function (e) {
            if (e.target === exitModal) hideExitModal();
        });
    }

    // ─── Scroll Suave para Âncoras (sem alterar hash da URL) ─────────────────
    // Impede que links como href="#ofertas" modifiquem o histórico do navegador,
    // o que ativaria o gatilho de Exit Intent do Mobile indevidamente.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── Prova Social (Toast Dinâmico) ────────────────────────────────────────
    const socialToast = document.getElementById('social-proof-toast');
    if (socialToast) {
        const nomes = ['Maria (SP)', 'Ana (RJ)', 'Juliana (MG)', 'Camila (PR)', 'Fernanda (SC)', 'Letícia (RS)', 'Amanda (GO)', 'Beatriz (DF)', 'Clara (BA)', 'Patrícia (ES)'];
        const produtos = ['Kit 3 Frascos', 'Kit 5 Frascos', '1 Frasco', 'Kit 5 Frascos', 'Kit 3 Frascos'];
        const tempos = ['Há 1 minuto', 'Há 2 minutos', 'Há 5 minutos', 'Agora mesmo', 'Há 3 minutos'];

        const elName = document.getElementById('sp-name');
        const elProduct = document.getElementById('sp-product');
        const elTime = document.getElementById('sp-time');

        function showSocialProof() {
            if (!socialToast || exitModalTriggered) return;
            
            // Escolhe dados aleatórios
            elName.innerText = nomes[Math.floor(Math.random() * nomes.length)];
            elProduct.innerText = produtos[Math.floor(Math.random() * produtos.length)];
            elTime.innerText = tempos[Math.floor(Math.random() * tempos.length)];

            // Anima entrada
            socialToast.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            
            // Anima saída após 4 segundos
            setTimeout(() => {
                socialToast.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
            }, 4500);
        }

        // Mostra o primeiro após 10 segundos
        setTimeout(() => {
            showSocialProof();
            // E depois repete com intervalos aleatórios entre 15 e 30 segundos
            setInterval(() => {
                if(Math.random() > 0.3 && !exitModalTriggered) { // 70% de chance de mostrar para parecer orgânico
                    showSocialProof();
                }
            }, Math.floor(Math.random() * 15000) + 15000);
        }, 10000);
    }

    // ─── Rastreamento de clique nos botões de Checkout ───────────────────────
    // Exposta globalmente para ser chamada por onclick nos botões HTML

    /**
     * parsePreco — Converte string de preço (ex: "R$197,00" ou "197,00") para número (197.00).
     * Remove símbolo de moeda, espaços e converte vírgula decimal para ponto.
     *
     * @param {string} precoStr - Preço em formato textual (ex: "R$197,00")
     * @returns {number} Valor numérico (ex: 197.00), ou 0 se inválido
     */
    function parsePreco(precoStr) {
        if (!precoStr) return 0;
        // Remove R$, espaços e pontos de milhar; troca vírgula decimal por ponto
        var limpo = String(precoStr)
            .replace(/R\$\s*/i, '')
            .replace(/\./g, '')    // remove separadores de milhar
            .replace(',', '.');    // vírgula decimal → ponto
        var valor = parseFloat(limpo);
        return isNaN(valor) ? 0 : valor;
    }

    window.trackCheckout = function (kit, preco, checkout_url) {

        // ── 1. BDFTracker (rastreamento interno / CRM) ──────────────────────
        if (window.BDFTracker) {
            window.BDFTracker.trackEvent('checkout_clicked', {
                kit,
                preco,
                checkout_url,
                origem: 'pagina_vendas_bhc',
                brand: 'Bela de Fases',
                product_interest: 'BHC Hair'
            });
        }

        // ── 2. Google Analytics 4 — begin_checkout ──────────────────────────
        // Disparado quando o usuário clica em um botão de compra neste site.
        // Representa a INTENÇÃO de comprar (início do checkout).
        //
        // IMPORTANTE: NÃO disparamos 'purchase' aqui porque a transação
        // ocorre fora do site, na SonharPay. O evento 'purchase' deve ser
        // configurado diretamente na SonharPay (página de obrigado / thank you
        // page) ou via webhook/postback, caso a plataforma permita.
        if (typeof gtag === 'function') {
            var valorNumerico = parsePreco(preco);
            gtag('event', 'begin_checkout', {
                currency: 'BRL',
                value: valorNumerico,
                items: [
                    {
                        item_id:       'bhc-hair-' + String(kit).toLowerCase().replace(/\s+/g, '-'),
                        item_name:     'BHC Hair Caps — ' + kit,
                        item_brand:    'BHC Hair',
                        item_category: 'Suplemento Capilar',
                        price:         valorNumerico,
                        quantity:      1
                    }
                ]
            });
        }

        // ── 3. Redirect para a SonharPay ────────────────────────────────────
        // Delay aumentado para 400 ms: garante tempo suficiente para o
        // gtag() e o BDFTracker (fetch keepalive) serem enviados antes
        // do navegador redirecionar.
        setTimeout(function () {
            window.location.href = checkout_url;
        }, 400);
    };
});
