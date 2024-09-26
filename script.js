function shootingStars() {
    const style = document.createElement('style');
    style.textContent = `
        #stars, #shooting-stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.5;
        }
    
        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            opacity: 0;
            animation: twinkle 2s infinite;
        }
    
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    
        .shooting-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, white, rgba(255, 255, 255, 0));
            opacity: 0;
            animation: shoot 1s ease-out;
        }
    
        @keyframes shoot {
            from {
                transform: translateY(0) translateX(0);
                opacity: .8;
            }
            to {
                transform: translateY(-200px) translateX(600px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars';
    document.body.appendChild(starsContainer);
    
    const shootingStarsContainer = document.createElement('div');
    shootingStarsContainer.id = 'shooting-stars';
    document.body.appendChild(shootingStarsContainer);
    
    function createStars() {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            starsContainer.appendChild(star);
        }
    }
    
    function createShootingStars() {
        setInterval(() => {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.top = `${Math.random() * 100}vh`;
            shootingStar.style.left = `${Math.random() * 100}vw`;
            shootingStarsContainer.appendChild(shootingStar);
            setTimeout(() => {
                shootingStar.remove();
            }, 1000);
        }, 1000);
    }
    
    createStars();
    createShootingStars();
}

shootingStars();

const languageMap = {
    "en-US": "en", "en-GB": "en", "en-CA": "en", "en-AU": "en", 
    "en-NZ": "en", "en-IE": "en", "en-ZA": "en", "en-IN": "en",
    "pt-BR": "pt", "pt-PT": "pt",
    "es-ES": "es", "es-MX": "es", "es-AR": "es", "es-CO": "es",
    "es-PE": "es", "es-VE": "es", "es-CL": "es", "es-EC": "es",
    "es-GT": "es", "es-CR": "es", "es-PA": "es", "es-DO": "es",
    "es-UY": "es", "es-PY": "es", "es-SV": "es", "es-HN": "es",
    "es-NI": "es", "es-BO": "es", "es-PR": "es"
};

// 
let language = languageMap[navigator.language] ?? "en";


// QUERY
const getQuerry = s => document.querySelector(s);
const getAll = s => document.querySelectorAll(s);
const getId  = s => document.getElementById(s);

// GET LOCALE 
const xhr = new XMLHttpRequest();
xhr.open('GET', `locale/commands.json`, false);
xhr.send();

const commandsInfo = JSON.parse(xhr.responseText);

try {
    xhr.open('GET', `locale/${language}.json`, false);
    xhr.send();
} catch {
    xhr.open('GET', `locale/en.json`, false);
    xhr.send();
}

const text = JSON.parse(xhr.responseText);

const links         = getAll('nav ul li a');
const sections      = getAll('.section');
const subnavButtons = getAll('.subnav button');
const subSections   = getAll('.sub-section');

const commandsList = {
    dragonCity: getId('dragon-city-commands-list'),
    configurations: getId('configurations-commands-list'),
    guide: getId('guide-commands-list')
};

function updateText() {
    document.querySelectorAll('[data-translate]')
    .forEach(element => {
        let locale = { ...text };
        element.getAttribute('data-translate')
        .split(".").forEach(k => locale = locale[k]);
        if (locale) element.innerHTML = locale;
      });
}

if (navigator.language === "pt-BR") {
    try { getQuerry('.fa-pix').style.display = "flex"; }
    catch {}
}

function displayCommands(category) {
    commandsList[category].innerHTML = '';
    commandsInfo[category]
    .sort((a, b) => a.name[language].localeCompare(b.name[language]))
    .sort((a, b) => (a.prefix? -1 : b.prefix? 1 : 0))
    .forEach((command, index) => {
        const [name, desc, spoiler, prefix] = [
            command.name[language],
            command.desc[language],
            command.spoiler,
            command.prefix
        ];
        
        const cmdItem = document.createElement('div');
        cmdItem.classList.add('command-item');
        cmdItem.innerHTML = `
            <div class="command-name">${name}</div>
            <div class="command-desc">${desc}</div>
            <div class="command-support">
                <i class="support-icon ${true ? 'active' : 'inactive'}">/</i>
                <i class="fas support-icon ${prefix ? 'active' : 'inactive'} minus">─</i>
                <i class="fas support-icon ${spoiler ? 'active' : 'inactive'} spoiler">SPOILER</i>
            </div>
        `;
        commandsList[category].appendChild(cmdItem);
        setTimeout(() => cmdItem.classList.add("visible"), index * 200);
    });
}

function setActiveSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
    });
    const activeSection = getId(sectionId);
    activeSection.classList.add('active');
    activeSection.style.opacity = 1;
    activeSection.style.transform = 'translateY(0)';
}

function setupNavigation() {
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            setActiveSection(sectionId);
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (sectionId === 'commands') {
                handleCommandsSection();
            }
        });
    });

    subnavButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryId = button.getAttribute('data-category');
            handleSubnavButton(button, categoryId);
        });
    });
}

function handleCommandsSection() {
    const defaultCategoryId = document.querySelector('.subnav button.active')?.dataset?.category ?? "dragonCity";
    resetSubnav();
    const defaultSubSection = getId(defaultCategoryId);
    defaultSubSection.classList.add('active');
    defaultSubSection.style.opacity = 1;
    defaultSubSection.style.transform = 'translateY(0)';
    getQuerry(`[data-category="${defaultCategoryId}"]`).classList.add('active');
    displayCommands(defaultCategoryId);
}

function resetSubnav() {
    subnavButtons.forEach(btn => btn.classList.remove('active'));
    subSections.forEach(subSection => {
        subSection.classList.remove('active');
        subSection.style.opacity = 0;
        subSection.style.transform = 'translateY(20px)';
    });
}

function handleSubnavButton(button, categoryId) {
    resetSubnav();
    const targetSubSection = getId(categoryId);
    targetSubSection.classList.add('active');
    targetSubSection.style.opacity = 1;
    targetSubSection.style.transform = 'translateY(0)';
    button.classList.add('active');
    displayCommands(categoryId);
}

function initializeFromHash() {
    const hash = window.location.hash.replace("#", "") || 'home';
    const link = Array.from(links).find(item => item.dataset.section === hash);

    if (link) {
        const sectionId = link.getAttribute('data-section');
        setActiveSection(sectionId);
        link.classList.add('active');
        if (sectionId === 'commands') handleCommandsSection();
    } else {
        setActiveSection('home');
    }
}

async function loadContent() {
    updateText();
    setupNavigation();
    initializeFromHash();
}

loadContent();