import Type from './Type';
import { TypeConstraint } from '../typeConstraints';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class ObjectTypeProperty<K extends string | number | symbol, V> extends Type<V> {
    typeName: string;
    readonly key: K;
    readonly value: Type<V>;
    readonly optional: boolean;
    readonly constraints: TypeConstraint<V>[];
    __objectType: Type<any>;
    constructor(key: K, value: Type<V>, optional: boolean);
    addConstraint(...constraints: TypeConstraint<V>[]): ObjectTypeProperty<K, V>;
    /**
     * Determine whether the property exists on the given input or its prototype chain.
     */
    existsOn(input: Record<string, any>): boolean;
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: Record<K, V>): boolean;
    toString(): string;
}
