import "express";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      role: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

// just to make this a module
export {};