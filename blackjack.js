var dealerSum = 0, playerSum = 0;
var dealerAceCount = 0, playerAceCount = 0;
var hidden, deck;

var canHit = true;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let types = ['C', 'D', 'H', 'S'];
    deck = [];

    for(let i = 0 ; i < types.length ; i++) {
        for(let j = 0 ; j < values.length ; j++) {
            deck.push(`${values[j]}-${types[i]}`); // Load all 52 cards
        }
    }
}

function shuffleDeck() {
    for (let i = 0 ; i < deck.length ; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
    while(dealerSum < 17) {
        giveCard("dealer");
    }
    
    for (let i = 0 ; i < 2 ; i++) {
        giveCard("player");
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);

    document.getElementById("dealer-sum").innerText = '-';
    document.getElementById("player-sum").innerText = reduceAce(playerSum, playerAceCount);
}   

function getValue(card) {
    let value = card.split('-')[0];

    if (isNaN(value)) {
        if(value == 'A'){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if(card[0] == "A") {
        return 1 ;  
    }
    return 0;
}

function hit() {
    if (!canHit) {
        return;
    }
    giveCard("player");

    if (reduceAce(playerSum, playerAceCount) > 21){
        canHit = false;
        document.getElementById("hidden").src = `/cards/${hidden}.png`;
        let message = "";

        if(playerSum > 21) 
            message = "You bust !";
        else if (dealerSum > 21 ) 
            message = "You win !"
        else if (playerSum == dealerSum)
            message = "Tie !"
        else if (playerSum > dealerSum)
            message = "You win !"
        else if (playerSum < dealerSum)
            message = "You lose !"
    
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("player-sum").innerText = playerSum;
        document.getElementById("results").innerHTML = message;
        document.getElementsByClassName("buttons").disabled = true;
    }
    
    document.getElementById("player-sum").innerText = reduceAce(playerSum, playerAceCount);
}

function stand() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    playerSum = reduceAce(playerSum, playerAceCount);
    canHit = false;

    document.getElementById("hidden").src = `/cards/${hidden}.png`

    let message = "";
    
    if(playerSum > 21) 
        message = "You bust !";
    else if (dealerSum > 21 ) 
        message = "You win !"
    else if (playerSum == dealerSum)
        message = "Tie !"
    else if (playerSum > dealerSum)
        message = "You win !"
    else if (playerSum < dealerSum)
        message = "You lose !"


    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = playerSum;
    document.getElementById("results").innerHTML = message;
    document.getElementsByClassName("buttons").disabled = true;
}


function giveCard(name) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = `/cards/${card}.png`;
    cardImg.style.position = "";
    if (name == 'player') {
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);

    } else if (name == 'dealer') {
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0){
        playerSum -= 10;
        playerAceCount--;
    }
    return playerSum;
}

