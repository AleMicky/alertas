import { Badge } from '@/components/ui/badge';

interface Props {
    active: boolean;
}

export function StatusBadge({ active }: Props) {
    return (
        <Badge variant={active ? 'default' : 'destructive'}>
            {active ? 'Activo' : 'Inactivo'}
        </Badge>
    );
}