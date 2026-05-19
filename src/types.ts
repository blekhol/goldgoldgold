export interface User {
    username: string;
    password: string;
    balance: number;
}
export interface FormValues {
    username: string;
    password: string;
    [k: string]: FormDataEntryValue;
}