import {User} from "~/services/auth/auth.types";
import {SingleApiResponse} from "~/core/shared/types";


export type UpdateUserRequestProps = {
    username: string
    email: string
    firstName?: string
    lastName?: string,
    bio?: string,
}

export type UpdateUserRequest = { data: UpdateUserRequestProps }

export type UpdatePasswordRequestProps = {password: String}

export type UpdatePasswordRequest = { data: UpdatePasswordRequestProps }

export type UserApiResponse = SingleApiResponse<User>
