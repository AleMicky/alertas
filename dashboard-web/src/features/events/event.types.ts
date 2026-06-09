import { ClientSystem } from "../client-systems/types/client-system.types";
import { SeverityLevel } from "../severity-levels/severity-level.types";

export interface Event {
    id: string;
    clientSystem: ClientSystem;
    code: string;
    eventType: string;
    title: string;
    message: string;
    payloadJson?: Record<string, unknown>;
    /** Alias que puede enviar la API en snake_case */
    payload_json?: Record<string, unknown>;
    severityLevel: SeverityLevel;
    status: string;
    eventDate: Date;
    processedAt?: Date;
    active: boolean;
}