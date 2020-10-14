import Type from './types/Type';
export declare type IdentifierPath = Array<string | number | symbol>;
export declare type ErrorTuple = [IdentifierPath, string, Type<any>];
export default class Validation<T> {
    readonly input: T;
    readonly path: IdentifierPath;
    readonly prefix: string;
    readonly errors: ErrorTuple[];
    cyclic: WeakMap<Type<any>, WeakSet<any>>;
    constructor(input: T, prefix?: string, path?: IdentifierPath);
    inCycle(type: Type<any>, input: any): boolean;
    startCycle(type: Type<any>, input: any): void;
    endCycle(type: Type<any>, input: any): void;
    hasErrors(): boolean;
}
export declare function stringifyPath(path: IdentifierPath): string;
export declare function resolvePath(input: any, path: IdentifierPath): any;
