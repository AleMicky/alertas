import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class RefreshTokenService {
    generatePlainToken(): string {
        return `rt_${randomBytes(48).toString('hex')}`;
    }

    hash(token: string): Promise<string> {
        return bcrypt.hash(token, 10);
    }

    compare(token: string, hash: string): Promise<boolean> {
        return bcrypt.compare(token, hash);
    }

    expiresAt(days = 7): Date {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    }
}