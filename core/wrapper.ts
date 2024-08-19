export enum Status {
    initial = "initial",
    loading = "loading",
    success = "success",
    failure = "failure"
}

export class Wrapper<Type extends Object = {}> {
    _status = Status.initial;
    _value: Type = <Type>{};

    message?: String;

    public static getEmpty() {
        return new Wrapper();
    }

    constructor(value?: Type, status?: Status, errorMessage?: String) {
        this._value = value ?? <Type>{};
        this._status = status ?? Status.initial;
        this.message = errorMessage ?? '';
    }

    public copyWith(value?: Type, status?: Status, errorMessage?: String): Wrapper<Type> {
        return new Wrapper(
            value ?? this._value,
            status ?? this._status,
            errorMessage ?? this.message,
        )
    }

    public toSuccess(value: Type, message?: string) {
        return new Wrapper(
            value,
            Status.success,
            message ?? ''
        );
    }

    public toFailed(error: any): Wrapper<Type> {
        return new Wrapper<Type>(
            <Type>{},
            Status.failure,
            error ?? 'Error occurred'
        );
    }

    public toInitial() {
        return new Wrapper(
            <Type>{},
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