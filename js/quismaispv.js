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
});
