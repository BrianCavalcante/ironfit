
/* =========================================
   IRONFIT - JAVASCRIPT
   ========================================= */

/*
    CONFIGURAÇÃO DO SUPABASE
    -----------------------------------------
    1. Crie um projeto no Supabase.
    2. Acesse Project Settings > API.
    3. Copie a Project URL e a chave publishable
       (ou anon key, em projetos antigos).
    4. Insira os valores abaixo.

    IMPORTANTE:
    Nunca coloque a chave service_role aqui.
    O front-end deve utilizar somente uma chave pública.
*/

const SUPABASE_CONFIG = {
    url: "https://fisdiqeafohojmgxdzyr.supabase.co", // Exemplo: https://seuprojeto.supabase.co
    anonKey: "sb_publishable_I3idHz-qq9U_HepHPK310w_MjzpGbOd" // Insira sua chave pública
};

/*
    TABELAS ESPERADAS NO SUPABASE
    -----------------------------------------

    workouts:
    id, name, description, category

    trainers:
    id, name, specialty, description

    opening_hours:
    id, day, opening_time, closing_time, notes

    academy_info:
    id, name, address, neighborhood, city,
    state, phone, email

    Os nomes das colunas devem corresponder
    aos utilizados nas consultas abaixo.
*/


// =========================================
// DADOS FICTÍCIOS - FALLBACK
// =========================================

// Edite estes dados para personalizar o site
// quando o Supabase ainda não estiver configurado.

const DEMO_DATA = {

    workouts: [
        {
            id: 1,
            name: "Musculação",
            description: "Treinamento de força com exercícios e equipamentos variados.",
            category: "Força e condicionamento"
        },
        {
            id: 2,
            name: "Hipertrofia",
            description: "Treinamento voltado ao desenvolvimento muscular e progressão de cargas.",
            category: "Desenvolvimento muscular"
        },
        {
            id: 3,
            name: "Funcional",
            description: "Exercícios que trabalham mobilidade, equilíbrio e condicionamento físico.",
            category: "Condicionamento"
        }
    ],

    trainers: [
        {
            id: 1,
            name: "Lucas Martins",
            specialty: "Musculação",
            description: "Especialista em musculação e treinamento de força."
        },
        {
            id: 2,
            name: "Mariana Costa",
            specialty: "Treinamento funcional",
            description: "Experiência em treinamento funcional e condicionamento."
        },
        {
            id: 3,
            name: "Rafael Oliveira",
            specialty: "Hipertrofia",
            description: "Atuação em hipertrofia e preparação física."
        }
    ],

    hours: [
        {
            id: 1,
            day: "Segunda a sexta",
            opening_time: "05:00",
            closing_time: "23:00",
            notes: ""
        },
        {
            id: 2,
            day: "Sábado",
            opening_time: "06:00",
            closing_time: "18:00",
            notes: ""
        },
        {
            id: 3,
            day: "Domingo",
            opening_time: "08:00",
            closing_time: "12:00",
            notes: ""
        },
        {
            id: 4,
            day: "Feriados",
            opening_time: "",
            closing_time: "",
            notes: "Consulte a disponibilidade"
        }
    ],

    academy: {
        name: "IronFit Academia",
        address: "Av. Exemplo, 1000",
        neighborhood: "Centro",
        city: "Fortaleza",
        state: "CE",
        phone: "(85) 99999-0000",
        email: "contato@ironfit.com.br"
    }

};


// =========================================
// ELEMENTOS DO DOM
// =========================================

const elements = {
    tabs: document.querySelectorAll(".tab-button"),
    panels: document.querySelectorAll(".tab-panel"),

    workouts: document.getElementById("workoutsContainer"),
    trainers: document.getElementById("trainersContainer"),
    hours: document.getElementById("hoursContainer"),
    location: document.getElementById("locationContainer"),

    status: document.getElementById("dataStatus"),

    menuToggle: document.getElementById("menuToggle"),
    navigation: document.getElementById("mainNavigation"),

    currentYear: document.getElementById("currentYear")
};


// =========================================
// FUNÇÃO DE SEGURANÇA HTML
// =========================================

/*
    Os dados recebidos da API não devem ser
    inseridos diretamente no HTML.

    Esta função escapa caracteres especiais
    para reduzir riscos de injeção de HTML.
*/

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}


// =========================================
// NAVEGAÇÃO ENTRE ABAS
// =========================================

function activateTab(selectedTab, moveFocus = false) {

    const selectedName = selectedTab.dataset.tab;

    elements.tabs.forEach(tab => {

        const isActive = tab === selectedTab;

        tab.classList.toggle("active", isActive);

        tab.setAttribute(
            "aria-selected",
            String(isActive)
        );

        tab.tabIndex = isActive ? 0 : -1;

    });

    elements.panels.forEach(panel => {

        panel.hidden = panel.id !== `panel-${selectedName}`;

    });

    if (moveFocus) {
        selectedTab.focus();
    }

}


// Clique nas abas
elements.tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        activateTab(tab);

    });

});


// Navegação por teclado
elements.tabs.forEach((tab, index) => {

    tab.addEventListener("keydown", event => {

        let nextIndex = index;

        switch (event.key) {

            case "ArrowRight":
                nextIndex = (index + 1) % elements.tabs.length;
                break;

            case "ArrowLeft":
                nextIndex = (
                    index - 1 + elements.tabs.length
                ) % elements.tabs.length;
                break;

            case "Home":
                nextIndex = 0;
                break;

            case "End":
                nextIndex = elements.tabs.length - 1;
                break;

            default:
                return;

        }

        event.preventDefault();

        activateTab(elements.tabs[nextIndex], true);

    });

});


// Links que direcionam para uma aba específica
document.querySelectorAll("[data-tab-link]").forEach(link => {

    link.addEventListener("click", () => {

        const tabName = link.dataset.tabLink;

        const targetTab = document.querySelector(
            `[data-tab="${tabName}"]`
        );

        if (targetTab) {
            activateTab(targetTab);
        }

        closeMobileMenu();

    });

});


// =========================================
// MENU RESPONSIVO
// =========================================

function closeMobileMenu() {

    elements.navigation.classList.remove("open");

    elements.menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    elements.menuToggle.setAttribute(
        "aria-label",
        "Abrir menu"
    );

}

elements.menuToggle.addEventListener("click", () => {

    const isOpen = elements.navigation.classList.toggle("open");

    elements.menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    elements.menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
    );

});


// Fecha o menu depois de clicar em um link
elements.navigation.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", closeMobileMenu);

});


// =========================================
// CLIENTE REST DO SUPABASE
// =========================================

/*
    Utilizamos a API REST oficial do Supabase.

    Não é necessário instalar o Supabase SDK.

    O cabeçalho apikey utiliza a chave pública
    configurada no início deste arquivo.
*/

function isSupabaseConfigured() {

    return Boolean(
        SUPABASE_CONFIG.url.trim() &&
        SUPABASE_CONFIG.anonKey.trim()
    );

}


async function supabaseRequest(table) {

    if (!isSupabaseConfigured()) {
        throw new Error("Supabase não configurado.");
    }

    // Evita URLs incorretas com barras duplicadas.
    const baseURL = SUPABASE_CONFIG.url.replace(/\/+$/, "");

    const endpoint = `${baseURL}/rest/v1/${table}?select=*`;

    const response = await fetch(endpoint, {

        method: "GET",

        headers: {
            "apikey": SUPABASE_CONFIG.anonKey,
            "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
            "Accept": "application/json"
        },

        signal: AbortSignal.timeout(10000)

    });

    if (!response.ok) {

        throw new Error(
            `Erro ao consultar ${table}: HTTP ${response.status}`
        );

    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(`Resposta inválida da tabela ${table}.`);
    }

    return data;

}


// =========================================
// CARREGAMENTO DOS DADOS
// =========================================

/*
    Cada tabela é consultada separadamente.

    Se uma consulta falhar, somente aquela
    seção utilizará os dados fictícios.

    Assim, um erro em uma tabela não impede
    o carregamento das demais.
*/

async function loadTable(table, fallback) {

    try {

        const data = await supabaseRequest(table);

        return {
            data,
            isFallback: false
        };

    } catch (error) {

        console.warn(
            `Utilizando dados de exemplo para ${table}:`,
            error.message
        );

        return {
            data: fallback,
            isFallback: true
        };

    }

}


// =========================================
// RENDERIZAÇÃO DOS TREINOS
// =========================================

function renderWorkouts(workouts) {

    if (!workouts.length) {

        elements.workouts.innerHTML = `
            <p>Nenhum treino cadastrado no momento.</p>
        `;

        return;

    }

    elements.workouts.innerHTML = workouts.map((workout, index) => `

        <article class="info-card">

            <span class="card-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>${escapeHTML(workout.name)}</h3>

            <p>${escapeHTML(workout.description)}</p>

            <span class="card-label">
                ${escapeHTML(workout.category)}
            </span>

        </article>

    `).join("");

}


// =========================================
// RENDERIZAÇÃO DOS TREINADORES
// =========================================

function renderTrainers(trainers) {

    if (!trainers.length) {

        elements.trainers.innerHTML = `
            <p>Nenhum treinador cadastrado no momento.</p>
        `;

        return;

    }

    elements.trainers.innerHTML = trainers.map((trainer, index) => `

        <article class="info-card">

            <span class="card-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>${escapeHTML(trainer.name)}</h3>

            <p>${escapeHTML(trainer.description)}</p>

            <span class="card-label">
                ${escapeHTML(trainer.specialty)}
            </span>

        </article>

    `).join("");

}


// =========================================
// RENDERIZAÇÃO DOS HORÁRIOS
// =========================================

function renderHours(hours) {

    if (!hours.length) {

        elements.hours.innerHTML = `
            <p>Horários não disponíveis.</p>
        `;

        return;

    }

    elements.hours.innerHTML = hours.map(item => {

        const schedule = item.opening_time && item.closing_time
            ? `${escapeHTML(item.opening_time)} às ${escapeHTML(item.closing_time)}`
            : escapeHTML(item.notes || "Consulte a disponibilidade");

        return `

            <div class="hours-item">

                <span>${escapeHTML(item.day)}</span>

                <strong>${schedule}</strong>

            </div>

        `;

    }).join("");

}


// =========================================
// RENDERIZAÇÃO DA LOCALIZAÇÃO
// =========================================

function renderLocation(academy) {

    const phoneDigits = String(academy.phone || "").replace(/\D/g, "");

    const address = [
        academy.address,
        academy.neighborhood,
        academy.city,
        academy.state
    ].filter(Boolean).map(escapeHTML).join(" - ");

    elements.location.innerHTML = `

        <article class="location-card">

            <span class="location-icon" aria-hidden="true">⌖</span>

            <h3>Nosso endereço</h3>

            <p>${address || "Endereço não cadastrado."}</p>

        </article>

        <article class="location-card">

            <span class="location-icon" aria-hidden="true">☎</span>

            <h3>Telefone</h3>

            <p>${escapeHTML(academy.phone || "Não informado")}</p>

            ${phoneDigits ? `
                <a href="tel:${phoneDigits}">
                    Ligar para academia
                </a>
            ` : ""}

        </article>

        <article class="location-card">

            <span class="location-icon" aria-hidden="true">✉</span>

            <h3>E-mail</h3>

            <p>${escapeHTML(academy.email || "Não informado")}</p>

            ${academy.email ? `
                <a href="mailto:${encodeURIComponent(academy.email)}">
                    Enviar e-mail
                </a>
            ` : ""}

        </article>

    `;

}


// =========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =========================================

async function initializeApp() {

    elements.currentYear.textContent = new Date().getFullYear();

    // Mantém a aba de treinos selecionada inicialmente.
    activateTab(elements.tabs[0]);

    if (!isSupabaseConfigured()) {

        renderWorkouts(DEMO_DATA.workouts);
        renderTrainers(DEMO_DATA.trainers);
        renderHours(DEMO_DATA.hours);
        renderLocation(DEMO_DATA.academy);

        elements.status.textContent =
            "Exibindo dados fictícios. Configure o Supabase para carregar informações reais.";

        return;

    }

    elements.status.textContent =
        "Carregando informações da academia...";

    try {

        const [
            workoutsResult,
            trainersResult,
            hoursResult,
            academyResult
        ] = await Promise.all([

            loadTable("workouts", DEMO_DATA.workouts),

            loadTable("trainers", DEMO_DATA.trainers),

            loadTable("opening_hours", DEMO_DATA.hours),

            loadTable("academy_info", [DEMO_DATA.academy])

        ]);

        renderWorkouts(workoutsResult.data);

        renderTrainers(trainersResult.data);

        renderHours(hoursResult.data);

        // academy_info deve possuir um único registro.
        renderLocation(
            academyResult.data[0] || DEMO_DATA.academy
        );

        const results = [
            workoutsResult,
            trainersResult,
            hoursResult,
            academyResult
        ];

        const hasFallback = results.some(
            result => result.isFallback
        );

        if (hasFallback) {

            elements.status.textContent =
                "Algumas informações estão utilizando dados de exemplo.";

        } else {

            elements.status.textContent =
                "Informações carregadas com sucesso.";

        }

    } catch (error) {

        console.error("Erro ao inicializar a aplicação:", error);

        elements.status.textContent =
            "Não foi possível carregar as informações.";

    }

}


// =========================================
// INICIAR SITE
// =========================================

document.addEventListener("DOMContentLoaded", initializeApp);
