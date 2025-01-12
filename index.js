const container = document.querySelector(".container");
const scoreElement = document.querySelector(".score");
let cards = [];
let firstCard = null; 
let secondCard = null;
let lockBoard = false;
let score = 0;


fetch("./kort.json")
  .then( res => {
    if (!res.ok) throw new Error("Failed to load kort.json");
    return res.json();
  })
  
  .then( data =>  {
    cards = [...data, ...data]; //To kort for par
    shuffleCards();
    generateCards();
  })
  .catch(err => console.error("Error loading cards:", err));

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
   }
}

function generateCards() {
  container.innerHTML = ""; // Tømmer container før den lager kort 
  cards.forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("data-name", card.name);

      cardElement.innerHTML = `
          <div class="card-inner">
              <div class="card-front">
                  <img src="${card.image}" alt="${card.name}" />
              </div>
              <div class="card-back"></div>
          </div>
      `;

    container.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  scoreElement.textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  scoreElement.textContent = score;
  generateCards();
}
