import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './style.css';

interface User {
    username: string;
    password: string;
    balance: number;
}

const link = "https://retoolapi.dev/U2ra8a/data";
let userList = [];
let currentUser;

const loginButton = document.getElementById("login") as HTMLButtonElement;
const signupButton = document.getElementById("signup") as HTMLButtonElement;

async function getData(link: string) : Promise<User[]> {
    let users: User[] = [];
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("Betöltéskor probléma")
    }
    const data = await response.json();
    for (const element of data) {
        users.push({username: element.username, password: element.password, balance: element.balance})
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

});
signupButton.addEventListener("click", () => {
        
});


document.addEventListener("DOMContentLoaded", ()=> {
    // document.getElementById("BefizetesBtn")?.addEventListener("click", ()=)
})