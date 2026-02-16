/*
game starts with everyone placing a bet
dealer deals 1 card face up to each player, then 1 to themselves
then dealer deals a second card face up to each player, then 1 to themselves face down
if a player's two cards equal 21 (natural blackjack), they automatically win and receive a 1.5x payout, that winning player's round ends and waits for other players
otherwise, dealer asks for player action
player:
    hit - take another card
    stand/stay - take no more cards
    double down - increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
    split - create two hands from a starting hand where both cards have the same value. each new hand gets a second card resulting in two starting hands. this requires an additional bet on the second hand. the two hands are played out independently, and the wager on each hand is won or lost independently.
    surrender - forfeit half the bet and end the hand immediately. not allowed after splitting.
there's no limit to how many cards you can have in your hand, but if it's over 21 then bust and gg, lose your bet
if hand is 17 or higher, should stay
dealer always stands on 17
if dealer busts, every player wins the round
if dealer doesn't bust, only the player(s) with higher hand than dealer win payout
player win 2x payout

states:
get player input
deal: deal to player(s), then dealer
get player input
process input and update values
redraw board

logic:
have action buttons hidden
ask player bet (should have min bet when deal button is clicked)
player clicks chips to add to their bet
player clicks deal
game starts
show action buttons

*/


const SUITS = ["hearts", "diamonds", "spades", "clubs"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "queen", "king"];
const MAX_CHIPS = 999999999999;
const MAX_CHIP_VAL = 500;
const MIN_SHUFFLES = 3;
const MIN_BET = 1;


class Pot {
    constructor() {
        let total = 0;

        this.getTotal = function() {
            return total;
        };

        this.add = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total + value) > MAX_CHIPS) {
                return false;
            }

            total += value;

            return true;
        };

        this.subtract = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total - value) < 0) {
                return false;
            }

            total -= value;

            return true;
        };
    }
}


class Card {
    constructor(suit, rank) {
        // used to get the className
        const RANK_MAP = {
            "2": "two",
            "3": "three",
            "4": "four",
            "5": "five",
            "6": "six",
            "7": "seven",
            "8": "eight",
            "9": "nine",
            "10": "ten",
            "ace": "ace",
            "jack": "jack",
            "queen": "queen",
            "king": "king"
        };

        let s = suit;
        let r = rank;

        this.getCard = function() {
            return this;
        };

        this.getSuit = function() {
            return s;
        };

        this.getRank = function() {
            return r;
        };

        this.printCard = function() {
            console.log(this.getRank() + " of " + this.getSuit());
        };

        this.getClassName = function() {
            let cName = "";

            cName = RANK_MAP[this.getRank()] + "-of-" + this.getSuit();

            return cName;
        };
    }
}


class Deck {
    constructor() {
        let deck = [];

        for (let s = 0; s < SUITS.length; s++) {
            for (let r = 0; r < RANKS.length; r++) {
                let card = new Card(SUITS[s], RANKS[r]);
                deck.push(card);
            }
        }

        this.getDeck = function() {
            return deck;
        };

        this.isEmpty = function() {
            if (deck.length == 0) {
                return true;
            }

            return false;
        };

        this.shuffleDeck = function(shuffles=1) {
            let max = deck.length - 1;
            for (let i = deck.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (max + 1));

                let temp = deck[i];
                deck[i] = deck[j];
                deck[j] = temp;
            }
        };

        this.printDeck = function() {
            for (let i = 0; i < deck.length; i++) {
                deck[i].printCard();
            }
        };
    }
}


class Shoe {
    constructor(decks=2) {
        let shoe = [];

        for (let _ = 0; _ < decks; _++) {
            let deck = new Deck();
            deck = deck.getDeck();

            for (let j = 0; j < deck.length; j++) {
                shoe.push(deck[j]);
            }
        }

        this.getShoe = function() {
            return shoe;
        };

        this.isEmpty = function() {
            if (shoe.length == 0) {
                return true;
            }

            return false;
        };

        this.shuffleShoe = function(shuffles=1) {
            for (let _ = 0; _ < shuffles; _++) {
                let max = shoe.length - 1;
                for (let i = shoe.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (max + 1));

                    let temp = shoe[i];
                    shoe[i] = shoe[j];
                    shoe[j] = temp;
                }
            }
        };

        this.drawCard = function() {
            if (this.isEmpty()) {
                return false;
            }

            let card = shoe.shift();
            // card.printCard();

            return card;
        };

        this.printShoe = function() {
            for (let i = 0; i < shoe.length; i++) {
                shoe[i].printCard();
            }
        };
    }
}


class Hand {
    constructor() {
        let hand = [];
        let splitHand = [];

        this.getHand = function() {
            return hand;
        };

        this.getSplitHand = function() {
            return splitHand;
        };

        this.addToHand = function(card) {
            hand.push(card);
        };

        this.addToSplitHand = function(card) {
            splitHand.push(card);
        };

        this.fan = function() {
            /*
                iterate through each card in the hand and modify the position to a fan

                get the middle index
            */
        };
    }
}


class Player extends Hand {
    /*
    player:
        hit - take another card
        stand/stay - take no more cards
        double down - increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
        split - create two hands from a starting hand where both cards have the same value. each new hand gets a second card resulting in two starting hands. this requires an additional bet on the second hand. the two hands are played out independently, and the wager on each hand is won or lost independently.
        surrender - forfeit half the bet and end the hand immediately. not allowed after splitting.
    */
    constructor() {
        const STARTING_CHIPS = 100;

        super();
        let total = STARTING_CHIPS;
        let chips = document.getElementById("player-chips");
        chips.innerText = total;
        let standing = false; // also used for bust

        this.getChips = function() {
            return total;
        };

        this.add = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total + value) > MAX_CHIPS) {
                return false;
            }

            total += value;

            return true;
        };

        this.subtract = function(value=0) {
            if (value <= 0 || value > MAX_CHIP_VAL || (total - value) < 0) {
                return false;
            }

            total -= value;

            return true;
        };

        this.hit = function() {
            if (!playerTurn) {
                return false;
            }

            let drawnCard = shoe.drawCard();
            this.addToHand(drawnCard);
            updateHand("player-hand");

            return true;
        };

        this.stand = function() {
            if (!playerTurn) {
                return false;
            }

            // take no more cards during turn
            if (!standing) {
                standing = true;
            }

            return true;
        };

        this.doubleDown = function() {
            if (!playerTurn) {
                return false;
            }

            /*
            increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
            */
            let currentBet = pot.getTotal();

            if (!dealer.takeChips(currentBet)) {
                return false;
            }

            this.hit();
            updateTotals();

            return true;
        };

        this.split = function() {
            if (!playerTurn) {
                return false;
            }


            return true;
        };

        this.fold = function() {
            if (!playerTurn) {
                return false;
            }


            return true;
        };

        this.cashout = function() {
            if (!playerTurn) {
                return false;
            }

            // end the game
            standing = true;

            return true;
        };

        this.deal = function() {
            if (pot.getTotal() < MIN_BET) {
                return false;
            }

            roundStarted = true;

            return true;
        };

        this.action = (callback) => {
            if (!playerTurn) {
                console.log("not player turn!");
                return false;
            }
            if (!callback) {
                console.log("callback failure");
                return false;
            }

            console.log("callback success");
            playerTurn = false;

            return true;
        };
    }
}


class Dealer extends Hand {
    constructor() {
        super();

        this.start = function() {

        };

        this.deal = function() {
            if (!roundStarted) {
                return false;
            }

            player.hit();
        };

        this.dealSelf = function() {
            // pull from shoe
            // add to this hand
            let drawnCard = shoe.drawCard();
            this.addToHand(drawnCard);
            updateHand("dealer-hand");

            playerTurn = true;
        };

        this.getPlayerChips = function() {
            return player.getPlayerChips();
        };

        this.takeChips = function(value=0) {
            if (!player.subtract(value) || !pot.add(value)) {
                return false;
            }

            return true;
        };

        this.giveChips = function(value=0) {
            if (!player.add(value) || !pot.subtract(value)) {
                return false;
            }

            return true;
        };

        this.fan = function() {

        };
    }
}


class Settings {
    constructor() {

    }
}


class Chip {
    constructor(element) {
        const CHIP_COLORS = {
            "1": {
                "mouseover": "lightgrey",
                "mouseleave": "white",
                "mousedown": "darkgrey",
                "mouseup": "lightgrey"
            },
            "5": {
                "mouseover": "#8b1e22",
                "mouseleave": "#c12e34",
                "mousedown": "#69171a",
                "mouseup": "#8b1e22"
            },
            "25": {
                "mouseover": "#287e39",
                "mouseleave": "#319845",
                "mousedown": "#1f5f2b",
                "mouseup": "#287e39"
            },
            "100": {
                "mouseover": "#2b4472",
                "mouseleave": "#3b5b98",
                "mousedown": "#22365a",
                "mouseup": "#2b4472"
            },
            "500": {
                "mouseover": "#202020",
                "mouseleave": "#303030",
                "mousedown": "#000000",
                "mouseup": "#202020"
            }
        };
        const CHIP_VALUES = {
            "1": 1,
            "5": 5,
            "25": 25,
            "100": 100,
            "500": 500
        };

        let chip = element;
        let chipText = "" + chip.innerText;
        let value = CHIP_VALUES[chipText];

        chip.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor = "" + CHIP_COLORS[chipText]["mouseover"];
        });
        chip.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor = CHIP_COLORS[chipText]["mouseleave"];
        });
        chip.addEventListener("mousedown", (e) => {
            e.target.style.backgroundColor = CHIP_COLORS[chipText]["mousedown"];
        });
        chip.addEventListener("mouseup", (e) => {
            e.target.style.backgroundColor = CHIP_COLORS[chipText]["mouseup"];
        });

        chip.addEventListener("click", (e) => {
            if (roundStarted || !dealer.takeChips(value)) {
                return;
            }

            updateTotals();
        });

        this.getChipElement = function() {
            return chip;
        };

        this.getChip = function() {
            return this;
        };

        this.getValue = function() {
            return value;
        };
    }
}


let chip1 = new Chip(document.getElementById("chip-1"));
let chip5 = new Chip(document.getElementById("chip-5"));
let chip25 = new Chip(document.getElementById("chip-25"));
let chip100 = new Chip(document.getElementById("chip-100"));
let chip500 = new Chip(document.getElementById("chip-500"));


let dealer = new Dealer();
let player = new Player();
let pot = new Pot();
let shoe = new Shoe(2);
shoe.shuffleShoe(MIN_SHUFFLES);
// shoe.printShoe();
let roundStarted = false;
let playerTurn = false;


function updateTotals() {
    document.getElementById("pot").innerText = pot.getTotal();
    document.getElementById("player-chips").innerText = player.getChips();
}

function getCardXCoordinate(e) {
    console.log(e.getBoundingClientRect());
    return e.getBoundingClientRect().x;
}

function fanHand(handWrapper) {
    let startX = getCardXCoordinate(handWrapper.children[0]);
    console.log(startX);
    let offsetX = 0;
}

function createVisualCard(card) {
    let cName = card.getClassName();
    let cardWrapper = document.createElement("div");
    cardWrapper.className = "card";

    let viCard = document.createElement("img");
    viCard.className = cName;
    let rank = card.getRank();
    let suit = card.getSuit();
    viCard.src = "assets/images/" + suit + "/" + rank + "-of-" + suit + ".png";

    cardWrapper.appendChild(viCard);

    return cardWrapper;
}

function updateHand(handId) {
    let handWrapper = document.getElementById(handId);

    while (handWrapper.firstChild) {
        handWrapper.removeChild(handWrapper.firstChild);
    }

    let hand = undefined;
    // TODO: splitHand
    let splitHand = undefined;

    if (handId == "player-hand") {
        hand = player.getHand();
        splitHand = player.getSplitHand();
    }
    else {
        hand = dealer.getHand();
    }

    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];

        let cardWrapper = createVisualCard(card);
        handWrapper.appendChild(cardWrapper);
    }

    fanHand(handWrapper);
}

let waitForAction = (condition, ms=100) => {
    return new Promise((resolve, reject) => {
        let checkCondition = setInterval(() => {
            if (!condition()) {
                return;
            }
            clearInterval(checkCondition);
            resolve("success!");
        }, ms);
    });
};

let start = async () => {
    roundStarted = false;
    await waitForAction(() => roundStarted == true);
    console.log("starting round");

    playerTurn = true;
    await waitForAction(() => playerTurn == false);

    console.log("player did action!");
    setTimeout("dealer.dealSelf()", 1000);

    await waitForAction(() => playerTurn == true);
}

start();
