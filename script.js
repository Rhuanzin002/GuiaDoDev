"use strict";

/* =========================================================
   GUIDADODEV
   Landing Page: Seu Primeiro Site em 7 Dias

   Funcionalidades:
   1. FAQ interativo
   2. Contador regressivo demonstrativo
   3. Persistência do contador
   4. Atualização do ano do rodapé
   5. Validação básica do link do checkout
   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÕES
   ========================================================= */

const CONFIG = {
    // Duração inicial do contador: 14 minutos e 59 segundos.
    countdownMinutes: 14,
    countdownSeconds: 59,

    // Chaves usadas para salvar o contador no navegador.
    storageKey: "guiadodev_countdown_expiration",

    // true = o contador é apenas demonstrativo.
    // Altere para false somente quando houver uma oferta
    // real, com prazo e condições verdadeiros.
    countdownIsDemonstration: true
};


/* =========================================================
   2. FAQ INTERATIVO
   ========================================================= */

/**
 * Inicializa o acordeão de perguntas frequentes.
 *
 * Comportamento:
 * - Clicar em uma pergunta abre sua resposta.
 * - Clicar novamente fecha a resposta.
 * - Abrir uma pergunta fecha as demais.
 * - Os atributos ARIA são atualizados para acessibilidade.
 */

function initializeFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    if (faqItems.length === 0) {
        return;
    }

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!button || !answer) {
            return;
        }

        // Garante o estado inicial fechado.
        button.setAttribute("aria-expanded", "false");
        answer.hidden = true;
        item.classList.remove("is-open");

        button.addEventListener("click", () => {
            const isCurrentlyOpen =
                button.getAttribute("aria-expanded") === "true";

            // Fecha todas as outras perguntas.
            faqItems.forEach((otherItem) => {
                const otherButton =
                    otherItem.querySelector(".faq-question");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                if (!otherButton || !otherAnswer) {
                    return;
                }

                otherButton.setAttribute("aria-expanded", "false");

                otherAnswer.hidden = true;

                otherItem.classList.remove("is-open");
            });

            // Se a pergunta clicada estava fechada,
            // abre somente essa pergunta.
            if (!isCurrentlyOpen) {
                button.setAttribute("aria-expanded", "true");

                answer.hidden = false;

                item.classList.add("is-open");
            }
        });
    });
}


/* =========================================================
   3. CONTADOR REGRESSIVO
   ========================================================= */

/**
 * Cria a interface do contador dentro do card da oferta.
 *
 * O elemento é inserido via JavaScript, então não é necessário
 * adicionar HTML adicional para que ele apareça.
 */

function createCountdownInterface() {
    const offerCard = document.querySelector(".offer-card");

    if (!offerCard) {
        return null;
    }

    // Evita duplicação caso a função seja chamada novamente.
    const existingCountdown =
        document.querySelector("#offer-countdown");

    if (existingCountdown) {
        return existingCountdown;
    }

    const countdown = document.createElement("div");

    countdown.id = "offer-countdown";
    countdown.className = "offer-countdown";

    countdown.setAttribute("aria-live", "off");

    countdown.innerHTML = `
        <div class="countdown-heading">
            <span class="countdown-icon" aria-hidden="true">
                <i class="fa-regular fa-clock"></i>
            </span>

            <div class="countdown-copy">
                <strong>Contador demonstrativo</strong>
                <span>
                    Temporizador ilustrativo, sem prazo comercial real.
                </span>
            </div>
        </div>

        <div
            class="countdown-display"
            role="timer"
            aria-label="Tempo restante do temporizador demonstrativo"
        >
            <span class="countdown-time">14:59</span>
        </div>
    `;

    // Posiciona o contador após o bloco de preço.
    const priceBlock = offerCard.querySelector(".price-block");

    if (priceBlock) {
        priceBlock.insertAdjacentElement("afterend", countdown);
    } else {
        offerCard.prepend(countdown);
    }

    // Estilos específicos do componente.
    // Assim, o contador funciona sem exigir alterações no CSS.
    applyCountdownStyles();

    return countdown;
}


/**
 * Aplica os estilos do contador.
 *
 * Os estilos principais da landing page permanecem no CSS.
 * Estes estilos são específicos do componente criado pelo JS.
 */

function applyCountdownStyles() {
    if (document.querySelector("#countdown-dynamic-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "countdown-dynamic-styles";

    style.textContent = `
        .offer-countdown {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 14px;

            margin-top: 24px;
            padding: 16px;

            border: 1px solid rgba(0, 210, 255, 0.18);
            border-radius: 14px;

            background: rgba(0, 210, 255, 0.035);
        }

        .countdown-heading {
            display: flex;
            align-items: center;
            gap: 11px;

            min-width: 0;
            flex: 1;
        }

        .countdown-icon {
            width: 38px;
            height: 38px;

            display: grid;
            place-items: center;

            flex-shrink: 0;

            border-radius: 11px;

            background: rgba(0, 210, 255, 0.08);

            color: #00d2ff;
        }

        .countdown-copy {
            display: grid;
            gap: 4px;
        }

        .countdown-copy strong {
            color: #f4f8ff;

            font-family: "Inter", sans-serif;
            font-size: 0.78rem;
            line-height: 1.5;
        }

        .countdown-copy span {
            color: #8291a8;

            font-family: "Inter", sans-serif;
            font-size: 0.67rem;
            line-height: 1.6;
        }

        .countdown-display {
            display: flex;
            align-items: center;
            justify-content: center;

            min-width: 85px;
            padding: 9px 12px;

            border: 1px solid rgba(0, 210, 255, 0.18);
            border-radius: 9px;

            background: rgba(5, 10, 20, 0.65);
        }

        .countdown-time {
            color: #00d2ff;

            font-family: "Space Grotesk", sans-serif;
            font-size: 1.2rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            letter-spacing: 0.04em;
        }

        .offer-countdown.is-finished {
            border-color: rgba(148, 163, 184, 0.15);
        }

        .offer-countdown.is-finished .countdown-time {
            color: #b3bfd2;
        }

        @media (max-width: 420px) {
            .offer-countdown {
                align-items: flex-start;
                flex-direction: column;
            }

            .countdown-display {
                width: 100%;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .offer-countdown * {
                animation: none !important;
                transition: none !important;
            }
        }
    `;

    document.head.appendChild(style);
}


/**
 * Recupera o horário de término salvo ou cria um novo.
 *
 * O horário final é armazenado como timestamp Unix em
 * milissegundos, usando o relógio do navegador.
 */

function getCountdownExpiration() {
    const durationInMilliseconds =
        (
            CONFIG.countdownMinutes * 60 +
            CONFIG.countdownSeconds
        ) * 1000;

    try {
        const savedExpiration =
            localStorage.getItem(CONFIG.storageKey);

        if (savedExpiration !== null) {
            const expiration = Number(savedExpiration);

            if (
                Number.isFinite(expiration) &&
                expiration > 0
            ) {
                return expiration;
            }
        }

        const expiration = Date.now() + durationInMilliseconds;

        localStorage.setItem(
            CONFIG.storageKey,
            String(expiration)
        );

        return expiration;

    } catch (error) {
        // Caso o navegador bloqueie o localStorage,
        // o contador continua funcionando nesta sessão.
        console.warn(
            "Não foi possível persistir o contador:",
            error
        );

        return Date.now() + durationInMilliseconds;
    }
}


/**
 * Formata os segundos em MM:SS.
 */

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return [
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0")
    ].join(":");
}



/* =========================================================
   4. ANO AUTOMÁTICO DO RODAPÉ
   ========================================================= */

/**
 * Atualiza automaticamente o ano dos direitos autorais.
 */

function initializeCopyrightYear() {
    const yearElement = document.querySelector("#current-year");

    if (!yearElement) {
        return;
    }

    yearElement.textContent = String(new Date().getFullYear());
}


/* =========================================================
   5. VALIDAÇÃO BÁSICA DO CHECKOUT
   ========================================================= */

/**
 * Verifica se o botão de compra ainda aponta para o endereço
 * fictício da Kiwify.
 *
 * Este código não substitui uma integração real com o checkout.
 * Ele apenas ajuda a detectar o placeholder durante o desenvolvimento.
 */

function validateCheckoutLink() {
    const checkoutLinks = document.querySelectorAll("[data-checkout]");

    checkoutLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (
            !href ||
            href.includes("SEU_CODIGO")
        ) {
            console.warn(
                "GuiaDoDev: substitua o link fictício do checkout " +
                "pelo endereço real da sua página de pagamento."
            );
        }
    });
}


/* =========================================================
   6. INICIALIZAÇÃO
   ========================================================= */

/**
 * Executa todas as funcionalidades após o HTML ser interpretado.
 *
 * O script já utiliza defer no HTML, mas o evento também
 * permite que a inicialização seja segura em outros contextos.
 */

function initializeLandingPage() {
    initializeFAQ();

    initializeCountdown();

    initializeCopyrightYear();

    validateCheckoutLink();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeLandingPage,
        { once: true }
    );
} else {
    initializeLandingPage();
}