export interface RegistrationData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    [name: string]: string,
}

export interface ResetPasswordData{
    email: string,
}

export type LoginData = Omit<RegistrationData, 'firstName' | 'lastName'>


export type User = {
    id: number
    username?: string
    email?: string
    provider?: string
    confirmed?: boolean
    blocked?: boolean
    createdAt?: string
    updatedAt?: string
    firstName: string
    lastName: string
} | null
