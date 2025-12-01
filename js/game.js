const selectedTheme = JSON.parse(localStorage.getItem('selectedTheme'));

let cards = [];
let flippedCards = [];
let matchedCards = [];
let attempts = 0;
let pairsFound = 0;
let sucsess = false;
let Nb_img = 0;

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
}

async function Number_Images() {
    const themePath = `../${selectedTheme.path}`;
    const imageExtensions = ['.png', '.webp', '.svg', '.jpg', '.jpeg'];
    let count = 0;
    for (let i = 1; i <= 50; i++) {
        let found = false;
        for (const ext of imageExtensions) {
            const imagePath = `${themePath}${i}${ext}`;
          
            try {
                const response = await fetch(imagePath, { method: 'HEAD' });
                if (response.ok) {
                    count++;
                    found = true;
                    console.log(`Image ${i}${ext} trouvée`);
                    break;
                }
            } catch (error) {
            }
        }
        if (!found && i > count + 5) {
            break;
        }
    }
    Nb_img = count;
    console.log(`Total: ${Nb_img} images trouvées`);
    return count;
}

function setupCards() {
    cards = [];
    for (let i = 1; i <= Nb_img; i++) {
        const card1 = { id: i, img: `../${selectedTheme.path}${i}`, flipped: false, matched: false };
        cards.push(card1);
    }
}

document.addEventListener('DOMContentLoaded', initGame);
