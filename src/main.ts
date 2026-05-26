import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import './style.css';
import { type User, type FormValues } from './types.ts';
import { blackjackGame } from './Blackjack.ts';

import { initCaseSimulator, updateCaseButtonsDisabledState } from './CaseSimulator.ts';

const link = "https://retoolapi.dev/U2ra8a/data";
let userList: User[] = [];
let currentUser: User | null = null;

const loginButton = document.getElementById("login") as HTMLButtonElement;
const signupButton = document.getElementById("signup") as HTMLButtonElement;
const bjButton = document.getElementById("BlackjackButton") as HTMLButtonElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const bjBetInput = document.getElementById("bjBet") as HTMLInputElement;
const betValue = document.getElementById("rangeValue") as HTMLSpanElement;
const loginPage = document.getElementById("loginPage") as HTMLDivElement;
const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(loginPage) as bootstrap.Offcanvas;
const loginTitle = document.getElementById("loginTitle") as HTMLHeadingElement;
const submitButton = document.getElementById("loginButton") as HTMLButtonElement;
const loginError = document.getElementById("loginReturn") as HTMLDivElement;
const loginSuccess = document.getElementById("loginSuccess") as HTMLDivElement;
const userInfo = document.getElementById("userInfo") as HTMLSpanElement;
const balanceAlert = document.getElementById("balanceAlert") as HTMLDivElement;

async function getData(link: string): Promise<User[]> {
    let users: User[] = [];
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("Betöltéskor probléma")
    }
    const data = await response.json();
    for (const element of data) {
        users.push({ id: element.id, username: element.username, password: element.password, balance: element.balance })
    }
    return users;
}

try {
    userList = await getData(link);
    
    initCaseSimulator(
        () => currentUser,
        handleBalanceUpdate
    );
} catch (e: any) {
    console.error(e.message);
}

function userLoggedInCheckForGames() {
    if (!currentUser) {
        if (bjButton) bjButton.disabled = true;
    } else {
        if (bjButton) bjButton.disabled = false;
    }
    updateCaseButtonsDisabledState();
}

function lowBalanceAlertCheck() {
    if (!currentUser) {
        balanceAlert.classList.add("hide")
    } else if (currentUser.balance < 100) {
        balanceAlert.classList.remove("hide")
    } else {
        balanceAlert.classList.add("hide")
    }
}

export async function handleBalanceUpdate(newBalance: number) {
    if (!currentUser) return;

    const updatedUserPayload: User = {
        id: currentUser.id,
        username: currentUser.username,
        password: currentUser.password,
        balance: newBalance
    };

    try {
        const response = await fetch(`${link}/${currentUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUserPayload)
        });

        if (!response.ok) throw new Error("Sikertelen egyenleg frissítés");

        currentUser.balance = newBalance;
        userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
        lowBalanceAlertCheck();
        bjBetInput.max = currentUser.balance.toString();
        userList = await getData(link);
    } catch (error) {
        console.error(error);
        throw new Error("Hiba történt a szinkronizálás során");
    }
}

loginButton.addEventListener("click", () => {
    if (loginButton.textContent == "Kilépés") {
        currentUser = null;
        userLoggedInCheckForGames();
        userInfo.textContent = "Jelentkezz be!";
        signupButton.style.display = "inline-block";
        loginSuccess.textContent = "Sikeres kijelentkezés";
        loginButton.textContent = "Belépés";
    }
    loginTitle.textContent = "Belépés";
    submitButton.textContent = "Belépés";
});

signupButton.addEventListener("click", () => {
    loginTitle.textContent = "Regisztráció";
    submitButton.textContent = "Regisztráció";
});

document.getElementById("loginForm")?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormValues;
    
    if (loginTitle.textContent == "Belépés") {
        const foundUser = userList.find(user => user.username === data.username && user.password === data.password);

        if (foundUser) {
            currentUser = foundUser;
            loginError.textContent = "";
            loginSuccess.textContent = "Sikeres bejelentkezés";
            usernameInput.value = "";
            passwordInput.value = "";
            userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
            userLoggedInCheckForGames();
            lowBalanceAlertCheck();
            bjBetInput.max = currentUser.balance.toString();
            offcanvasInstance.hide();
            signupButton.style.display = "none";
            loginButton.textContent = "Kilépés";
        } else {
            loginError.textContent = "Sikertelen bejelentkezés";
            loginSuccess.textContent = "";
        }
    } else {
        let canSignUp = true;
        for (const user of userList) {
            if (user.username == data.username || data.username == "NOLOGIN") {
                loginError.textContent = "Ilyen felhasználó már létezik!";
                canSignUp = false;
            }
        }
        if (canSignUp) {
            try {
                const response = await fetch(link, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: data.username, password: data.password, balance: 0 })
                });
                await response.json();
                loginSuccess.textContent = "Sikeres regisztráció!";
                usernameInput.value = "";
                passwordInput.value = "";
                offcanvasInstance.hide();
                userList = await getData(link);
            } catch (e: any) {
                console.error("Error: ", e)
            }
        }
    }
});

document.querySelector("input")?.addEventListener("invalid", () => {
    loginError.textContent = "Nem lehet túl rövid vagy üres egyik adatod sem!";
});

document.getElementById("loginClose")?.addEventListener("click", () => {
    loginError.textContent = "";
    loginSuccess.textContent = "";
    usernameInput.value = "";
    passwordInput.value = "";
});

bjBetInput.addEventListener("input", () => {
    betValue.textContent = bjBetInput.value + " Ft";
});

document.getElementById("bjForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const bet = bjBetInput.value;
    if (currentUser) {
        blackjackGame(Number.parseInt(bet), currentUser);
    }
});

document.getElementById("BefizetesBtn")?.addEventListener("click", () => {
    const selectedRadio = document.querySelector('input[name="befizetesOsszegek"]:checked') as HTMLInputElement;
    if (selectedRadio) {
        if(!currentUser) {
            alert("Befizetéshez be kell jelentkezni");
            return;
        }
        const newBalance = currentUser.balance + Number(selectedRadio.value);
        handleBalanceUpdate(newBalance);
    } else {
        throw new Error("Nem lett kiválasztva egyik sem");
    }
});