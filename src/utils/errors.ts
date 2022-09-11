import { AppError } from "src/errors/AppError";
export const treatError = (err: any) => {
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      body: JSON.stringify({ message: err.message }),
      headers: { "Content-type": "application/json" },
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal server error - ${err.message}`,
      }),
      headers: { "Content-type": "application/json" },
    };
  }
};
