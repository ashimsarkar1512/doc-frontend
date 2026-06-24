export type NotificationActionType =
  | "PAYMENT_SUCCESS"
  | "ASSESSMENT_SUBMITTED"
  | "ASSESSMENT_ASSIGNED"
  | "ASSESSMENT_STATUS_UPDATED"
  | "PROPOSAL_ACCEPTED"
  | "PROPOSAL_REJECTED"
  | "ORDER_STATUS_UPDATED"
  | "SUBSCRIPTION_CANCELLED"
  | "NEW_MESSAGE"; // Added for chat

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  actionType: NotificationActionType;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    unreadCount: number;
    notifications: AppNotification[];
  };
}

export interface NotificationResponseData {
  unreadCount: number;
  notifications: AppNotification[];
}
