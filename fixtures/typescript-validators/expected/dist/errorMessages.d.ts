declare const errorMessages: {
    ERR_CONSTRAINT_VIOLATION: string;
    ERR_EXPECT_ARRAY: string;
    ERR_EXPECT_TRUE: string;
    ERR_EXPECT_FALSE: string;
    ERR_EXPECT_BOOLEAN: string;
    ERR_EXPECT_EMPTY: string;
    ERR_EXPECT_EXACT_VALUE: string;
    ERR_EXPECT_CALLABLE: string;
    ERR_EXPECT_CLASS: string;
    ERR_EXPECT_FUNCTION: string;
    ERR_EXPECT_GENERATOR: string;
    ERR_EXPECT_ITERABLE: string;
    ERR_EXPECT_ARGUMENT: string;
    ERR_EXPECT_RETURN: string;
    ERR_EXPECT_N_ARGUMENTS: string;
    ERR_EXPECT_INSTANCEOF: string;
    ERR_EXPECT_KEY_TYPE: string;
    ERR_EXPECT_NULL: string;
    ERR_EXPECT_UNDEFINED: string;
    ERR_EXPECT_NUMBER: string;
    ERR_EXPECT_OBJECT: string;
    ERR_EXPECT_PROMISE: string;
    ERR_EXPECT_STRING: string;
    ERR_EXPECT_SYMBOL: string;
    ERR_EXPECT_THIS: string;
    ERR_EXPECT_VOID: string;
    ERR_EXPECT_LENGTH: string;
    ERR_INVALID_DATE: string;
    ERR_MISSING_PROPERTY: string;
    ERR_NO_INDEXER: string;
    ERR_NO_UNION: string;
    ERR_UNKNOWN_KEY: string;
};
export declare type ErrorKey = keyof typeof errorMessages;
export default errorMessages;
