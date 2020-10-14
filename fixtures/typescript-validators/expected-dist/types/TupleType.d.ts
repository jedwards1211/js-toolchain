import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class TupleType<T extends any[]> extends Type<T> {
    typeName: string;
    readonly types: {
        [Index in keyof T]: Type<T[Index]>;
    };
    constructor(types: {
        [Index in keyof T]: Type<T[Index]>;
    });
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
