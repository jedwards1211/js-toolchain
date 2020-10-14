import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class NullLiteralType extends Type<null> {
    typeName: string;
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
