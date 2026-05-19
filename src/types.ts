export interface User {
    id: number,
    username: string;
    password: string;
    balance: number;
}
export interface FormValues {
    username: string;
    password: string;
    [k: string]: FormDataEntryValue;
}

export interface DropItem {
    name: string;
    rarity: 'blue' | 'purple' | 'pink' | 'red' | 'gold';
    image: string;
}

export interface CaseConfig {
    id: string;
    name: string;
    price: number;
    image: string;
    drops: DropItem[];
    goldPool: DropItem[];
}