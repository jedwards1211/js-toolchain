import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class ArrayType<T> extends Type<Array<T>> {
    typeName: string;
    readonly elementType: Type<T>;
    constructor(elementType: Type<T>);
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
