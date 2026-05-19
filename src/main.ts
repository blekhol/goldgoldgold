import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import './style.css';
import { type User, type FormValues } from './types.ts';

const link = "https://retoolapi.dev/U2ra8a/data";
let userList: User[] = [];
export let currentUser: User = {username: "NOLOGIN", password: "NOLOGIN", balance: 0};
const loginButton = document.getElementById("login") as HTMLButtonElement;
const signupButton = document.getElementById("signup") as HTMLButtonElement;
const bjButton = document.getElementById("BlackjackButton") as HTMLButtonElement;
const csButton = document.getElementById("CaseSimButton") as HTMLButtonElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const bjBetInput = document.getElementById("bjBet") as HTMLInputElement;
const loginPage = document.getElementById("loginPage") as HTMLDivElement;
const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(loginPage) as bootstrap.Offcanvas;
const loginTitle = document.getElementById("loginTitle") as HTMLHeadingElement;
const submitButton = document.getElementById("loginButton") as HTMLButtonElement;
const loginError = document.getElementById("loginReturn") as HTMLDivElement;
const loginSuccess = document.getElementById("loginSuccess") as HTMLDivElement;
const userInfo = document.getElementById("userInfo") as HTMLSpanElement;

function userLoggedInCheckForGames() {
    if (currentUser.username == "NOLOGIN") {
        bjButton.disabled = true;
        csButton.disabled = true;
    }
    else {
        bjButton.disabled = false;
        csButton.disabled = false;
    }
}
userLoggedInCheckForGames();

async function getData(link: string): Promise<User[]> {
    let users: User[] = [];
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("Betöltéskor probléma")
    }
    const data = await response.json();
    for (const element of data) {
        users.push({ username: element.username, password: element.password, balance: element.balance })
    }
    return users;
}

try {
    userList = await getData(link);
    console.log(userList)
}
catch (e: any) {
    console.error(e.message);
}

loginButton.addEventListener("click", () => {
    if (loginButton.textContent == "Kilépés") {
        currentUser = {username: "NOLOGIN", password: "NOLOGIN", balance: 0};
        userLoggedInCheckForGames();
        userInfo.textContent = "Jelentkezz be!";
        signupButton.classList.remove("hide");
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
    console.log('Form submitted with:', data);
    if (loginTitle.textContent == "Belépés") {
        for (const user of userList) {
            if (user.username == data.username && user.password == data.password) {
                currentUser = user;
                loginError.textContent = "";
                loginSuccess.textContent = "Sikeres bejelentkezés";
                usernameInput.value = "";
                passwordInput.value = "";
                userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`
                userLoggedInCheckForGames();
                offcanvasInstance.hide();
                signupButton.classList.add("hide");
                loginButton.textContent = "Kilépés";
                break;
            }
            else {
                loginError.textContent = "Sikertelen bejelentkezés";
            }
        }
    }
    else {
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
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username: data.username, password: data.password, balance: 0 })
                });
                const result = await response.json();
                console.log("Success: ", result)
                loginSuccess.textContent = "Sikeres regisztráció!";
                usernameInput.value = "";
                passwordInput.value = "";
                offcanvasInstance.hide();
                userList = await getData(link);
            }
            catch (e: any) {
                console.error("Error: ", e)
            }
        }
    }
})
document.querySelector("input")?.addEventListener("invalid", () => {
    loginError.textContent = "Nem lehet túl rövid vagy üres egyik adatod sem!";
})
document.getElementById("loginClose")?.addEventListener("click", () => {
    loginError.textContent = "";
    loginSuccess.textContent = "";
    usernameInput.value = "";
    passwordInput.value = "";
})

document.addEventListener("DOMContentLoaded", () => {
    // document.getElementById("BefizetesBtn")?.addEventListener("click", ()=)
})