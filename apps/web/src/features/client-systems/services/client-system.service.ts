import { baseService } from '@/shared/core/base.service';

import { ClientSystem } from '../types/client-system.types';
import {
    CreateClientSystemDto,
    UpdateClientSystemDto,
} from '../schemas/client-system.schema';

const endpoint = '/client-systems';

export const clientSystemService = baseService<
    ClientSystem,
    CreateClientSystemDto,
    UpdateClientSystemDto
>(endpoint);