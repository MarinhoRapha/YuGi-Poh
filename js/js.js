const state = {
  score:{
    playerScore: 0,
    enemyScore: 0,
    scoreBox: document.getElementById('score'),
  },
  cardSprites:{
    avatar: document.getElementById('card_image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCard:{
    player: document.getElementById('player-field-card'),
    enemy: document.getElementById('enemy-field-card'),
  },
  button: document.getElementById('next-duel')
} 

const player = {
  player1: "player-cards"
}

const playersSide = {
    player1: "player-cards",
    enemy: "enemy-cards",
}

const caminhoCarta = "./assets/icons/"
const cardData = [
  {
    id:0,
    name: "Blue Ees White Dragon",
    type: "Paper",
    img: `${caminhoCarta}dragon.png`,
    WinOf:[1],
    LoseOf:[2],
  },
  {
    id:1,
    name: "Dark Magician",
    type: "Rock",
    img: `${caminhoCarta}magician.png`,
    WinOf:[2],
    LoseOf:[0],
  },
  {
    id:2,
    name: "Exodia",
    type: "Scissors",
    img: `${caminhoCarta}exodia.png`,
    WinOf:[0],
    LoseOf:[1],
  }
]

async function checkDuel(playerCardId, enemyCardId) {
  let duelResults = "Empate"
  let playerCard = cardData[playerCardId];
  
  if(playerCard.WinOf.includes(enemyCardId)){
    duelResults = "Ganhou!"
    state.score.playerScore++
    await playSound("win")
  }

  if(playerCard.LoseOf.includes(enemyCardId)){
    duelResults = "Perdeu!"
    state.score.enemyScore++
    await playSound("Lose")
  }

  return duelResults
}

async function playSound(status) {
  const audio = new Audio(`./assets/audios/${status}.wav`) 
  audio.play()
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.enemyScore}`
}

async function drawButton(text) {
  state.button.innerText = text
  state.button.style.display = "block";
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.button.style.display = "none";

  state.fieldCard.player.style.display = "none"
  state.fieldCard.enemy.style.display = "none"

  state.cardSprites.name.innerText = "Selecione";
  state.cardSprites.type.innerText = "Uma Carta!";
  
  init();

}

async function removeAllCards() {
  let cards = document.querySelector('#enemy-cards')
  let imgElements = cards.querySelectorAll('img')
  imgElements.forEach(function(img){
    img.remove();
  })
  
  cards = document.querySelector('#player-cards')
  imgElements = cards.querySelectorAll('img')
  imgElements.forEach(function(img){
    img.remove();
  })
}

async function createCardImage(randomIdCard, fieldSide){
    const cardImages = document.createElement('img');
    cardImages.setAttribute('height', "100px");
    cardImages.setAttribute('src', "./assets/icons/card-back.png");
    cardImages.setAttribute('data-id', randomIdCard);
    cardImages.classList.add('card');

    if(fieldSide === playersSide.player1){
        cardImages.addEventListener('mouseover', function(){
          drawSelectCard(randomIdCard);
        });

        cardImages.addEventListener('click', function(){
          setCardsField(cardImages.getAttribute('data-id'));
        })
    };

    return cardImages;
}

async function setCardsField(cardId) {
  await removeAllCards();

  let enemyCardId = await getRandomCardId();

  state.fieldCard.player.style.display = "block";
  state.fieldCard.enemy.style.display = "block";

  state.fieldCard.player.src = cardData[cardId].img
  state.fieldCard.enemy.src = cardData[enemyCardId].img

  let duelResults = await checkDuel(cardId, enemyCardId);

  await updateScore();
  await drawButton(duelResults);

}

async function drawSelectCard(id) {
    state.cardSprites.avatar.src = cardData[id].img;
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = 'Attribute :' + cardData[id].type;
}


async function getRandomCardId(){
   const randomIndex = Math.floor(Math.random() * cardData.length);
      return cardData[randomIndex].id;
}

async function drawCards(cardNumber, fieldSide){
  for(let i = 0; i < cardNumber; i++){
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage)
  }
}



function init(){
  drawCards(5, playersSide.player1);
  drawCards(5, playersSide.enemy);

  state.fieldCard.player.style.display = "none";
  state.fieldCard.enemy.style.display = "none";
}

init();