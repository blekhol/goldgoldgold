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