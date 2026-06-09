export interface SeverityLevel {
    id: string;
    code: string;
    name: string;
    description: string;
    priority: number;
    attentionTimeMinutes: number;
    active: boolean;
}