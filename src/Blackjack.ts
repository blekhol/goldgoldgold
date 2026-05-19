import { Card, Cards, generateCard } from "./Card.ts";
import type { User } from "./types.ts";

let kartyakCl = new Cards();
let allCardsDrawn = kartyakCl.cards;
let dealerHand: Card[] = [];
let playerHand: Card[] = [];
const bjPBet = document.getElementById("bjPBet") as HTMLParagraphElement;
const bjFormDiv = document.getElementById("bjFormDiv") as HTMLDivElement;
const bjCanvas = document.getElementById("bjCanvas") as HTMLCanvasElement;
const ctx = bjCanvas.getContext("2d") as CanvasRenderingContext2D;
const generateablesList: string[] = ["2C", "2D", "2H", "2S", "3C", "3D", "3H", "3S", "4C", "4D", "4H", "4S", "5C", "5D", "5H", "5S",
    "6C", "6D", "6H", "6S", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "AC", "AD", "AH", "AS",
    "JC", "JD", "JH", "JS", "KC", "KD", "KH", "KS", "QC", "QD", "QH", "QS", "TC", "TD", "TH", "TS"];

export function blackjackGame(bet: string, currentUser: User) {
    bjFormDiv.classList.add("hide");
    bjPBet.textContent = "Jelenlegi tét: " + bet + " Ft";
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 600, 600);
    
    for (let i = 0; i < 2; i++) {
        let newCard = generateCard(allCardsDrawn, generateablesList);
        allCardsDrawn.push(newCard);
        playerHand.push(newCard);
    }
    let newCard = generateCard(allCardsDrawn, generateablesList);
    allCardsDrawn.push(newCard);
    dealerHand.push(newCard);
    console.log(allCardsDrawn);
    console.log(playerHand);
    console.log(dealerHand);
    checkBlackjacks();
    drawImages();
}

function checkBlackjacks() {

}

function drawImages() {
    for (let i = 0; i < dealerHand.length; i++) {
        let img = new Image();
        img.src = dealerHand[i].image_source;
        img.onload = () => {
            ctx.drawImage(img, 10, 10, 100, 200);
        }
    }
    for (let i = 0; i < playerHand.length; i++) {
        let img = new Image();
        img.src = playerHand[i].image_source;
        img.onload = () => {
            ctx.drawImage(img, 10, 400, 100, 200);
        }
    }
}