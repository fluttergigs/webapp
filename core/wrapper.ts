export enum Status {
    initial = "initial",
    loading = "loading",
    success = "success",
    failure = "failure"
}

export class Wrapper<Type = unknown> {
    _status = Status.initial;
    _value: Type = <Type>{};

    error?: string;

    public static getEmpty() {
        return new Wrapper();
    }

    constructor(value?: Type, status?: Status, errorMessage?: String) {
        this._value = value!;
        this._status = status!;
        this.error = errorMessage
    }

    public copyWith(value?: Type, status?: Status, errorMessage?: String): Wrapper<Type> {
        return new Wrapper(
            value ?? this._value,
            status ?? this._status,
            errorMessage ?? this.error,
        )
    }

    public toSuccess(value: Type) {
        return new Wrapper(
            value,
            Status.success
        );
    }

    public toFailed(error: any): Wrapper<Type> {
        return new Wrapper<Type>(
            {},
            Status.failure,
            error
        );
    }

    public toInitial() {
        return new Wrapper(
            null,
            Status.initial,
        );
    }

    public toLoading = (value?: Type): Wrapper<Type> =>
        new Wrapper(
            value as Type ?? this._value,
            Status.loading,
        );

    get value(): Type {
        return this._value;
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

    get status() {
        return this._status;
    }

    toJSON() {
        return {...this};
    }
}