//@ts-ignore
import {customAlphabet} from "nanoid";

export const generateUserName = (email: string) => {
    const nanoid = customAlphabet(`1234567890fluttergigs${email}`, 20);
    return `${nanoid()}`;
}

export const checkDigit = (event: KeyboardEvent) => {
    if (event.key.length === 1 && isNaN(Number(event.key))) {
        event.preventDefault();
    }
};