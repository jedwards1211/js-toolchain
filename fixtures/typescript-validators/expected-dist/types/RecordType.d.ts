import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class RecordType<K extends string | number | symbol, V> extends Type<Record<K, V>> {
    typeName: string;
    readonly key: Type<K>;
    readonly value: Type<V>;
    constructor(key: Type<K>, value: Type<V>);
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
