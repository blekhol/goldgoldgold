export class Card {
    image_source: string;
    blackjack_value: number;
    poker_value: number;
    face: string;
    name: string;
    constructor(source: string, bj_value: number, poker_value: number, face: string, name: string) {
        this.image_source = source;
        this.blackjack_value = bj_value;
        this.poker_value = poker_value;
        this.face = face;
        this.name = name;
    }
}

export function createShuffledDeck(): Card[] {
    const suits = ['C', 'D', 'H', 'S'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    let deck: Card[] = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            const name = `${rank}${suit}`;
            let bj_value = 0;
            let poker_value = 0;
            if (['2', '3', '4', '5', '6', '7', '8', '9'].includes(rank)) {
                bj_value = parseInt(rank);
                poker_value = parseInt(rank);
            } else if (['T', 'J', 'Q', 'K'].includes(rank)) {
                bj_value = 10;
                poker_value = rank === 'T' ? 10 : rank === 'J' ? 11 : rank === 'Q' ? 12 : 13;
            } else if (rank === 'A') {
                bj_value = 11;
                poker_value = 1;
            }
            let face = suit === 'C' ? 'club' : suit === 'D' ? 'diamond' : suit === 'H' ? 'heart' : 'spade';
            deck.push(new Card(`./src/Images/${name}.svg`, bj_value, poker_value, face, name));
        }
    }
    // Fisher-Yates Shuffle Algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}