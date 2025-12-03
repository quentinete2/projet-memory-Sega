isLoggedIn = auth.isLoggedIn();

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
        <p class="description">${theme.description}</p>

        <button class="btn-play" data-theme-id="${theme.id}" data-theme-path="${theme.path}">
            Jouer
        </button>

        <P2>Nombre de Paire Max</P2>
        <input type="text" class="inputMax"/>

        <button class="btn-fav">Ajouter aux favoris ⭐</button>
    `;

    const playButton = card.querySelector('.btn-play');
    const favButton = card.querySelector('.btn-fav');
    const inputMax = card.querySelector('.inputMax');

    if (isLoggedIn) {

        playButton.addEventListener('click', () => {
            const maxPairs = parseInt(inputMax.value);
            if (isNaN(maxPairs) || maxPairs < 1) {
                const maxPairs = 30;
                startGame(theme.id, theme.path, maxPairs);
            } else {
            startGame(theme.id, theme.path, maxPairs);
            }
        });

        favButton.addEventListener('click', () => {
            const maxPairs = parseInt(inputMax.value);

            if (isNaN(maxPairs) || maxPairs < 1) {
                const maxPairs = 151;
                addFavorite(theme.id, theme.path, maxPairs);
                displayFavorites();
            }

            addFavorite(theme.id, theme.path, maxPairs);
            displayFavorites();
        });

    } else {
        playButton.disabled = true;
        playButton.textContent = 'Connectez-vous pour jouer';
        favButton.disabled = true;
    }

    return card;
}


function addFavorite(themeId, themePath, maxPairs ) {
    const username = auth.getCurrentUser();
    if (!username) {
        alert("Vous devez être connecté pour ajouter un favori !");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem('favorites')) || {};

    if (!favorites[username]) {
        favorites[username] = [];
    }

    const existing = favorites[username].find(f => f.themeId === themeId);

    if (existing) {
        existing.maxPairs = maxPairs;
        existing.path = themePath;
        existing.date = new Date().toISOString();
    } else {
        favorites[username].push({
            themeId,
            maxPairs,
            path: themePath,
            date: new Date().toISOString()
        });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert("Thème ajouté à vos favoris !");
}


function removeFavorite(themeId) {
    const username = auth.getCurrentUser();
    if (!username) return;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    if (!favorites[username]) return;

    favorites[username] = favorites[username].filter(f => f.themeId !== themeId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    displayFavorites();
}

function displayFavorites() {
    const username = auth.getCurrentUser();
    if (!username) return;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    const userFavs = favorites[username] || [];

    const container = document.getElementById('favoriteList2');
    container.innerHTML = '';

    if (userFavs.length === 0) {
        container.innerHTML = "<p>Aucun favori pour l'instant.</p>";
        return;
    }

    userFavs.forEach(fav => {
        const div = document.createElement('div');
        div.className = "fav-card";

        div.innerHTML = `
            <h4 class="theme-icon">${fav.themeId}</h4>
            <p class="description">Max paires : ${fav.maxPairs}</p>
            <button class="btn-play">Jouer ⭐</button>
            <button class="btn-remove">Supprimer ❌</button>
        `;

        const playBtn = div.querySelector('.btn-play');
        playBtn.addEventListener('click', () => {
            startGame(fav.themeId, fav.path, fav.maxPairs);
        });

        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', () => {
            removeFavorite(fav.themeId);
        });

        container.appendChild(div);
    });
}

function startGame(themeId, themePath, maxPairs) {
    localStorage.setItem('selectedTheme', JSON.stringify({
        id: themeId,
        path: themePath,
        maxPairs: maxPairs
    }));

    const currentPath = window.location.pathname;
    const targetPath = currentPath.includes('/html/') ? 'game.html' : 'html/game.html';
    window.location.href = targetPath;
}


document.addEventListener("DOMContentLoaded", () => {
    loadThemes();
    displayFavorites();
});
