import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import './style.css';
import { type User, type FormValues, type CaseConfig, type DropItem } from './types.ts';
import { blackjackGame } from './Blackjack.ts';

const link = "https://retoolapi.dev/U2ra8a/data";
let userList: User[] = [];
let currentUser: User | null = null;

// DOM Elements
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

// Case Modal Selectors
const caseLobbyGrid = document.getElementById("caseLobbyGrid") as HTMLDivElement;
const modalCaseName = document.getElementById("modalCaseName") as HTMLHeadingElement;
const modalCasePrice = document.getElementById("modalCasePrice") as HTMLSpanElement;
const modalDropList = document.getElementById("modalDropList") as HTMLDivElement;
const caseModalNative = document.getElementById("CaseModal") as HTMLElement;
const bsCaseModal = new bootstrap.Modal(caseModalNative);

// Selected Case tracking pointer
let selectedCase: CaseConfig | null = null;

const AVAILABLE_CASES: CaseConfig[] = [
    {
        id: "case1",
        name: "CS:GO Weapon Case 1",
        price: 2500,
        image: "./src/Images/case1.png",
        drops: [
            { name: "MP7 | Skulls", rarity: "blue", image: "./src/Images/case-drops/mp7_skulls.png" },
            { name: "SG 553 | Ultraviolet", rarity: "blue", image: "./src/Images/case-drops/sg553_ultraviolet.png" },
            { name: "AUG | Wings", rarity: "blue", image: "./src/Images/case-drops/aug_wings.png" },
            { name: "Glock-18 | Dragon Tattoo", rarity: "purple", image: "./src/Images/case-drops/glock_dragon.png" },
            { name: "USP-S | Dark Water", rarity: "purple", image: "./src/Images/case-drops/usps_darkwater.png" },
            { name: "M4A1-S | Dark Water", rarity: "purple", image: "./src/Images/case-drops/m4a1s_darkwater.png" },
            { name: "AK-47 | Case Hardened", rarity: "pink", image: "./src/Images/case-drops/ak47_casehardened.png" },
            { name: "Desert Eagle | Hypnotic", rarity: "pink", image: "./src/Images/case-drops/deagle_hypnotic.png" },
            { name: "AWP | Lightning Strike", rarity: "red", image: "./src/Images/case-drops/awp_lightning.png" },
            { name: "★ Ritka Különleges Tárgy", rarity: "gold", image: "./src/Images/case-drops/gold.png" }
        ],
        goldPool: [
            { name: "★ Karambit | Case Hardened", rarity: "gold", image: "./src/Images/case-drops/karambit_ch.png" },
            { name: "★ M9 Bayonet | Fade", rarity: "gold", image: "./src/Images/case-drops/m9_fade.png" },
            { name: "★ Bayonet | Slaughter", rarity: "gold", image: "./src/Images/case-drops/bayonet_slaughter.png" },
            { name: "★ Flip Knife | Crimson Web", rarity: "gold", image: "./src/Images/case-drops/flip_crimson.png" }
        ]
    },
    {
        id: "case2",
        name: "Dreams & Nightmares Case",
        price: 900,
        image: "./src/Images/case2.png",
        drops: [
            { name: "Five-SeveN | Scrawl", rarity: "blue", image: "./src/Images/case-drops/five7_scrawl.png" },
            { name: "MAC-10 | Ensnared", rarity: "blue", image: "./src/Images/case-drops/mac10_ensnared.png" },
            { name: "PP-Bizon | Space Cat", rarity: "purple", image: "./src/Images/case-drops/bizon_spacecat.png" },
            { name: "M4A1-S | Night Terror", rarity: "purple", image: "./src/Images/case-drops/m4a1s_nightterror.png" },
            { name: "FAMAS | Rapid Eye Movement", rarity: "pink", image: "./src/Images/case-drops/famas_rem.png" },
            { name: "AK-47 | Nightwish", rarity: "red", image: "./src/Images/case-drops/ak47_nightwish.png" },
            { name: "★ Ritka Különleges Tárgy", rarity: "gold", image: "./src/Images/case-drops/gold.png" }
        ],
        goldPool: [
            { name: "★ Butterfly Knife | Gamma Doppler", rarity: "gold", image: "./src/Images/case-drops/bf_gamma.png" },
            { name: "★ Huntsman Knife | Lore", rarity: "gold", image: "./src/Images/case-drops/huntsman_lore.png" },
            { name: "★ Bowie Knife | Autotronic", rarity: "gold", image: "./src/Images/case-drops/bowie_auto.png" }
        ]
    },
    {
        id: "case3",
        name: "Revolver Case",
        price: 1200,
        image: "./src/Images/case3.png",
        drops: [
            { name: "R8 Revolver | Crimson Web", rarity: "blue", image: "./src/Images/case-drops/r8_crimsonweb.png" },
            { name: "Desert Eagle | Corinthian", rarity: "blue", image: "./src/Images/case-drops/deagle_corinthian.png" },
            { name: "PP-Bizon | Fuel Rod", rarity: "purple", image: "./src/Images/case-drops/bizon_fuelrod.png" },
            { name: "AK-47 | Point Disarray", rarity: "pink", image: "./src/Images/case-drops/ak47_pointdisarray.png" },
            { name: "M4A4 | Royal Paladin", rarity: "red", image: "./src/Images/case-drops/m4a4_royalpaladin.png" },
            { name: "R8 Revolver | Fade", rarity: "red", image: "./src/Images/case-drops/r8_fade.png" },
            { name: "★ Ritka Különleges Tárgy", rarity: "gold", image: "./src/Images/case-drops/gold.png" }
        ],
        goldPool: [
            { name: "★ Karambit | Doppler", rarity: "gold", image: "./src/Images/case-drops/karambit_doppler.png" },
            { name: "★ M9 Bayonet | Marble Fade", rarity: "gold", image: "./src/Images/case-drops/m9_marble.png" },
            { name: "★ Gut Knife | Tiger Tooth", rarity: "gold", image: "./src/Images/case-drops/gut_tiger.png" }
        ]
    }
];

function userLoggedInCheckForGames() {
    if (!currentUser) {
        if (bjButton) bjButton.disabled = true;
    } else {
        if (bjButton) bjButton.disabled = false;
    }
    updateCaseButtonsDisabledState();
}

function updateCaseButtonsDisabledState() {
    const selectButtons = document.querySelectorAll(".select-case-btn") as NodeListOf<HTMLButtonElement>;
    selectButtons.forEach(btn => {
        btn.disabled = !currentUser;
    });
}

function renderCaseLobby() {
    if (!caseLobbyGrid) return;
    caseLobbyGrid.innerHTML = "";

    AVAILABLE_CASES.forEach((c) => {
        const caseCol = document.createElement("div");
        caseCol.className = "col";
        caseCol.innerHTML = `
            <div class="card bg-secondary text-white text-center h-100 p-2 border-0 shadow-sm align-items-center">
                <img src="${c.image}" alt="${c.name}" class="img-fluid my-2" style="max-height: 80px; object-fit: contain;" onerror="this.src='https://placehold.co/120x100/2c3034/ffffff?text=${c.id}'">
                <div class="fw-bold text-truncate w-100" style="font-size: 13px;">${c.name}</div>
                <div class="text-warning small mb-2">${c.price} Ft</div>
                <button class="btn btn-sm btn-light w-100 select-case-btn" data-id="${c.id}">Kiválasztás</button>
            </div>
        `;
        caseLobbyGrid.appendChild(caseCol);
    });
    userLoggedInCheckForGames();
}

caseLobbyGrid?.addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;
    if (target && target.classList.contains("select-case-btn")) {
        const caseId = target.getAttribute("data-id");
        const foundCase = AVAILABLE_CASES.find(c => c.id === caseId);
        if (foundCase) {
            openCaseSelectionModal(foundCase);
        }
    }
});

function openCaseSelectionModal(caseData: CaseConfig) {
    selectedCase = caseData;
    modalCaseName.textContent = caseData.name;
    modalCasePrice.textContent = caseData.price.toString();
    modalDropList.innerHTML = "";
    
    // Clear display traces from previous instances
    document.getElementById("caseEredmeny")!.textContent = "";
    document.getElementById("caseTrack")!.innerHTML = "";

    caseData.drops.forEach((drop) => {
        const itemCard = document.createElement("div");
        itemCard.className = `drop-preview-card border border-secondary rarity-${drop.rarity}`;
        itemCard.innerHTML = `
            <img src="${drop.image}" alt="${drop.name}" onerror="this.src='https://placehold.co/64x64/1a1a1a/ffffff?text=Drop'">
            <div class="mt-1 text-truncate fw-semibold">${drop.name}</div>
        `;
        modalDropList.appendChild(itemCard);
    });

    bsCaseModal.show();
}

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
    renderCaseLobby();
} catch (e: any) {
    console.error(e.message);
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
                const result = await response.json();
                console.log("Success: ", result)
                loginSuccess.textContent = "Sikeres regisztráció!";
                usernameInput.value = "";
                passwordInput.value = "";
                offcanvasInstance.hide();
                userList = await getData(link);
                renderCaseLobby();
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
})

bjBetInput.addEventListener("input", () => {
    betValue.textContent = bjBetInput.value + " Ft";
})
function lowBalanceAlertCheck() {
    if (!currentUser) {
        balanceAlert.classList.add("hide")
    }
    else if (currentUser.balance < 100) {
        balanceAlert.classList.remove("hide")
    }
    else {
        balanceAlert.classList.add("hide")
    }
}
document.getElementById("bjForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const bet = bjBetInput.value;
    console.log(bet);
    if (currentUser) {
        blackjackGame(bet, currentUser);
    }
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
    if (!currentUser) return;

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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUserPayload)
        });

        if (!response.ok) throw new Error("Sikertelen egyenleg frissítés");

        currentUser.balance = updatedBalance;
        
        userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
        lowBalanceAlertCheck();
        bjBetInput.max = currentUser.balance.toString();
        userList = await getData(link);
    } catch (error) {
        throw new Error("Hiba történt a fizetés során");
    }
}

// Additional local DOM references
const caseRollBtn = document.getElementById("caseRollBtn") as HTMLButtonElement;
const caseTrack = document.getElementById("caseTrack") as HTMLDivElement;
const caseBezaras = document.getElementById("caseBezaras") as HTMLButtonElement;
const bigPreviewOverlay = document.getElementById("bigPreviewOverlay") as HTMLDivElement;
const bigPreviewCard = document.getElementById("bigPreviewCard") as HTMLDivElement;
const bigWinItemName = document.getElementById("bigWinItemName") as HTMLHeadingElement;
const bigWinItemImage = document.getElementById("bigWinItemImage") as HTMLImageElement;
const bigWinRarityText = document.getElementById("bigWinRarityText") as HTMLHeadingElement;

let isRolling = false;

// 1. Core CS:GO drop probability rates algorithm simulator
function getRandomTierDrop(activeCase: CaseConfig): DropItem {
    const rng = Math.random() * 100;
    let selectedRarity: 'blue' | 'purple' | 'pink' | 'red' | 'gold' = 'blue';

    // Official Cumulative Probability Threshold Checks
    if (rng < 0.26) {
        selectedRarity = 'gold';    // 0.26% Special Rare Drop Chance (1 in 384 openings)
    } else if (rng < 0.26 + 0.64) {
        selectedRarity = 'red';     // 0.64% Covert Chance
    } else if (rng < 0.26 + 0.64 + 3.20) {
        selectedRarity = 'pink';    // 3.20% Classified Chance
    } else if (rng < 0.26 + 0.64 + 3.20 + 15.98) {
        selectedRarity = 'purple';  // 15.98% Restricted Chance
    } else {
        selectedRarity = 'blue';    // 79.92% Mil-Spec Base Chance
    }

    // Filter active case pool for the specifically chosen rarity tier
    let tierPool = activeCase.drops.filter(item => item.rarity === selectedRarity);

    // Fallback safeguard in case configuration layout runs empty
    if (tierPool.length === 0) {
        tierPool = activeCase.drops;
    }

    // Pick a random base skin from that specific tier
    let baseItem = tierPool[Math.floor(Math.random() * tierPool.length)];

    // If placeholder gold item gets selected, swap it with a specific knife skin from the hidden goldPool
    if (baseItem.rarity === 'gold' && activeCase.goldPool.length > 0) {
        const randomGoldIndex = Math.floor(Math.random() * activeCase.goldPool.length);
        baseItem = activeCase.goldPool[randomGoldIndex];
    }

    // Clone the item object so modifying names doesn't overwrite your master database template array
    const absoluteDrop: DropItem = { ...baseItem };

    // 🌟 Authentic 10% StatTrak™ Upgrade Roll (Knives become StatTrak™ naturally too!)
    if (Math.random() < 0.10) {
        if (absoluteDrop.rarity === 'gold') {
            absoluteDrop.name = `★ StatTrak™ ${absoluteDrop.name.replace('★ ', '')}`;
        } else {
            absoluteDrop.name = `StatTrak™ ${absoluteDrop.name}`;
        }
    }

    return absoluteDrop;
}

// 2. The dynamic animation assembly spinner engine
async function startUnboxing() {
    if (isRolling || !selectedCase || !currentUser) return;

    if (currentUser.balance < selectedCase.price) {
        alert("Nincs elég egyenleged a nyitáshoz!");
        return;
    }

    isRolling = true;
    caseRollBtn.disabled = true;
    caseBezaras.disabled = true;

    currentUser.balance -= selectedCase.price;
    userInfo.textContent = `Felhasználónév: ${currentUser.username}; Pénz: ${currentUser.balance}Ft`;
    
    fetch(`${link}/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser)
    }).catch(err => console.error("Balance sync failed", err));

    const totalItemsCount = 60;
    const winningItemIndex = 45; 
    const generatedTrackItems: DropItem[] = [];

    for (let i = 0; i < totalItemsCount; i++) {
        if (i === winningItemIndex) {
            // Roll the winning outcome using the true official drop weights
            generatedTrackItems.push(getRandomTierDrop(selectedCase));
        } else {
            // Generate standard random filler items representing realistic distributions visually
            generatedTrackItems.push(getRandomTierDrop(selectedCase));
        }
    }

    caseTrack.style.transition = "none";
    caseTrack.style.transform = "translateX(0px)";
    caseTrack.innerHTML = "";

    // Generate elements to attach to dynamic tape container element
    generatedTrackItems.forEach((item) => {
        const isStatTrak = item.name.includes("StatTrak™");
        const cleanName = item.name.replace("StatTrak™ ", "");

        const block = document.createElement("div");
        block.className = `track-item rarity-${item.rarity}`;
        block.innerHTML = `
            <img src="${item.image}" onerror="this.src='https://placehold.co/75x75/1a1a1a/ffffff?text=Drop'">
            <div class="text-truncate w-100 text-center mt-1">
                ${isStatTrak ? '<span class="stattrak-text small d-block">StatTrak™</span>' : ''}
                <span class="fw-bold">${cleanName}</span>
            </div>
        `;
        caseTrack.appendChild(block);
    });

    caseTrack.offsetHeight;

    const itemWidth = 131; 
    const wrapperCenterOffset = 350; 
    const exactTargetCenterPixel = (winningItemIndex * itemWidth) + (itemWidth / 2);
    const randomizedInBoxScatter = Math.floor(Math.random() * 40) - 20; 
    const finalTransformOffsetPosition = exactTargetCenterPixel - wrapperCenterOffset + randomizedInBoxScatter;

    caseTrack.style.transition = "transform 5s cubic-bezier(0.1, 0.85, 0.25, 1)";
    caseTrack.style.transform = `translateX(-${finalTransformOffsetPosition}px)`;

    setTimeout(() => {
        const finalWinnerItem = generatedTrackItems[winningItemIndex];
        showBigWinnerScreen(finalWinnerItem);
    }, 5100);
}

// 3. Show Big Winner Overlay Function
function showBigWinnerScreen(winner: DropItem) {
    const isStatTrak = winner.name.includes("StatTrak™");
    const cleanName = winner.name.replace("StatTrak™ ", "");

    // Format big card texts dynamically
    if (isStatTrak) {
        bigWinItemName.innerHTML = `<span class="stattrak-text d-block fs-3 mb-1">StatTrak™</span><span class="text-white">${cleanName}</span>`;
    } else {
        bigWinItemName.textContent = winner.name;
    }

    bigWinItemImage.src = winner.image;
    bigWinItemImage.onerror = () => {
        bigWinItemImage.src = `https://placehold.co/220x220/1a1a1a/ffffff?text=${winner.rarity.toUpperCase()}`;
    };

    bigWinRarityText.textContent = winner.rarity === 'gold' ? "★ KÜLÖNLEGES RITKA TÁRGY!" : "ÚJ TÁRGYAT KAPTÁL!";
    bigPreviewCard.className = `big-preview-card text-center glow-${winner.rarity}`;
    bigPreviewOverlay.classList.add("show");
}

// 4. Close Big Winner Screen Function
function closeBigWinnerScreen() {
    bigPreviewOverlay.classList.remove("show");

    // Unlock and restore operational component states on structural layout references
    isRolling = false;
    caseRollBtn.disabled = false;
    caseBezaras.disabled = false;
    
    // Reset carousel track to default state
    caseTrack.style.transition = "none";
    caseTrack.style.transform = "translateX(0px)";
    caseTrack.innerHTML = "";
}

// Set up Action listeners inside application context
caseRollBtn?.addEventListener("click", startUnboxing);
bigPreviewOverlay?.addEventListener("click", closeBigWinnerScreen);