(function () {
    const API_ENDPOINT = 'https://bhc-lead-api.caiogpuava.workers.dev';

    // ─── Contatos oficiais — altere aqui para atualizar todo o projeto ────────
    const WHATSAPP_NUMBER = '5542988293278';
    const CONTACT_EMAIL   = 'falarcom@beladefases.com.br';

    function getLeadId() {
        let leadId = localStorage.getItem('bdf_lead_id');

        if (!leadId) {
            leadId = crypto.randomUUID();
            localStorage.setItem('bdf_lead_id', leadId);
        }

        return leadId;
    }

    function getUtmParams() {
        const params = new URLSearchParams(window.location.search);

        return {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_content: params.get('utm_content'),
            utm_term: params.get('utm_term'),
        };
    }

    async function trackEvent(event, data = {}) {
        const payload = {
            event,
            lead_id: getLeadId(),
            page_url: window.location.href,
            referrer: document.referrer || null,
            timestamp: new Date().toISOString(),
            ...getUtmParams(),
            ...data,
        };

        try {
            await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        } catch (error) {
            console.warn('Erro ao enviar evento Bela de Fases:', error);
        }
    }

    window.BDFTracker = {
        trackEvent,
        getLeadId,
        WHATSAPP_NUMBER,
        CONTACT_EMAIL,
    };
})();
