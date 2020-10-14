import Type from './Type';
import { ErrorTuple } from '../Validation';
export default class AnyType extends Type<any> {
    typeName: string;
    errors(): Generator<ErrorTuple, void, void>;
    accepts(): boolean;
    toString(): string;
}
