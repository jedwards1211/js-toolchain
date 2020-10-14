import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
import { TypeConstraint } from '../typeConstraints';
export default class TypeAlias<T> extends Type<T> {
    typeName: string;
    readonly name: string;
    readonly type: Type<T>;
    readonly constraints: TypeConstraint<T>[];
    constructor(name: string, type: Type<T>);
    addConstraint(...constraints: TypeConstraint<T>[]): this;
    get hasConstraints(): boolean;
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
