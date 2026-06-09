'use client';

import { useQuery } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Props<T> {
    queryKey: string;
    queryFn: () => Promise<T[]>;
    label: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    getOptionLabel: (item: T) => string;
    getOptionValue: (item: T) => string;
}

export function GenericSelectFetch<T>({
    queryKey,
    queryFn,
    label,
    placeholder,
    value,
    disabled,
    onChange,
    getOptionLabel,
    getOptionValue,
}: Props<T>) {

    const { data = [], isLoading } = useQuery({
        queryKey: [queryKey],
        queryFn,
    });

    return (
        <div className="space-y-2">
            <Label>
                {label}
            </Label>
            <Select
                value={value}
                onValueChange={(value) => onChange(value ?? '')}
                disabled={disabled || isLoading}
            >
                <SelectTrigger>
                    <SelectValue
                        placeholder={
                            isLoading
                                ? 'Cargando...'
                                : placeholder
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    {data.map((item) => (
                        <SelectItem
                            key={getOptionValue(item)}
                            value={getOptionValue(item)}
                        >
                            {getOptionLabel(item)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}