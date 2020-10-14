import Type from './Type';
import TypeAlias from './TypeAlias';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class TypeReference<T> extends Type<T> {
    typeName: string;
    readonly type: () => TypeAlias<T>;
    constructor(type: () => TypeAlias<T>);
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
