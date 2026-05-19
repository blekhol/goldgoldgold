import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './style.css';
import { type User, type FormValues } from './types.ts';

const link = "https://retoolapi.dev/U2ra8a/data";
let userList: User[] = [];
let currentUser: User | null = null;

const loginButton = document.getElementById("login") as HTMLButtonElement;
const signupButton = document.getElementById("signup") as HTMLButtonElement;

async function getData(link: string): Promise<User[]> {
    let users: User[] = [];
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("Betöltéskor probléma")
    }
    const data = await response.json();
    for (const element of data) {
        users.push({id: element.id, username: element.username, password: element.password, balance: element.balance })
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
        currentUser = null;
        document.getElementById("userInfo")!.textContent = "Jelentkezz be!";
        signupButton.classList.remove("hide");
        document.getElementById("loginSuccess")!.textContent = "Sikeres kijelentkezés";
        loginButton.textContent = "Belépés";
    }
    document.getElementById("loginTitle")!.textContent = "Belépés";
    document.getElementById("loginButton")!.textContent = "Belépés";
});
signupButton.addEventListener("click", () => {
    document.getElementById("loginTitle")!.textContent = "Regisztráció";
    document.getElementById("loginButton")!.textContent = "Regisztráció";
});

document.querySelector("form")?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as FormValues;
    console.log('Form submitted with:', data);
    if (document.getElementById("loginTitle")!.textContent == "Belépés") {
        const foundUser = userList.find(user => user.username === data.username && user.password === data.password);

        if (foundUser) {
            currentUser = foundUser;
            document.getElementById("loginReturn")!.textContent = "";
            document.getElementById("loginSuccess")!.textContent = "Sikeres bejelentkezés";
            document.getElementById("userInfo")!.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
            signupButton.classList.add("hide");
            loginButton.textContent = "Kilépés";
        } else {
            document.getElementById("loginReturn")!.textContent = "Sikertelen bejelentkezés";
            document.getElementById("loginSuccess")!.textContent = "";
        }
    }
    else {
        let canSignUp = true;
        for (const user of userList) {
            if (user.username == data.username) {
                document.getElementById("loginReturn")!.textContent = "Ilyen felhasználó már létezik!";
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
                document.getElementById("loginSuccess")!.textContent = "Sikeres regisztráció!";
                userList = await getData(link);
            }
            catch (e: any) {
                console.error("Error: ", e)
            }
        }
    }
})
document.querySelector("input")?.addEventListener("invalid", () => {
    document.getElementById("loginReturn")!.textContent = "Nem lehet túl rövid vagy üres egyik adatod sem!";
})
document.getElementById("loginClose")?.addEventListener("click", () => {
    document.getElementById("loginReturn")!.textContent = "";
    document.getElementById("loginSuccess")!.textContent = "";
    const un = document.getElementById("username") as HTMLInputElement;
    const pw = document.getElementById("password") as HTMLInputElement;
    un.value = "";
    pw.value = "";
})

document.getElementById("BefizetesBtn")?.addEventListener("click", BefizetesBtnPress);

function BefizetesBtnPress() {
    const selectedRadio = document.querySelector('input[name="befizetesOsszegek"]:checked') as HTMLInputElement;
    
    if (selectedRadio) {
        Befizetes(Number(selectedRadio.value));
    } else {
       throw new Error("Nem lett kiválasztva egyik sem");
    }
}

async function Befizetes(amount: number) {
    if (!currentUser) {
        console.log("Nincs bejelentkezve senki");
        return; 
    }

    const updatedBalance = currentUser.balance + amount;

    const updatedUserPayload: User = {
        id: currentUser.id,
        username: currentUser.username,
        password: currentUser.password,
        balance: updatedBalance
    };

    try {
        const response = await fetch(`${link}/${currentUser.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUserPayload)
        });

        if (!response.ok) {
            throw new Error("Sikertelen egyenleg frissítés");
        }

        const result = await response.json();
        console.log("Sikeres feltöltés:", result);

        currentUser.balance = updatedBalance;
        
        document.getElementById("userInfo")!.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
        
        userList = await getData(link);

    } catch (error) {
        throw new Error("Hiba történt a fizetés során");
    }
}