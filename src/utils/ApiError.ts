class ApiError extends Error {
    statusCode: number;
    success: boolean;
    data?: any;
     constructor(
        statusCode : number,
        message: string = "Something went wrong",
        data?: any,
        stack?: string
    ){
        super(message) // for msg
        // what does super(message) do ? it calls the constructor of the parent class (Error) and passes the message argument to it, which sets the message property of the error object. This allows us to use the built-in functionality of the Error class while also adding our own custom properties and methods to the ApiError class.
        this.statusCode = statusCode
        this.success = false;
        this.data = data;

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}