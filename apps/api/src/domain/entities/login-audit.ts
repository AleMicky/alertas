export class LoginAudit {
    id: string;
    userId?: string | null;
    username?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    success: boolean;
    failureReason?: string | null;
    createdAt: Date;
}