import { ClientSystem } from "./client-system.types";

export interface ClientSystemToken {
    id: string;
    clientSystem: ClientSystem;
    token: string;
    description?: string;
    expiresAt?: string | null;
    lastUsedAt?: string | null;
    active: boolean;
}