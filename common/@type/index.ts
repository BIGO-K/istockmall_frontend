export interface DataSource {
    /**
     *
     * @param {string} callName 호출해야할 API | JSON | Memory 이름
     * @param {object} params route, query 파라미터
     * @param {FormData|object} payload 본문
     */
    execute<T>(
        callName: string,
        params: { [key: string]: any },
        payload: { [key: string]: any } | FormData
    ): Promise<T>;
}


export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
export type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>
export type ExcludeOptional<T> = Pick<T, RequiredKeys<T>>   // type 혹은 interface에서 필수값인 프로퍼티만 Pick


/**
 * 심플 페이지네이터 객체
 */
interface SimplePaginator<T> {
    perPage: number;
    currentPage: number;
    data: T[];
}

/**
 * 심플페이지네이터 리스폰스 객체
 */
interface SimplePaginatorResponse<T> {
    per_page: number;
    current_page: number;
    data: T[];
}

/**
 * 페이지네이터 객체
 */
interface Paginator<T> extends SimplePaginator<T> {
    total: number;
}

/**
 * 페이지네이터 리스폰스 객체
 */
interface PaginatorResponse<T> {
    paginator: {
        total: number;
        per_page: number;
        current_page: number;
        data: T[];
    };
}

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
    [Property in Key]-?: Type[Property];
};

type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
} ? {
    -readonly [Key in keyof P]: P[Key]
} : never;

export type {
    Paginator,
    PaginatorResponse,
    SimplePaginator,
    SimplePaginatorResponse,
    WithRequiredProperty,
    ExtractComponentProps,
};
