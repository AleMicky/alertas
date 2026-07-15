const MAX_ATTACHMENT_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_ATTACHMENTS = 10;
const ALLOWED_MIME_PREFIXES = ['image/', 'application/pdf', 'text/'];
const ALLOWED_MIME_TYPES = new Set([
  'application/json',
  'application/zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export type AttachmentInput = {
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  checksum?: string | null;
  sortOrder?: number;
};

export type AttachmentValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateNotificationAttachments(
  attachments: AttachmentInput[] = [],
): AttachmentValidationResult {
  const errors: string[] = [];

  if (attachments.length > MAX_ATTACHMENTS) {
    errors.push(`Máximo ${MAX_ATTACHMENTS} adjuntos por solicitud`);
  }

  attachments.forEach((attachment, index) => {
    const fileName = attachment.fileName?.trim();
    const url = attachment.url?.trim();
    const mimeType = attachment.mimeType?.trim().toLowerCase();

    if (!fileName) {
      errors.push(`Adjunto #${index + 1}: fileName es obligatorio`);
    }

    if (!url) {
      errors.push(`Adjunto #${index + 1}: url es obligatoria`);
    } else {
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          errors.push(`Adjunto #${index + 1}: url debe ser http(s)`);
        }
      } catch {
        errors.push(`Adjunto #${index + 1}: url inválida`);
      }
    }

    if (!mimeType) {
      errors.push(`Adjunto #${index + 1}: mimeType es obligatorio`);
    } else if (
      !ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix)) &&
      !ALLOWED_MIME_TYPES.has(mimeType)
    ) {
      errors.push(`Adjunto #${index + 1}: mimeType no permitido (${mimeType})`);
    }

    if (!Number.isFinite(attachment.sizeBytes) || attachment.sizeBytes <= 0) {
      errors.push(`Adjunto #${index + 1}: sizeBytes debe ser mayor a 0`);
    } else if (attachment.sizeBytes > MAX_ATTACHMENT_SIZE_BYTES) {
      errors.push(
        `Adjunto #${index + 1}: excede el tamaño máximo de 25MB`,
      );
    }
  });

  return { valid: errors.length === 0, errors };
}
