# 💆‍♀️ BHC Hair — Landing Page + Quiz de Qualificação

> Landing page de alta conversão para o suplemento capilar **BHC Hair Caps**, com quiz de qualificação de leads integrado e funil de vendas completo.

---

## 📁 Estrutura do Projeto

```
bhc-hair-landing/
├── index.html                    # Redirect para o início do funil
├── quis.html                     # Quiz de qualificação de leads
├── quismaispv.html               # Landing page principal (VSL + Ofertas)
├── aviso-legal.html
├── termos-de-uso.html
├── politica-de-privacidade.html
├── politicas-de-envio.html
├── fale-conosco.html
├── css/
│   └── bhc-custom.css            # Estilos compartilhados entre todas as páginas
├── js/
│   ├── quismaispv.js             # Lógica da landing page (Exit Intent, player, nome)
│   └── quis.js                   # Lógica do quiz (score, leads, redirecionamento)
├── assets/                       # Imagens e GIFs do produto
└── Depoimentos/                  # Fotos de depoimentos de clientes
```

---

## 🔄 Fluxo do Funil

```
Visita o site
     ↓
index.html  →  quis.html (Quiz)  →  quismaispv.html (VSL + Ofertas)
                    ↓
             Lead capturado
             (nome passa via URL ?nome=)
```

---

## ✨ Funcionalidades

- **Quiz de Qualificação** — 4 perguntas com sistema de pontuação. Leads qualificados são redirecionados para a VSL com o nome personalizado.
- **Personalização por Nome** — A landing page captura o nome do quiz via URL e o exibe em badge e título de forma segura (`.innerText`, limite de 30 chars).
- **Exit Intent Modal** — Pop-up de retenção ativado quando o mouse sai da janela (desktop) ou ao pressionar "Voltar" (mobile), sem disparar em links internos.
- **Scroll Suave** — Links âncora não modificam o hash da URL (evita o falso disparo do Exit Intent no mobile).
- **Seção de Ofertas** — 3 kits com preços, parcelamento e botões de checkout integrados com SonharPay.
- **7 Links de Checkout** — Cada kit tem seu próprio link de rastreamento.
- **Páginas Legais** — Aviso Legal, Termos de Uso, Política de Privacidade, Políticas de Envio e Fale Conosco com FAQ rápido.
- **Proteção Anti-Clickjacking** — `X-Frame-Options: SAMEORIGIN` em todas as páginas.

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica |
| Tailwind CSS (CDN) | Estilização principal |
| CSS customizado | Animações e utilitários compartilhados |
| JavaScript Vanilla | Quiz, Exit Intent, player de vídeo |
| Lucide Icons | Ícones via CDN |
| Google Fonts (Inter) | Tipografia |
| SonharPay | Checkout e rastreamento |

---

## ⚙️ Como usar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/caiooanjos/bhc-hair-landing.git
   ```

2. Abra a pasta em um servidor local (necessário para os paths relativos funcionarem):
   ```bash
   # Com Python:
   python -m http.server 8000

   # Ou com VS Code: instale a extensão "Live Server" e clique em "Go Live"
   ```

3. Acesse `http://localhost:8000` no navegador.

> ⚠️ **Não abra os arquivos HTML diretamente com duplo-clique** — abra sempre via servidor local para que os arquivos CSS e JS externos sejam carregados corretamente.

---

## 📋 Pendências (TODO)

- [ ] **WhatsApp real** — Substituir `wa.me/5500000000000` pelo número oficial em `fale-conosco.html`
- [ ] **Formulário de contato** — Integrar com Formspree ou similar para envio real de mensagens
- [ ] **Captura de leads do quiz** — Integrar nome/e-mail/telefone com ActiveCampaign, Mailchimp ou similar
- [ ] **FAQ expandido** — Adicionar perguntas sobre anticoncepcional, pós-parto e progressiva (já planejado)

---

## 🔒 Segurança

- Nenhuma chave de API ou credencial no código
- Parâmetros de URL sanitizados com `encodeURIComponent` e `innerText`
- Proteção contra clickjacking via `X-Frame-Options`
- Links externos com `rel="noopener noreferrer"`

---

*Desenvolvido com 💗 inspirado no BHC Hair Caps — © 2026*
