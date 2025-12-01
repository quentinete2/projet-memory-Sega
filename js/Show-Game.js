async function loadThemes() {
    try {
        const response = await fetch('themes.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        displayThemes(data.themes);
    } catch (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
        const container = document.getElementById('themes-container');
        if (container) {
            container.innerHTML = '<p style="color: red;">Erreur : Impossible de charger les thèmes</p>';
        }
    }
}

function displayThemes(themes) {
    const container = document.getElementById('themes-container');
    
    if (!container) {
        console.error('Element #themes-container non trouvé');
        return;
    }

    container.innerHTML = '';

    themes.forEach(theme => {
        const card = createThemeCard(theme);
        container.appendChild(card);
    });
}

function createThemeCard(theme) {
    const card = document.createElement('div');
    card.className = 'theme-card';
    card.innerHTML = `
        <div class="theme-icon">${theme.icon}</div>
        <h3>${theme.name}</h3>
        <p>${theme.description}</p>
        <button class="btn-play" data-theme-id="${theme.id}" data-theme-path="${theme.path}">
            Jouer
        </button>
    `;

    const playButton = card.querySelector('.btn-play');
    playButton.addEventListener('click', () => {
        startGame(theme.id, theme.path);
    });
    
    return card;
}

function startGame(themeId, themePath) {
    console.log(`Démarrage du jeu avec le thème: ${themeId}`);
    console.log(`Chemin des ressources: ${themePath}`);

    localStorage.setItem('selectedTheme', JSON.stringify({
        id: themeId,
        path: themePath
    }));

    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', loadThemes);
