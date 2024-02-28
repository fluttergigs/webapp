//@ts-ignore
import {customAlphabet} from "nanoid";

export const generateUserName = (email: string) => {
    const nanoid = customAlphabet(`1234567890fluttergigs${email}`, 20);
    return `${nanoid()}`;
}