import * as bootstrap from 'bootstrap';
import { type CaseConfig, type DropItem, type User } from './types.ts';


let selectedCase: CaseConfig | null = null;
let isRolling = false;
let getCurrentUser: () => User | null;
let updateAccountBalance: (newBalance: number) => Promise<void>;


const AVAILABLE_CASES: CaseConfig[] = [
    {
        id: "case1",
        name: "CS:GO Weapon Case 1",
        price: 66500,
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
        price: 600,
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
        price: 1500,
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

let caseLobbyGrid: HTMLDivElement;
let modalCaseName: HTMLHeadingElement;
let modalCasePrice: HTMLSpanElement;
let modalDropList: HTMLDivElement;
let caseRollBtn: HTMLButtonElement;
let caseTrack: HTMLDivElement;
let caseBezaras: HTMLButtonElement;
let bigPreviewOverlay: HTMLDivElement;
let bigPreviewCard: HTMLDivElement;
let bigWinItemName: HTMLHeadingElement;
let bigWinItemImage: HTMLImageElement;
let bigWinRarityText: HTMLHeadingElement;
let bsCaseModal: bootstrap.Modal;


export function initCaseSimulator(
    userProviderFn: () => User | null, 
    balanceUpdaterFn: (newBalance: number) => Promise<void>
) {
    getCurrentUser = userProviderFn;
    updateAccountBalance = balanceUpdaterFn;

    caseLobbyGrid = document.getElementById("caseLobbyGrid") as HTMLDivElement;
    modalCaseName = document.getElementById("modalCaseName") as HTMLHeadingElement;
    modalCasePrice = document.getElementById("modalCasePrice") as HTMLSpanElement;
    modalDropList = document.getElementById("modalDropList") as HTMLDivElement;
    caseRollBtn = document.getElementById("caseRollBtn") as HTMLButtonElement;
    caseTrack = document.getElementById("caseTrack") as HTMLDivElement;
    caseBezaras = document.getElementById("caseBezaras") as HTMLButtonElement;
    bigPreviewOverlay = document.getElementById("bigPreviewOverlay") as HTMLDivElement;
    bigPreviewCard = document.getElementById("bigPreviewCard") as HTMLDivElement;
    bigWinItemName = document.getElementById("bigWinItemName") as HTMLHeadingElement;
    bigWinItemImage = document.getElementById("bigWinItemImage") as HTMLImageElement;
    bigWinRarityText = document.getElementById("bigWinRarityText") as HTMLHeadingElement;
    
    const caseModalNative = document.getElementById("CaseModal") as HTMLElement;
    bsCaseModal = new bootstrap.Modal(caseModalNative);

    caseLobbyGrid?.addEventListener("click", handleCaseSelection);
    caseRollBtn?.addEventListener("click", startUnboxing);
    bigPreviewOverlay?.addEventListener("click", closeBigWinnerScreen);

    renderCaseLobby();
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

    updateCaseButtonsDisabledState();
}

export function updateCaseButtonsDisabledState() {
    const user = getCurrentUser();
    const selectButtons = document.querySelectorAll(".select-case-btn") as NodeListOf<HTMLButtonElement>;
    selectButtons.forEach(btn => {
        btn.disabled = !user;
    });
}

function handleCaseSelection(e: Event) {
    const target = e.target as HTMLButtonElement;
    if (target && target.classList.contains("select-case-btn")) {
        const caseId = target.getAttribute("data-id");
        const foundCase = AVAILABLE_CASES.find(c => c.id === caseId);
        if (foundCase) {
            openCaseSelectionModal(foundCase);
        }
    }
}

function openCaseSelectionModal(caseData: CaseConfig) {
    selectedCase = caseData;
    modalCaseName.textContent = caseData.name;
    modalCasePrice.textContent = caseData.price.toString();
    modalDropList.innerHTML = "";
    
    const caseEredmeny = document.getElementById("caseEredmeny")!;
    caseEredmeny.textContent = "";
    caseTrack.innerHTML = "";

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

function getRandomTierDrop(activeCase: CaseConfig): DropItem {
    const rng = Math.random() * 100;
    let selectedRarity: 'blue' | 'purple' | 'pink' | 'red' | 'gold' = 'blue';

    if (rng < 0.26) {
        selectedRarity = 'gold';    // 0.26% 
    } else if (rng < 0.26 + 0.64) {
        selectedRarity = 'red';     // 0.64% 
    } else if (rng < 0.26 + 0.64 + 3.20) {
        selectedRarity = 'pink';    // 3.20% 
    } else if (rng < 0.26 + 0.64 + 3.20 + 15.98) {
        selectedRarity = 'purple';  // 15.98% 
    } else {
        selectedRarity = 'blue';    // 79.92% 
    }

    let tierPool = activeCase.drops.filter(item => item.rarity === selectedRarity);
    if (tierPool.length === 0) tierPool = activeCase.drops;

    let baseItem = tierPool[Math.floor(Math.random() * tierPool.length)];

    if (baseItem.rarity === 'gold' && activeCase.goldPool.length > 0) {
        const randomGoldIndex = Math.floor(Math.random() * activeCase.goldPool.length);
        baseItem = activeCase.goldPool[randomGoldIndex];
    }

    const absoluteDrop: DropItem = { ...baseItem };

    if (Math.random() < 0.10) {
        if (absoluteDrop.rarity === 'gold') {
            absoluteDrop.name = `★ StatTrak™ ${absoluteDrop.name.replace('★ ', '')}`;
        } else {
            absoluteDrop.name = `StatTrak™ ${absoluteDrop.name}`;
        }
    }

    return absoluteDrop;
}

async function startUnboxing() {
    const user = getCurrentUser();
    if (isRolling || !selectedCase || !user) return;

    if (user.balance < selectedCase.price) {
        alert("Nincs elég egyenleged a nyitáshoz!");
        return;
    }

    isRolling = true;
    caseRollBtn.disabled = true;
    caseBezaras.disabled = true;

    const newBalance = user.balance - selectedCase.price;
    await updateAccountBalance(newBalance);

    const totalItemsCount = 60;
    const winningItemIndex = 45; 
    const generatedTrackItems: DropItem[] = [];

    for (let i = 0; i < totalItemsCount; i++) {
        generatedTrackItems.push(getRandomTierDrop(selectedCase));
    }

    caseTrack.style.transition = "none";
    caseTrack.style.transform = "translateX(0px)";
    caseTrack.innerHTML = "";

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

function showBigWinnerScreen(winner: DropItem) {
    const isStatTrak = winner.name.includes("StatTrak™");
    const cleanName = winner.name.replace("StatTrak™ ", "");

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

function closeBigWinnerScreen() {
    bigPreviewOverlay.classList.remove("show");

    isRolling = false;
    caseRollBtn.disabled = false;
    caseBezaras.disabled = false;
    
    caseTrack.style.transition = "none";
    caseTrack.style.transform = "translateX(0px)";
    caseTrack.innerHTML = "";
}