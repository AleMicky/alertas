import { ClientSystem } from "./client-system.types";
import { SeverityLevel } from "../../severity-levels/severity-level.types";

export interface EventType {
    id: string;
    clientSystem: ClientSystem;
    code: string;
    name: string;
    description?: string;
    severityLevel?: SeverityLevel;
    active: boolean;
}