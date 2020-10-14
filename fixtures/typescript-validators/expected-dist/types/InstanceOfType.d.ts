import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class InstanceOfType<T> extends Type<T> {
    typeName: string;
    classType: {
        new (...args: any[]): T;
    };
    constructor(classType: {
        new (...args: any[]): T;
    });
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
