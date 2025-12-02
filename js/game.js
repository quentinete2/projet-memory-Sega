const selectedTheme = JSON.parse(localStorage.getItem('selectedTheme'));

let cards = [];
let array = [];
let flippedCards = [];
let matchedCards = [];
let attempts = 0;
let pairsFound = 0;
let sucsess = false;
let Nb_img = 0;
let imageExtensions = {};
let countImg = [];
let Max = 0;

async function initGame() {
    if (!selectedTheme) {
        console.error('Aucun thème sélectionné');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('themeName').textContent = selectedTheme.id;
    await Number_Images();
    setupCards();
    shuffleCards();
    console.log("array", array);
    updateGrid();
    displaycards();
}

async function Number_Images() {
    const themePath = `../${selectedTheme.path}`;
    const extensions = ['.png', '.webp', '.svg', '.jpg', '.jpeg'];
    countImg = [];
    let count = 0;
    for (let i = 1; i <= 30; i++) {
        let found = false;
        for (const ext of extensions) {
            const imagePath = `${themePath}${i}${ext}`;
            try {
                const response = await fetch(imagePath, { method: 'HEAD' });
                if (response.ok) {
                    count++;
                    countImg.push(i);
                    found = true;
                    imageExtensions[i] = ext;
                    break;
                }
            } catch (error) {        
            }
        }
    }
    Nb_img = count;
    console.log(`Total: ${Nb_img} images trouvées`);
    return count;
}

function setupCards() {
    const themeData = JSON.parse(localStorage.getItem('selectedTheme'));
    let Max = parseInt(themeData.maxPairs*2);
    console.log("Max from themeData:", Max);

    const limitedImages = countImg.slice(0, Max);
    console.log("limitedImages:", limitedImages);
    console.log("countImg", countImg);


    cards = [];
    for (let i of limitedImages) {
        const ext = imageExtensions[i] || '.png';

        const card = { 
            id: i, 
            img: `../${selectedTheme.path}${i}${ext}`, 
            flipped: false, 
            matched: false 
        };

        cards.push({ ...card });
    }
    console.log("cards", cards);
}


function shuffleCards() {
  array = cards.slice();
  
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displaycards() {
    const board = document.getElementById('gameBoard');
    const template = document.getElementById("card-template");
    board.innerHTML = "";

    array.forEach((card, index) => {
        const clone = template.content.cloneNode(true);
        const img = clone.querySelector(".card-img");
        const cardElement = clone.querySelector(".card");

        img.src = card.img;
        cardElement.dataset.index = index;

        cardElement.addEventListener("click", CardClick);

        board.appendChild(clone);
    });
}

function CardClick(e) {
    const cardElement = e.currentTarget;
    const index = cardElement.dataset.index;
    const card = array[index];

    if (card.flipped || flippedCards.length === 2) return;

    cardElement.classList.add("flipped");
    card.flipped = true;
    flippedCards.push({ card, element: cardElement });

    if (flippedCards.length === 2) {
        attempts++;
        document.getElementById("attempts").textContent = attempts;

        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [first, second] = flippedCards;

    if (first.card.id === second.card.id) {
        first.card.matched = true;
        second.card.matched = true;
        pairsFound++;

    if (pairsFound === cards.length / 2) {
        setTimeout(() => {
            alert(`Félicitations ! Vous avez gagné en ${attempts} tentatives !`);
            if (attempts > 100) {
                alert("Vous êtes vraiment nulle en mémoire !Aller dormir un peu !");
            }
            const username = auth.getCurrentUser();
            if (username) {
                saveScore(selectedTheme.id, username, attempts);
            }

            window.location.reload();
        }, 300);
    }

    } else {
        first.element.classList.remove("flipped");
        second.element.classList.remove("flipped");

        first.card.flipped = false;
        second.card.flipped = false;
    }

    flippedCards = [];
}

function updateGrid() {
    const board = document.getElementById('gameBoard');
    const totalCards = array.length;

    const columns = Math.ceil(Math.sqrt(totalCards));

    board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

function saveScore(themeId, username, attempts) {
    let scoreboards = JSON.parse(localStorage.getItem('scoreboards')) || {};

    if (!scoreboards[themeId]) scoreboards[themeId] = [];

    scoreboards[themeId].push({
        user: username,
        attempts: attempts,
        date: new Date().toISOString()
    });

    scoreboards[themeId] = scoreboards[themeId]
        .sort((a, b) => a.attempts - b.attempts)
        .slice(0, 10);

    localStorage.setItem('scoreboards', JSON.stringify(scoreboards));
}


function displayScoreboard(themeId) {
    const scoreboards = JSON.parse(localStorage.getItem('scoreboards')) || {};
    const scores = scoreboards[themeId] || [];
    const scoreList = document.getElementById('scoreList');
    const themeTitle = document.getElementById('themeTitle');

    themeTitle.textContent = themeId;
    scoreList.innerHTML = '';

    if (scores.length === 0) {
        scoreList.innerHTML = '<li>Aucun score pour ce thème</li>';
        return;
    }

    scores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.user} - ${entry.attempts} tentatives (${new Date(entry.date).toLocaleDateString()})`;
        scoreList.appendChild(li);
    });
}

function displayScoreboard(themeId) {
    const scoreboards = JSON.parse(localStorage.getItem('scoreboards')) || {};
    const scores = scoreboards[themeId] || [];
    scores.sort((a, b) => a.attempts - b.attempts);
    const topScores = scores.slice(0, 10);

    const tableBody = document.getElementById('scoreTableBody');
    const themeTitle = document.getElementById('themeTitle');

    themeTitle.textContent = themeId;
    tableBody.innerHTML = '';

    if (topScores.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'Aucun score pour ce thème';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    topScores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.user}</td>
            <td>${entry.attempts}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

function displayPersonalScoreboard(themeId, username) {
    const scoreboards = JSON.parse(localStorage.getItem('scoreboards')) || {};
    const scores = scoreboards[themeId] || [];
    const personalScores = scores.filter(entry => entry.user === username);
    const topPersonal = personalScores.sort((a, b) => a.attempts - b.attempts).slice(0, 10);

    const tableBody = document.getElementById('personalScoreTableBody');
    const themeTitle = document.getElementById('personalThemeTitle');

    themeTitle.textContent = themeId;
    tableBody.innerHTML = '';

    if (topPersonal.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'Aucun score pour ce thème';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    topPersonal.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.attempts}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();

    const selectedTheme = JSON.parse(localStorage.getItem('selectedTheme'));
    const username = auth.getCurrentUser();

    if (selectedTheme) {
        displayScoreboard(selectedTheme.id);
    }

    if (selectedTheme && username) {
        displayPersonalScoreboard(selectedTheme.id, username);
    }
});



document.addEventListener('DOMContentLoaded', initGame);
