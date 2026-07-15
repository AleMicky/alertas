import { NotificationRecipientType } from 'src/domain/enums';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{6,20}$/;

export type RecipientInput = {
  type: NotificationRecipientType;
  address: string;
  label?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type RecipientValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateNotificationRecipients(
  recipients: RecipientInput[],
): RecipientValidationResult {
  const errors: string[] = [];

  if (!recipients.length) {
    errors.push('Debe indicar al menos un destinatario');
    return { valid: false, errors };
  }

  const seen = new Set<string>();

  recipients.forEach((recipient, index) => {
    const address = recipient.address?.trim();

    if (!address) {
      errors.push(`Destinatario #${index + 1}: la dirección es obligatoria`);
      return;
    }

    const dedupeKey = `${recipient.type}:${address.toLowerCase()}`;

    if (seen.has(dedupeKey)) {
      errors.push(`Destinatario duplicado: ${recipient.type} ${address}`);
    }

    seen.add(dedupeKey);

    switch (recipient.type) {
      case NotificationRecipientType.EMAIL:
        if (!EMAIL_REGEX.test(address)) {
          errors.push(`Destinatario #${index + 1}: email inválido (${address})`);
        }
        break;
      case NotificationRecipientType.PHONE:
        if (!PHONE_REGEX.test(address)) {
          errors.push(`Destinatario #${index + 1}: teléfono inválido (${address})`);
        }
        break;
      case NotificationRecipientType.CHAT_ID:
      case NotificationRecipientType.USER_ID:
      case NotificationRecipientType.WEBHOOK:
      case NotificationRecipientType.CUSTOM:
        if (address.length > 500) {
          errors.push(`Destinatario #${index + 1}: dirección demasiado larga`);
        }
        break;
      default:
        errors.push(`Destinatario #${index + 1}: tipo no soportado`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function normalizeRecipientsFromLegacyTarget(input: {
  target?: string;
  recipients?: RecipientInput[];
}): RecipientInput[] {
  if (input.recipients?.length) {
    return input.recipients;
  }

  if (input.target?.trim()) {
    return [
      {
        type: NotificationRecipientType.CUSTOM,
        address: input.target.trim(),
      },
    ];
  }

  return [];
}
