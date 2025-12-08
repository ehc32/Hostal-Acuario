import * as bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

/* ---------------------------------------------
   VALIDAR VARIABLE DE ENTORNO JWT_SECRET
----------------------------------------------*/
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("❌ Error: No se encontró JWT_SECRET en las variables de entorno.");
}

/* ---------------------------------------------
   GENERAR HASH DE CONTRASEÑA
----------------------------------------------*/
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/* ---------------------------------------------
   COMPARAR CONTRASEÑA CON HASH
----------------------------------------------*/
export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

/* ---------------------------------------------
   TIPO DEL PAYLOAD DEL TOKEN
----------------------------------------------*/
export interface TokenPayload {
    id: number;
    email: string;
    role: string;
}

/* ---------------------------------------------
   FIRMAR / CREAR TOKEN JWT
----------------------------------------------*/
export const signToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

/* ---------------------------------------------
   VERIFICAR TOKEN JWT
----------------------------------------------*/
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
};
