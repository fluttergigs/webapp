export enum Status {
    initial = "initial",
    loading = "loading",
    success = "success",
    failure = "failure",
}

export class Wrapper<Type extends Object = {}> {
    status = Status.initial;
    value: Type = <Type>{};

    message?: String;

    constructor(value?: Type, status?: Status, errorMessage?: String) {
        this.value = value ?? <Type>{};
        this.status = status ?? Status.initial;
        this.message = errorMessage ?? "";
    }

    get isInitial(): boolean {
        return this.status === Status.initial;
    }

    get isLoading(): boolean {
        return this.status === Status.loading;
    }

    get isSuccess(): boolean {
        return this.status === Status.success;
    }

    get isFailure(): boolean {
        return this.status === Status.failure;
    }

    public static getEmpty() {
        return new Wrapper();
    }

    copyWith(
        value?: Type,
        status?: Status,
        errorMessage?: String
    ): Wrapper<Type> {
        return new Wrapper<Type>(
            value ?? this.value,
            status ?? this.status,
            errorMessage ?? this.message
        );
    }

    toSuccess(value: Type, message?: string): Wrapper<Type> {
        return new Wrapper<Type>(value, Status.success, message ?? "");
    }

    toFailed(error: any): Wrapper<Type> {
        return new Wrapper<Type>(
            <Type>{},
            Status.failure,
            error ?? "Error occurred"
        );
    }

    toInitial(): Wrapper<Type> {
        return new Wrapper<Type>(<Type>{}, Status.initial);
    }

    toLoading(value?: Type): Wrapper<Type> {
        return new Wrapper<Type>((value as Type) ?? this.value, Status.loading);
    }

    toJSON() {
        return {...this};
    }
}
