export interface RegistrationData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    [name: string]: unknown,
}

export interface ResetPasswordData {
    email: string,
}
export interface ForgetPasswordData {
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
    lastName: string,
    [key: string]: unknown,
} | null
