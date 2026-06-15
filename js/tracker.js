(function () {
    const API_ENDPOINT = 'https://bhc-lead-api.caiogpuava.workers.dev';
    const META_PIXEL_ID = '990166170412622';
    const STORED_LEAD_KEY = 'bdf_lead_data';

    // ─── Contatos oficiais — altere aqui para atualizar todo o projeto ────────
    const WHATSAPP_NUMBER = '5542988293278';
    const CONTACT_EMAIL = 'falarcom@beladefases.com.br';

    function getLeadId() {
        let leadId = localStorage.getItem('bdf_lead_id');

        if (!leadId) {
            leadId = crypto.randomUUID();
            localStorage.setItem('bdf_lead_id', leadId);
        }

        return leadId;
    }

    function getCookie(name) {
        const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`));

        return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
    }

    function getMetaCookies() {
        return {
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc'),
        };
    }

    function getStoredLeadData() {
        try {
            return JSON.parse(localStorage.getItem(STORED_LEAD_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function saveLeadData(data = {}) {
        const leadData = {
            name: data.name || data.nome || '',
            email: data.email || '',
            phone: data.phone || data.telefone || '',
        };

        if (leadData.name || leadData.email || leadData.phone) {
            localStorage.setItem(STORED_LEAD_KEY, JSON.stringify(leadData));
        }
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

    function createEventId(event) {
        const random = Math.random().toString(36).slice(2, 10);
        return `bdf_${event}_${getLeadId()}_${Date.now()}_${random}`;
    }

    function parseCurrency(value) {
        if (!value) return 0;

        const cleanedValue = String(value)
            .replace(/R\$\s*/i, '')
            .replace(/\./g, '')
            .replace(',', '.')
            .trim();

        const parsedValue = parseFloat(cleanedValue);
        return Number.isFinite(parsedValue) ? parsedValue : 0;
    }

    function initMetaPixel() {
        if (!META_PIXEL_ID) return;

        if (!window.fbq) {
            !(function (f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = true;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = true;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        }

        window.fbq('init', META_PIXEL_ID);
        window.fbq('track', 'PageView', {}, { eventID: createEventId('page_view') });
    }

    function trackMetaEvent(eventName, params = {}, eventId) {
        if (typeof window.fbq !== 'function') return;

        window.fbq('track', eventName, params, {
            eventID: eventId || createEventId(eventName),
        });
    }

    function trackMetaFromInternalEvent(event, data, eventId) {
        // Importante: não enviamos respostas detalhadas do quiz para a Meta.
        // Dados como dor_principal, respostas e histórico ficam apenas no CRM/n8n.
        const productName = 'BHC Hair';
        const contentCategory = 'Análise Capilar';

        if (event === 'quiz_completed') {
            trackMetaEvent(
                'CompleteRegistration',
                {
                    content_name: 'Análise de Perfil Capilar',
                    content_category: contentCategory,
                    product_interest: productName,
                    status: data.qualified ? 'qualified' : 'not_qualified',
                },
                eventId
            );
        }

        if (event === 'checkout_clicked') {
            const numericValue = parseCurrency(data.preco);
            const kitName = data.kit || 'BHC Hair';

            trackMetaEvent(
                'InitiateCheckout',
                {
                    content_name: `BHC Hair Caps — ${kitName}`,
                    content_category: 'Suplemento Capilar',
                    content_type: 'product',
                    currency: 'BRL',
                    value: numericValue,
                    num_items: 1,
                },
                eventId
            );
        }
    }

    async function trackEvent(event, data = {}) {
        if (event === 'quiz_completed') {
            saveLeadData(data);
        }

        const eventId = data.event_id || createEventId(event);
        const payload = {
            event,
            event_id: eventId,
            lead_id: getLeadId(),
            page_url: window.location.href,
            referrer: document.referrer || null,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ...getMetaCookies(),
            ...getUtmParams(),
            ...getStoredLeadData(),
            ...data,
        };

        trackMetaFromInternalEvent(event, payload, eventId);

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

    initMetaPixel();

    window.BDFTracker = {
        trackEvent,
        trackMetaEvent,
        getLeadId,
        WHATSAPP_NUMBER,
        CONTACT_EMAIL,
    };
})();