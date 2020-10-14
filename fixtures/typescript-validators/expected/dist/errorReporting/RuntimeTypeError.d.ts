import { ErrorTuple } from '../Validation';
export default class RuntimeTypeError extends TypeError {
    name: string;
    errors: ErrorTuple[] | null | undefined;
    constructor(message: string, options?: {
        errors?: ErrorTuple[] | null | undefined;
    });
}
