import { Card, createShuffledDeck } from "./Card.ts";
import type { User } from "./types.ts";

let currentDeck: Card[] = [];
let dealerHand: Card[] = [];
let playerHand: Card[] = [];
let playerHand2Active: boolean = false;
let playerHand2: Card[] = [];
let gameStatus = "";
let bet2 = 0;
const link = "https://retoolapi.dev/U2ra8a/data";
const userInfo = document.getElementById("userInfo") as HTMLSpanElement;
const bjPBet = document.getElementById("bjPBet") as HTMLParagraphElement;
const bjFormDiv = document.getElementById("bjFormDiv") as HTMLDivElement;
const bjCanvas = document.getElementById("bjCanvas") as HTMLCanvasElement;
let bjHit = document.getElementById("bjHit") as HTMLButtonElement;
let bjSplit = document.getElementById("bjSplit") as HTMLButtonElement;
let bjDouble = document.getElementById("bjDouble") as HTMLButtonElement;
let bjPass = document.getElementById("bjPass") as HTMLButtonElement;
const ctx = bjCanvas.getContext("2d") as CanvasRenderingContext2D;

export function blackjackGame(bet: number, currentUser: User) {
    playerHand.length = 0;
    dealerHand.length = 0;
    // playerHand2.length = 0;
    // playerHand2Active = false;
    gameStatus = "";
    currentDeck = createShuffledDeck();
    bjFormDiv.classList.add("hide");
    bjPBet.textContent = "Jelenlegi tét: " + bet.toString() + " Ft";
    currentUser.balance -= bet;
    userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
    fetch(`${link}/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser)
    }).catch(err => console.error("Balance sync failed", err));
    playerHand.push(currentDeck.pop()!);
    playerHand.push(currentDeck.pop()!);
    dealerHand.push(currentDeck.pop()!);
    console.log(currentDeck);
    console.log(playerHand);
    console.log(dealerHand);
    draw();
    if (checkPlayerBlackjack(playerHand)) {
        playerInstantWin(bet, currentUser);
    }
    else {
        playersGame(bet, currentUser);
    }
}

function drawText() {
    let dealerSum = sum(dealerHand);
    let playerSum = sum(playerHand);
    ctx.font = "30px Arial";
    ctx.fillText(dealerSum.toString(), 10, 200);
    ctx.fillText(playerSum.toString(), 10, 370);
    if (gameStatus == "playerwin") {
        ctx.fillText("Player Win", 300, 300);
    }
    else if (gameStatus == "playerlose") {
        ctx.fillText("Player Lose", 300, 300);
    }
    else if (gameStatus == "tie") {
        ctx.fillText("Tied game", 300, 300);
    }
}

function draw() {
    ctx.clearRect(0, 0, 600, 600);
    const totalCards = dealerHand.length + playerHand.length;
    let loadedCardsCount = 0;
    const checkAllLoaded = () => {
        loadedCardsCount++;
        if (loadedCardsCount === totalCards) {
            drawText();
        }
    };
    for (let i = 0; i < dealerHand.length; i++) {
        let img = new Image();
        console.log(img);
        img.onload = () => {
            ctx.drawImage(img, 10 + (i * 110), 10, 100, 150);
            checkAllLoaded();
        }
        img.src = dealerHand[i].image_source;
        img.onerror = () => {
            console.error(`Failed to load card image asset at: ${img.src}`);
            checkAllLoaded();
        };
    }
    for (let i = 0; i < playerHand.length; i++) {
        let img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 10 + (i * 110), 400, 100, 150);
            checkAllLoaded();
        }
        img.src = playerHand[i].image_source;
        img.onerror = () => {
            console.error(`Failed to load card image asset at: ${img.src}`);
            checkAllLoaded();
        };
    }
    if (playerHand2Active) {
        for (let i = 0; i < playerHand2.length; i++) {
            let img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 590 - (i * 110), 400, 100, 150);
                checkAllLoaded();
            }
            img.src = playerHand2[i].image_source;
            img.onerror = () => {
                console.error(`Failed to load card image asset at: ${img.src}`);
                checkAllLoaded();
            };
        }
    }
}

function sum(hand: Card[]): number {
    let summed = 0;
    let aceCount = 0;
    for (const card of hand) {
        summed += card.blackjack_value;
        if (card.blackjack_value === 11) {
            aceCount++;
        }
    }
    while (summed > 21 && aceCount > 0) {
        summed -= 10;
        aceCount--;
    }
    return summed;
}

function checkPlayerBlackjack(hand: Card[]): boolean {
    if (sum(hand) == 21) {
        return true;
    }
    return false;
}

function checkPlayerBust(hand: Card[]): boolean {
    if (sum(hand) > 21) {
        return true;
    }
    return false;
}

function playerInstantWin(bet: number, currentUser: User) {
    gameStatus = "playerwin";
    draw();
    currentUser.balance += bet * 2.5;
    userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
    fetch(`${link}/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser)
    }).catch(err => console.error("Balance sync failed", err));
    bjFormDiv.classList.remove("hide");
}

function playerWin(bet: number, currentUser: User) {
    gameStatus = "playerwin";
    draw();
    currentUser.balance += bet * 2.0;
    userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
    fetch(`${link}/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser)
    }).catch(err => console.error("Balance sync failed", err));
    bjFormDiv.classList.remove("hide");
}

function playerPush(bet: number, currentUser: User) {
    gameStatus = "tie";
    draw();
    currentUser.balance += bet;
    userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
    fetch(`${link}/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser)
    }).catch(err => console.error("Balance sync failed", err));
}

function playerLose() {
    gameStatus = "playerlose";
    draw();
    bjFormDiv.classList.remove("hide");
}

function playersGame(bet: number, currentUser: User) {
    let firstRound = true;
    let hitClone = bjHit.cloneNode(true) as HTMLButtonElement;
    bjHit.replaceWith(hitClone);
    bjHit = hitClone;
    let passClone = bjPass.cloneNode(true) as HTMLButtonElement;
    bjPass.replaceWith(passClone);
    bjPass = passClone;
    let doubleClone = bjDouble.cloneNode(true) as HTMLButtonElement;
    bjDouble.replaceWith(doubleClone);
    bjDouble = doubleClone;
    let splitClone = bjSplit.cloneNode(true) as HTMLButtonElement;
    bjSplit.replaceWith(splitClone)
    bjSplit = splitClone;
    hitClone.disabled = false;
    passClone.disabled = false;

    hitClone.addEventListener("click", () => {
        firstRound = false;
        doubleClone.disabled = true;
        let newCard = currentDeck.pop()!;
        playerHand.push(newCard);
        // if (playerHand2Active) {
        //     let newCard = generateCard(allCardsDrawn, generateablesList);
        //     allCardsDrawn.push(newCard);
        //     playerHand2.push(newCard);
        // }   
        if (checkPlayerBlackjack(playerHand)) {
            hitClone.disabled = true;
            passClone.disabled = true;
            dealersGame(bet, currentUser);
        }
        else if (checkPlayerBust(playerHand)) {
            playerLose();
            hitClone.disabled = true;
            passClone.disabled = true;
        }
        draw();
    });
    // if (playerHand[0].name[0] == playerHand[1].name[0]) {
    //     bjSplit.disabled = false;
    //     bjSplit.addEventListener("click", () => {
    //         playerHand2Active = true;
    //         playerHand2.push(playerHand[1]);
    //         playerHand.pop();
    //         draw();
    //         bet2 = bet;
    //         currentUser.balance -= bet2;
    //         userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
    //         fetch(`${link}/${currentUser.id}`, {
    //             method: "PUT",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(currentUser)
    //         }).catch(err => console.error("Balance sync failed", err));
    //         bjSplit.disabled = true;
    //     })
    // }
    if (firstRound) {
        doubleClone.disabled = false;
        doubleClone.addEventListener("click", () => {
            currentUser.balance -= bet;
            userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
            fetch(`${link}/${currentUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentUser)
            }).catch(err => console.error("Balance sync failed", err));
            bet *= 2;
            let newCard = currentDeck.pop()!;
            playerHand.push(newCard);
            doubleClone.disabled = true;
            hitClone.disabled = true;
            passClone.disabled = true;
            draw();
            if (checkPlayerBust(playerHand)) {
                playerLose();
            } else {
                dealersGame(bet, currentUser);
            }
        })
    }
    passClone.addEventListener("click", () => {
        hitClone.disabled = true;
        passClone.disabled = true;
        doubleClone.disabled = true;
        dealersGame(bet, currentUser);
    })
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
async function dealersGame(finalBet: number, currentUser: User) {
    let firstCard = currentDeck.pop()!;
    dealerHand.push(firstCard);
    draw();
    await delay(800);
    while (sum(dealerHand) < 17) {
        let nextCard = currentDeck.pop()!;
        dealerHand.push(nextCard);
        draw();
        await delay(800);
    }
    if (sum(dealerHand) > 21) {
        playerWin(finalBet, currentUser);
    }
    else if (sum(dealerHand) > sum(playerHand)) {
        playerLose();
    }
    else if (sum(dealerHand) < sum(playerHand)) {
        playerWin(finalBet, currentUser);
    }
    else if (sum(dealerHand) == sum(playerHand)) {
        playerPush(finalBet, currentUser);
    }
}