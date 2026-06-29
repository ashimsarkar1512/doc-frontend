import io from "socket.io-client";
import { toast } from "sonner";
import baseApi from "@/Redux/api/baseApi";
import { AppNotification, NotificationsResponse } from "@/types/notificationTypes";
import { RootState } from "@/Redux/store/store";

let socket: ReturnType<typeof io> | null = null;

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/notifications",
      providesTags: ["Notifications"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
      ) {
        try {
          // Wait for the initial query to resolve before connecting
          await cacheDataLoaded;

          const state = getState() as RootState;
          const token = state.auth.token;

          if (!token) return;

          // Initialize Socket
          // Disconnect existing if any
          if (socket) {
            socket.disconnect();
          }

          let apiOrigin = "https://prod.weightlossmdcherrycreek.com";
          if (process.env.NEXT_PUBLIC_API_BASE_URL) {
            try {
              const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
              apiOrigin = url.origin;
            } catch {
              apiOrigin = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/.*$/, '').replace(/\/$/, '');
            }
          }
          const wsUrl = apiOrigin.replace(/^http/, 'ws') + '/notifications';

          socket = io(wsUrl, {
            auth: { token },
            transports: ["websocket"],
          });

          socket.on("connect", () => {
            console.log("[Notification] WebSocket connected");
          });

          // Listen for incoming notifications
          socket.on("notification", (newNotification: AppNotification) => {
            updateCachedData((draft) => {
              if (draft?.data) {
                // Ensure we don't duplicate notifications
                const exists = draft.data.notifications.some((n) => n.id === newNotification.id);
                if (!exists) {
                  draft.data.notifications.unshift(newNotification);
                  draft.data.unreadCount += 1;
                  
                  // Show toast
                  toast.success(newNotification.title, {
                    description: newNotification.message,
                  });
                }
              }
            });
          });

          socket.on("error", (err: any) => {
            console.error("[Notification] WebSocket Error:", err);
          });

          socket.on("disconnect", () => {
            console.log("[Notification] WebSocket disconnected");
          });

        } catch (error) {
          console.error("Error setting up socket connection:", error);
        }

        // Cleanup on cache entry removed
        await cacheEntryRemoved;
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      },
    }),

    markAsRead: builder.mutation<{ success: boolean; statusCode: number; message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
            if (draft?.data) {
              const notification = draft.data.notifications.find((n) => n.id === id);
              if (notification && !notification.isRead) {
                notification.isRead = true;
                draft.data.unreadCount = Math.max(0, draft.data.unreadCount - 1);
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    markAllAsRead: builder.mutation<{ success: boolean; statusCode: number; message: string }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
            if (draft?.data) {
              draft.data.notifications.forEach((n) => {
                n.isRead = true;
              });
              draft.data.unreadCount = 0;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
