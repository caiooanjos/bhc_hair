/* ==========================================================
   BHC Hair® — JavaScript do Quiz (quis.html)
   Lógica: Perguntas, score, captação de leads, redirecionamento
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();

    // ─── Estado do Quiz ──────────────────────────────────────────────────────
    let currentQuestion = 0;
    let score = 0;
    let disqualified = false;
    let userName = '';
    let answers = [];

    // ─── Perguntas e Opções ──────────────────────────────────────────────────
    const questions = [
        {
            question: 'Qual é a sua maior frustração com o seu cabelo hoje?',
            options: [
                { text: 'Queda acentuada e falhas', points: 3 },
                { text: 'Crescimento muito lento (não passa do ombro)', points: 3 },
                { text: 'Fios muito fracos, ralos e quebradiços', points: 2 },
                { text: 'O meu cabelo está ótimo, só estava curiosa', points: 0, disqualify: true }
            ]
        },
        {
            question: 'Há quanto tempo vem sofrendo com esse problema capilar?',
            options: [
                { text: 'Começou há pouco tempo (menos de 2 meses)', points: 1 },
                { text: 'De 2 a 6 meses', points: 2 },
                { text: 'Há mais de 6 meses (Já estou desesperada)', points: 3 }
            ]
        },
        {
            question: 'Já gastou dinheiro com produtos (shampôs, cremes) que prometeram milagres e não funcionaram?',
            options: [
                { text: 'Sim, já perdi a conta de quanto gastei', points: 3 },
                { text: 'Sim, testei alguns e não vi resultado', points: 2 },
                { text: 'Não, é a primeira vez que procuro algo', points: 1 }
            ]
        },
        {
            question: 'O nosso tratamento exige 1 cápsula por dia de forma consistente. Você tem esse comprometimento?',
            options: [
                { text: 'Sim! Estou 100% disposta a seguir o tratamento para ter o meu cabelo de volta.', points: 5 },
                { text: 'Não sei se consigo lembrar de tomar todos os dias.', points: 1 },
                { text: 'Não, eu quero um produto que dê resultado em 3 dias.', points: 0, disqualify: true }
            ]
        }
    ];

    // ─── Referências de UI ───────────────────────────────────────────────────
    const screens = {
        start: document.getElementById('screen-start'),
        quiz: document.getElementById('screen-quiz'),
        lead: document.getElementById('screen-lead'),
        loading: document.getElementById('screen-loading'),
        approved: document.getElementById('screen-approved'),
        rejected: document.getElementById('screen-rejected')
    };

    const ui = {
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        questionCounter: document.getElementById('question-counter'),
        progressBar: document.getElementById('progress-bar'),
        loadingText: document.getElementById('loading-text')
    };

    // ─── Funções de Navegação ────────────────────────────────────────────────
    function hideAllScreens() {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    }

    function startQuiz() {
        hideAllScreens();
        currentQuestion = 0;
        score = 0;
        disqualified = false;
        answers = [];
        screens.quiz.classList.remove('hidden');
        loadQuestion();
    }

    function loadQuestion() {
        const q = questions[currentQuestion];
        ui.questionText.textContent = q.question;
        ui.questionCounter.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
        ui.progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

        ui.optionsContainer.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-all font-medium text-gray-700 flex items-center justify-between group';
            btn.innerHTML = `
                <span>${opt.text}</span>
                <div class="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-brand-500 flex items-center justify-center">
                    <div class="w-2.5 h-2.5 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            `;
            btn.onclick = () => selectOption(opt);
            ui.optionsContainer.appendChild(btn);
        });
    }

    function selectOption(option) {
        score += option.points;
        if (option.disqualify) disqualified = true;

        answers.push({
            question: questions[currentQuestion].question,
            answer: option.text,
            points: option.points || 0,
            disqualify: Boolean(option.disqualify)
        });

        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showLeadForm();
        }
    }

    function showLeadForm() {
        hideAllScreens();
        screens.lead.classList.remove('hidden');
    }

    function submitForm(event) {
        event.preventDefault();

        const name = document.getElementById('lead-name').value.trim().slice(0, 50);
        const email = document.getElementById('lead-email').value.trim().toLowerCase();
        const phone = document.getElementById('lead-phone').value.trim();

        userName = name;

        const qualified = !disqualified && score >= 5;

        if (window.BDFTracker) {
            window.BDFTracker.trackEvent('quiz_completed', {
                name,
                email,
                phone,
                score,
                qualified,
                answers,
                origem: 'quiz_capilar_bela_de_fases',
                product_interest: 'BHC Hair',
                brand: 'Bela de Fases'
            });
        }

        processResult();
    }

    function processResult() {
        hideAllScreens();
        screens.loading.classList.remove('hidden');

        setTimeout(() => { ui.loadingText.textContent = 'A avaliar histórico capilar...'; }, 1000);
        setTimeout(() => { ui.loadingText.textContent = 'A calcular taxa de sucesso com BHC...'; }, 2000);

        setTimeout(() => {
            hideAllScreens();
            if (!disqualified && score >= 5) {
                screens.approved.classList.remove('hidden');
            } else {
                screens.rejected.classList.remove('hidden');
            }
        }, 3500);
    }

    function goToLandingPage() {
        const landingPageUrl = 'quismaispv.html';
        const leadId = window.BDFTracker ? window.BDFTracker.getLeadId() : '';

        const finalUrl =
            landingPageUrl +
            '?nome=' + encodeURIComponent(userName) +
            '&lead_id=' + encodeURIComponent(leadId);

        try {
            window.location.href = finalUrl;
        } catch (error) {
            window.open(finalUrl, '_self');
        }
    }

    // ─── Expõe funções globalmente (chamadas por onclick no HTML) ────────────
    window.startQuiz = startQuiz;
    window.submitForm = submitForm;
    window.goToLandingPage = goToLandingPage;
});
