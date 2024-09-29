declare module 'next-connect' {
 import { NextApiRequest, NextApiResponse } from 'next';
 import { IncomingMessage, ServerResponse } from 'http';

 // Middleware types, where Req and Res are customizable request/response types
 interface Middleware<Req = IncomingMessage, Res = ServerResponse> {
   (req: Req, res: Res, next: (err?: unknown) => void): void;
 }

 interface Options<Req = IncomingMessage, Res = ServerResponse> {
   onError?: (err: unknown, req: Req, res: Res, next: (err?: unknown) => void) => void;
   onNoMatch?: (req: Req, res: Res) => void;
 }

 type HandlerReturnType = void | Promise<void>; // Instead of `any`, handlers return void or Promise<void>

 // Main function that returns the nextConnect handler
 export default function nextConnect<
   Req extends IncomingMessage = NextApiRequest,
   Res extends ServerResponse = NextApiResponse
 >(options?: Options<Req, Res>): {
   use: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType; // Use specific return type
   get: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType;
   post: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType;
   put: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType;
   delete: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType;
   patch: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType;
   options: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType;
   head: (...handlers: Middleware<Req, Res>[]) => HandlerReturnType;
   handler: (req: Req, res: Res) => HandlerReturnType;
 };
}
