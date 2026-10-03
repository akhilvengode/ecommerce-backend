export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    info?: Record<string, unknown>;

    constructor(message: string, statusCode = 500, info?: Record<string, unknown>) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        if (info) {
            this.info = info;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}
