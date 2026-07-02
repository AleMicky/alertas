import {
  NotificationDeliveryStatus,
} from 'src/domain/enums';
import { NotificationRequestStatus } from 'src/domain/enums';

export function recalculateNotificationRequestStatusFromDeliveries(
  deliveryStatuses: NotificationDeliveryStatus[],
): NotificationRequestStatus {
  if (!deliveryStatuses.length) {
    return NotificationRequestStatus.FAILED;
  }

  const delivered = deliveryStatuses.filter(
    (status) => status === NotificationDeliveryStatus.DELIVERED,
  ).length;
  const sent = deliveryStatuses.filter(
    (status) => status === NotificationDeliveryStatus.SENT,
  ).length;
  const failed = deliveryStatuses.filter(
    (status) => status === NotificationDeliveryStatus.FAILED,
  ).length;
  const pending = deliveryStatuses.filter((status) =>
    [
      NotificationDeliveryStatus.PENDING,
      NotificationDeliveryStatus.QUEUED,
    ].includes(status),
  ).length;

  if (pending > 0) {
    return NotificationRequestStatus.PROCESSING;
  }

  if (delivered === deliveryStatuses.length || sent === deliveryStatuses.length) {
    return NotificationRequestStatus.SENT;
  }

  if (failed === deliveryStatuses.length) {
    return NotificationRequestStatus.FAILED;
  }

  if (delivered > 0 || sent > 0) {
    return NotificationRequestStatus.PARTIAL;
  }

  return NotificationRequestStatus.FAILED;
}
