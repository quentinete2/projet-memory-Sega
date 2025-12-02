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

async function initGame() {
    if (!selectedTheme) {
        console.error('Aucun thème sélectionné');
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('themeName').textContent = selectedTheme.id;
    await Number_Images();
    setupCards();
    console.log(cards);
    console.log(countImg);
    shuffleCards();
    console.log(array);
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
                    console.log(`Image ${i}${ext} trouvée`);
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
    cards = [];
    for (let i of countImg) {
        const ext = imageExtensions[i] || '.png';
        const card1 = { id: i, img: `../${selectedTheme.path}${i}${ext}`, flipped: false, matched: false };
        cards.push({ ...card1 }, { ...card1 });

    }
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
    } 
    else {
        first.element.classList.remove("flipped");
        second.element.classList.remove("flipped");

        first.card.flipped = false;
        second.card.flipped = false;
    }

    flippedCards = [];
}



document.addEventListener('DOMContentLoaded', initGame);
