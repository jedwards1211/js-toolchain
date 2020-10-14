import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class UnionType<T> extends Type<T> {
    typeName: string;
    readonly types: Type<any>[];
    constructor(types: Type<any>[]);
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
