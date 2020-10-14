import Type from './types/Type';
import AnyType from './types/AnyType';
import ArrayType from './types/ArrayType';
import BooleanLiteralType from './types/BooleanLiteralType';
import BooleanType from './types/BooleanType';
import InstanceOfType from './types/InstanceOfType';
import IntersectionType from './types/IntersectionType';
import NullLiteralType from './types/NullLiteralType';
import UndefinedLiteralType from './types/UndefinedLiteralType';
import NumberType from './types/NumberType';
import NumericLiteralType from './types/NumericLiteralType';
import ObjectType from './types/ObjectType';
import ObjectTypeProperty from './types/ObjectTypeProperty';
import RecordType from './types/RecordType';
import StringLiteralType from './types/StringLiteralType';
import StringType from './types/StringType';
import SymbolLiteralType from './types/SymbolLiteralType';
import SymbolType from './types/SymbolType';
import TupleType from './types/TupleType';
import UnionType from './types/UnionType';
import TypeAlias from './types/TypeAlias';
import TypeReference from './types/TypeReference';
import Validation from './Validation';
import RuntimeTypeError from './errorReporting/RuntimeTypeError';
import oneOf from './oneOf';
export { Type, AnyType, ArrayType, BooleanLiteralType, BooleanType, InstanceOfType, IntersectionType, NullLiteralType, UndefinedLiteralType, NumberType, NumericLiteralType, ObjectType, ObjectTypeProperty, RecordType, StringLiteralType, StringType, SymbolLiteralType, SymbolType, TupleType, UnionType, TypeAlias, TypeReference, Validation, RuntimeTypeError, oneOf, };
export declare const any: () => Type<any>;
export declare const array: <T>(elementType: Type<T>) => Type<T[]>;
export declare const nullLiteral: () => Type<null>;
export { nullLiteral as null };
export declare const nullOr: <T>(type: Type<T>) => Type<T | null>;
export declare const undefinedLiteral: () => Type<undefined>;
export { undefinedLiteral as undefined };
export declare const nullish: <T>(type: Type<T>) => Type<T | null | undefined>;
export declare const nullishOr: <T>(type: Type<T>) => Type<T | null | undefined>;
export declare function boolean(): Type<boolean>;
export declare function boolean<T extends true | false>(literal: T): Type<T>;
export declare function number(): Type<number>;
export declare function number<T extends number>(literal: T): Type<T>;
export declare function string(): Type<string>;
export declare function string<T extends string>(literal: T): Type<T>;
export declare function symbol(): Type<symbol>;
export declare function symbol<T extends symbol>(literal: T): Type<T>;
declare type OptionalProperty<T> = {
    __optional__: Type<T>;
};
export declare const optional: <T>(type: Type<T>) => OptionalProperty<T>;
export declare const optionalNullOr: <T>(type: Type<T>) => OptionalProperty<T | null>;
declare type OptionalKeys<T> = {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
} extends {
    [_ in keyof T]: infer U;
} ? Record<any, any> extends U ? never : U : never;
export declare const object: <S extends Record<string | number | symbol, unknown>>({ exact, }?: {
    exact?: boolean | undefined;
}) => <P extends { [K in keyof S]-?: K extends OptionalKeys<S> ? OptionalProperty<any> : Type<any>; }>(properties: P) => ObjectType<{ [K_1 in keyof S]: P[K_1] extends OptionalProperty<infer T> ? T : P[K_1] extends Type<infer T_1> ? T_1 : never; }>;
declare type Properties = Record<string | number | symbol, Type<any>>;
export declare function simpleObject<Required extends Properties>(required: Required, { exact }?: {
    exact?: boolean;
}): ObjectType<{
    [K in keyof Required]: Required[K]['__type'];
}>;
export declare const record: <K extends string | number | symbol, V>(key: Type<K>, value: Type<V>) => RecordType<K, V>;
export declare const instanceOf: <T>(classType: new (...args: any[]) => T) => Type<T>;
export declare const tuple: <T extends Type<any>[]>(...types: T) => Type<{ [Index in keyof T]: T[Index] extends Type<infer E> ? E : never; }>;
export declare function allOf<T1>(...types: [Type<T1>]): Type<T1>;
export declare function allOf<T1, T2>(...types: [Type<T1>, Type<T2>]): Type<T1 & T2>;
export declare function allOf<T1, T2, T3>(...types: [Type<T1>, Type<T2>, Type<T3>]): Type<T1 & T2 & T3>;
export declare function allOf<T1, T2, T3, T4>(...types: [Type<T1>, Type<T2>, Type<T3>, Type<T4>]): Type<T1 & T2 & T3 & T4>;
export declare function allOf<T1, T2, T3, T4, T5>(...types: [Type<T1>, Type<T2>, Type<T3>, Type<T4>, Type<T5>]): Type<T1 & T2 & T3 & T4 & T5>;
export declare function allOf<T1, T2, T3, T4, T5, T6>(...types: [Type<T1>, Type<T2>, Type<T3>, Type<T4>, Type<T5>, Type<T6>]): Type<T1 & T2 & T3 & T4 & T5 & T6>;
export declare function allOf<T1, T2, T3, T4, T5, T6, T7>(...types: [
    Type<T1>,
    Type<T2>,
    Type<T3>,
    Type<T4>,
    Type<T5>,
    Type<T6>,
    Type<T7>
]): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7>;
export declare function allOf<T1, T2, T3, T4, T5, T6, T7, T8>(...types: [
    Type<T1>,
    Type<T2>,
    Type<T3>,
    Type<T4>,
    Type<T5>,
    Type<T6>,
    Type<T7>,
    Type<T8>
]): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>;
export declare const alias: <T>(name: string, type: Type<T>) => TypeAlias<T>;
export declare const ref: <T>(type: () => TypeAlias<T>) => Type<T>;
export declare type ExtractType<T extends Type<any>> = T['__type'];
