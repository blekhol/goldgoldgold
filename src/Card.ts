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

export class Cards {
    cards: Card[] = [];
    constructor() { }
}

export function generateCard(cardList: Card[], genList: string[]) {
    let canGen = true;
    let name: string;
    let bj_value: number = 0;
    let poker_value: number = 0;
    let face: string = "";
    do {
        canGen = true;
        let randomNumber = Math.floor(Math.random() * 52) + 1;
        name = genList[randomNumber];
        for (const card of cardList) {
            if (card.name == name) {
                canGen = false;
            }
        }
    } while (!canGen);
    switch (name[0]) {
        case "2": bj_value = 2; poker_value = 2; break;
        case "3": bj_value = 3; poker_value = 3; break;
        case "4": bj_value = 4; poker_value = 4; break;
        case "5": bj_value = 5; poker_value = 5; break;
        case "6": bj_value = 6; poker_value = 6; break;
        case "7": bj_value = 7; poker_value = 7; break;
        case "8": bj_value = 8; poker_value = 8; break;
        case "9": bj_value = 9; poker_value = 9; break;
        case "A": bj_value = 11; poker_value = 1; break;
        case "J": bj_value = 10; poker_value = 11; break;
        case "K": bj_value = 10; poker_value = 13; break;
        case "Q": bj_value = 10; poker_value = 12; break;
        case "T": bj_value = 10; poker_value = 10; break;
        default: break;
    }
    switch (name[1]) {
        case "C": face = "club"; break;
        case "D": face = "diamond"; break;
        case "H": face = "heart"; break;
        case "S": face = "spade"; break;
        default: break;
    }
    let newCard = new Card(`./Images/${name}.svg`, bj_value, poker_value, face, name);
    return newCard;
}