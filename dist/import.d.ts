export declare const script: {
    import(paths: string | string[]): Promise<any[]>;
    unload(paths: string | string[]): Promise<void>;
};
export declare const style: {
    import(paths: string | string[]): Promise<void>;
    unload(paths: string | string[]): Promise<void>;
};
export declare const html: {
    import(path: string, el?: HTMLElement): Promise<HTMLElement | DocumentFragment>;
};
