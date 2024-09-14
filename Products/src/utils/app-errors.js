const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};

class AppError extends Error {
    constructor(
        name,
        statusCode,
        description,
    ) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

//api Specific Errors
class APIError extends AppError {
    constructor(description = "api error") {
        super(
            "API Error",
            STATUS_CODES.NOT_FOUND,
            description
        )
    }
}

class NotFoundError extends AppError {
    constructor(description = "Not Found") {
        super(
            "Not Found",
            STATUS_CODES.INTERNAL_ERROR,
            description
        )
    }
}

module.exports = {
    AppError,
    APIError,
    NotFoundError
};