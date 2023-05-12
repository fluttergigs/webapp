export interface RegistrationData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
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
} | null
