declare module 'jsonwebtoken' {
 export interface SignOptions {
   expiresIn?: string | number;
   notBefore?: string | number;
   audience?: string | string[];
   subject?: string;
   issuer?: string;
   jwtid?: string;
   mutatePayload?: boolean;
   noTimestamp?: boolean;
   header?: Record<string, unknown>;
   encoding?: string;
 }

 export interface VerifyOptions {
   algorithms?: string[];
   audience?: string | string[];
   clockTolerance?: number;
   issuer?: string | string[];
   ignoreExpiration?: boolean;
   ignoreNotBefore?: boolean;
   jwtid?: string;
   subject?: string;
   clockTimestamp?: number;
 }

 export interface JwtPayload {
   [key: string]: unknown; // Replaces `any` with `unknown` for stricter type checking
 }

 export interface DecodedToken {
   header: Record<string, unknown>;
   payload: JwtPayload;
   signature: string;
 }

 export function sign(
   payload: string | Buffer | object,
   secretOrPrivateKey: string | Buffer,
   options?: SignOptions
 ): string;

 export function verify(
   token: string,
   secretOrPublicKey: string | Buffer,
   options?: VerifyOptions
 ): JwtPayload | string;

 export function decode(
   token: string,
   options?: { json: boolean; complete: boolean }
 ): null | DecodedToken | JwtPayload | string;
}
