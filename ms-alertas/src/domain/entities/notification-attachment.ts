export type NotificationAttachmentData = {
  id: string;
  notificationRequestId: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export class NotificationAttachment implements NotificationAttachmentData {
  id: string;
  notificationRequestId: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
