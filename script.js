document.addEventListener('DOMContentLoaded', async () => {
    
    const links = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.section');
    const subnavButtons = document.querySelectorAll('.subnav button');
    const subSections = document.querySelectorAll('.sub-section');
    const commandsList = {
        dragonCity: document.getElementById('dragon-city-commands-list'),
        configurations: document.getElementById('configurations-commands-list'),
        guide: document.getElementById('guide-commands-list')
    };

    const languageMap = {
        "en-US": "en",
        "en-GB": "en",
        "en-CA": "en",
        "en-AU": "en",
        "en-NZ": "en",
        "en-IE": "en",
        "en-ZA": "en",
        "en-IN": "en",
        "pt-BR": "pt",
        "pt-PT": "pt",
        "es-ES": "es",
        "es-MX": "es",
        "es-AR": "es",
        "es-CO": "es",
        "es-PE": "es",
        "es-VE": "es",
        "es-CL": "es",
        "es-EC": "es",
        "es-GT": "es",
        "es-CR": "es",
        "es-PA": "es",
        "es-DO": "es",
        "es-UY": "es",
        "es-PY": "es",
        "es-SV": "es",
        "es-HN": "es",
        "es-NI": "es",
        "es-BO": "es",
        "es-PR": "es"
    };

    let language = localStorage.getItem("lang") || languageMap[navigator.language] || "en";
    if (navigator.language === "pt-BR") {
        document.querySelector('.fa-pix')
        .style.display = "flex";
    }
    
    const data = await (await fetch('data.json')).json();
    // alert(data[language].alert);

    function updateText(text) {
        document.getElementById('home-title').textContent = text.botName;
        document.getElementById('home-description').textContent = text.botDesc;
        document.getElementById('commands-nav').textContent = text.commandsBtnText;
        document.getElementById('donate-nav').textContent = text.donateBtnText;
        
        document.getElementById('dragon-city-desc').innerHTML = text.dragonCityCmdDesc;
        document.getElementById('configurations-desc').innerHTML = text.configurationCmdDesc;
        document.getElementById('donate-description').innerHTML = text.donateDesc;
    }

    function displayCommands(category) {
        const commands = data[language].commands[category];
        commandsList[category].innerHTML = '';
        commandsList[category].scrollTo(0, 0);
        commands.sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => {
            if (a.prefix && !b.prefix) return -1;
            if (!a.prefix && b.prefix) return 1;
            return 0;
        })
        .forEach((cmd, index) => {
            const cmdItem = document.createElement('div');
            cmdItem.classList.add('command-item');
            cmdItem.innerHTML = `
                <div class="command-name">${cmd.name}</div>
                <div class="command-desc">${cmd.desc}</div>
                <div class="command-support">
                    <i class="support-icon ${true ? 'active' : 'inactive'}">/</i>
                    <i class="fas support-icon ${cmd.prefix ? 'active' : 'inactive'} minus">─</i>
                    <i class="fas support-icon ${cmd.spoiler ? 'active' : 'inactive'} spoiler">SPOILER</i>
                </div>
            `;
            commandsList[category].appendChild(cmdItem);
            setTimeout(() => {
                cmdItem.classList.add("visible");
            }, index * 200);
        });
    }

    function setActiveSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.opacity = 0;
            section.style.transform = 'translateY(20px)';
        });
        document.getElementById(sectionId).classList.add('active');
        document.getElementById(sectionId).style.opacity = 1;
        document.getElementById(sectionId).style.transform = 'translateY(0)';
    }

    async function loadContent() {
        updateText(data[language]);

        // Navegação principal
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                setActiveSection(sectionId);
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                if (sectionId === 'commands') {
                    const defaultCategoryId = 'dragonCity';
                    subnavButtons.forEach(btn => btn.classList.remove('active'));
                    subSections.forEach(subSection => {
                        subSection.classList.remove('active');
                        subSection.style.opacity = 0;
                        subSection.style.transform = 'translateY(20px)';
                    });

                    const defaultSubSection = document.getElementById(defaultCategoryId);
                    defaultSubSection.classList.add('active');
                    defaultSubSection.style.opacity = 1;
                    defaultSubSection.style.transform = 'translateY(0)';
                    document.querySelector(`[data-category="${defaultCategoryId}"]`).classList.add('active');

                    displayCommands(defaultCategoryId);
                }
            });
        });

        // Navegação secundária
        subnavButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                subnavButtons.forEach(btn => btn.classList.remove('active'));
                subSections.forEach(subSection => {
                    subSection.classList.remove('active');
                    subSection.style.opacity = 0;
                    subSection.style.transform = 'translateY(20px)';
                });

                const categoryId = button.getAttribute('data-category');
                const targetSubSection = document.getElementById(categoryId);
                targetSubSection.classList.add('active');
                targetSubSection.style.opacity = 1;
                targetSubSection.style.transform = 'translateY(0)';
                button.classList.add('active');

                displayCommands(categoryId);
            });
        });

        // Definindo a seção ativa com base no hash da URL
        const hash = window.location.hash.replace("#", "") || 'home';
        const link = Array.from(links).find(item => item.dataset.section === hash);

        if (link) {
            const sectionId = link.getAttribute('data-section');
            setActiveSection(sectionId);
            link.classList.add('active');

            if (sectionId === 'commands') {
                const defaultCategoryId = 'dragonCity';
                subnavButtons.forEach(btn => btn.classList.remove('active'));
                subSections.forEach(subSection => {
                    subSection.classList.remove('active');
                    subSection.style.opacity = 0;
                    subSection.style.transform = 'translateY(20px)';
                });

                const defaultSubSection = document.getElementById(defaultCategoryId);
                defaultSubSection.classList.add('active');
                defaultSubSection.style.opacity = 1;
                defaultSubSection.style.transform = 'translateY(0)';
                document.querySelector(`[data-category="${defaultCategoryId}"]`).classList.add('active');

                displayCommands(defaultCategoryId);
            }
        } else {
            setActiveSection('home');
        }
    }

    loadContent();
});