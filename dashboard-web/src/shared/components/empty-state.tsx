interface Props {
    title?: string;
    description?: string;
}

export function EmptyState({
    title = 'Sin registros',
    description = 'No existen datos registrados.',
}: Props) {
    return (
        <div className="rounded-md border border-dashed p-8 text-center">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
}