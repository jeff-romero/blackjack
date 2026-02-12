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

logic:
have action buttons hidden
ask player bet (should have min bet when deal button is clicked)
player clicks chips to add to their bet
player clicks deal
*/


const SUITS = ["hearts", "diamonds", "spades", "clubs"];
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Ace", "Jack", "Queen", "King"];


class Chip {
    /*
        values: 1, 5, 25, 50, 100, 500, 1,000
    */
    constructor(value=-1) {
        let val = value;

        this.getChip = function() {
            return this;
        };

        this.getValue = function() {
            return val;
        };
    }
}


class Card {
    constructor(suit, rank) {
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
                console.log(deck[i].getRank() + " of " + deck[i].getSuit());
            }
        };
    }
}


class Shoe {
    constructor(decks=2) {
        let shoe = [];

        for (let i = 0; i < decks; i++) {
            let deck = new Deck();
            shoe.push(deck);
        }

        this.getShoe = function() {
            return shoe;
        };

        this.shuffleShoe = function(shuffles=1) {
            for (let _ = 0; _ < shuffles; _++) {
                // shuffle the decks in the shoe
                for (let i = 0; i < shoe.length; i++) {
                    shoe[i].shuffleDeck();
                }

                // shuffle the shoe
                let max = shoe.length - 1;
                for (let i = shoe.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (max + 1));

                    let temp = shoe[i];
                    shoe[i] = shoe[j];
                    shoe[j] = temp;
                }
            }
        };

        this.printShoe = function() {
            for (let i = 0; i < shoe.length; i++) {
                shoe[i].printDeck();
            }
        };
    }
}


// let s = new Shoe();
// s.shuffleShoe(3);
// s.printShoe();


class Hand {
    constructor() {
        let hand = [];

        this.getHand = function() {
            return hand;
        };

        this.addToHand = function(card) {
            hand.push(card);
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
        super();
        let chips = [];
        let standing = false; // also used for bust

        this.hit = function() {
            // take another card

        };

        this.stand = function() {
            // take no more cards during turn
        };

        this.doubleDown = function() {
            /*
            increase initial bet by 100% and take one more card. the additional bet is placed next to the original bet.
            */
        };

        this.split = function() {

        };

        this.fold = function() {

        };
    }
}


class Dealer {
    constructor() {


        this.dealPlayer = function() {
            console.log("deal");
            // pull from shoe

            // add to player hand
        };

        this.dealSelf = function() {

        };

        this.giveChips = function() {

        };


    }
}


class GameController {
    constructor() {
        let dealer = new Dealer();
        let player = new Player();

        let fan = function() {

        };

        let draw = function() {
            let pHand = player.getHand();
        };
    }
}

// let card = document.getElementById("dealer-card");
// console.log(card.getBoundingClientRect());


// let chip1 = document.getElementById("chip1");
// let chip1ctx = chip1.getContext("2d");
// chip1ctx.textAlign = "center";
// chip1ctx.textBaseline = "middle";
// chip1ctx.font = "2vw Verdana";

// chip1ctx.beginPath();
// chip1ctx.arc(50, 50, 49, 0, 2 * Math.PI);
// chip1ctx.strokeStyle = "red";
// chip1ctx.stroke();
// chip1ctx.fillStyle = "red";
// chip1ctx.fill();
// chip1ctx.closePath();

// chip1ctx.fillStyle = "white";
// chip1ctx.fillText("5", 50, 50);


// let pchip_1 = document.getElementById("pchip-1");
// let pchip_1_ctx = pchip_1.getContext("2d");
// pchip_1_ctx.font = "2vw Verdana"
// pchip_1_ctx.textAlign = "center";
// pchip_1_ctx.textBaseline = "middle";

// pchip_1_ctx.strokeStyle = "red";
// pchip_1_ctx.fillStyle = "red"
// pchip_1_ctx.beginPath();
// pchip_1_ctx.arc(50, 50, 49, 0, 2 * Math.PI);
// pchip_1_ctx.stroke();
// pchip_1_ctx.fill();
// pchip_1_ctx.closePath();


let chip1 = document.getElementById("chip-1");

chip1.addEventListener("mouseover", (e) => {
    e.target.style.backgroundColor = "lightgrey";
});

chip1.addEventListener("mouseleave", (e) => {
    e.target.style.backgroundColor = "white";
});

chip1.addEventListener("mousedown", (e) => {
    e.target.style.backgroundColor = "darkgrey";
});

chip1.addEventListener("mouseup", (e) => {
    e.target.style.backgroundColor = "lightgrey";
});


let chip5 = document.getElementById("chip-5");

chip5.addEventListener("mouseover", (e) => {
    e.target.style.backgroundColor = "#8b1e22";
});

chip5.addEventListener("mouseleave", (e) => {
    e.target.style.backgroundColor = "#c12e34";
});

chip5.addEventListener("mousedown", (e) => {
    e.target.style.backgroundColor = "#69171a";
});

chip5.addEventListener("mouseup", (e) => {
    e.target.style.backgroundColor = "#8b1e22";
});


let chip25 = document.getElementById("chip-25");

chip25.addEventListener("mouseover", (e) => {
    e.target.style.backgroundColor = "#287e39";
});

chip25.addEventListener("mouseleave", (e) => {
    e.target.style.backgroundColor = "#319845";
});

chip25.addEventListener("mousedown", (e) => {
    e.target.style.backgroundColor = "#1f5f2b";
});

chip25.addEventListener("mouseup", (e) => {
    e.target.style.backgroundColor = "#287e39";
});


let chip100 = document.getElementById("chip-100");

chip100.addEventListener("mouseover", (e) => {
    e.target.style.backgroundColor = "#2b4472";
});

chip100.addEventListener("mouseleave", (e) => {
    e.target.style.backgroundColor = "#3b5b98";
});

chip100.addEventListener("mousedown", (e) => {
    e.target.style.backgroundColor = "#22365a";
});

chip100.addEventListener("mouseup", (e) => {
    e.target.style.backgroundColor = "#2b4472";
});


let chip500 = document.getElementById("chip-500");

chip500.addEventListener("mouseover", (e) => {
    e.target.style.backgroundColor = "#202020";
});

chip500.addEventListener("mouseleave", (e) => {
    e.target.style.backgroundColor = "#303030";
});

chip500.addEventListener("mousedown", (e) => {
    e.target.style.backgroundColor = "#000000";
});

chip500.addEventListener("mouseup", (e) => {
    e.target.style.backgroundColor = "#202020";
});


let hit = document.getElementById("hit");

hit.addEventListener("mouseover", (e) => {
    e.target.style.backgroundColor = "lightgrey";
});

hit.addEventListener("mouseleave", (e) => {
    e.target.style.backgroundColor = "white";
});

hit.addEventListener("mousedown", (e) => {
    e.target.style.backgroundColor = "darkgrey";
});

hit.addEventListener("mouseup", (e) => {
    e.target.style.backgroundColor = "lightgrey";
});
