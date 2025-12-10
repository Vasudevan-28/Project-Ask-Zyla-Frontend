import React from "react";
import { ApiService } from "../services/dashboardApi";

import Zylaaa from "../gifs/norm-purf.gif"


export default function NotificationCenter({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
  userToken,
}) {
  const handleMarkRead = async (id) => {
    try {
      await ApiService.markNotificationRead(id, userToken);
      onMarkRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await ApiService.markAllNotificationsRead(userToken);
      onMarkAllRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatOriginalTime = (timestamp) => {
    const d = new Date(timestamp);
    return (
      d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " • " +
      d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
      })
    );
  };

  return (
    <div
      className="
        w-72 rounded-2xl bg-white/95 backdrop-blur-xl
        shadow-xl border border-purple-100/80
        overflow-hidden animate-fade-in
      "
    >
      {/* Header */}
      <div className="bg-purple-50 px-4 py-2.5 border-b border-purple-100 flex justify-between items-center">
        
        {/* Left Section: Image + Title */}
        <div className="flex items-center gap-2">
          {/* Small icon image */}
          <img
            src={Zylaaa}
            alt="App icon"
            className="h-10 w-10  object-cover"
          />

          <div className="text-[#1d0e2d]">
            {/* Title */}
            <h3 className="font-medium text-[13px]  leading-tight">
              Notifications
            </h3>

            {/* Subtitle */}
            <p className="text-[10px] ">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>
        </div>

        {/* Right Section: Mark all / Close */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] text-[#1d0e2d] hover:text-purple-900 font-medium px-2 py-1 rounded-full hover:bg-purple-100/70 transition"
            >
              Mark all
            </button>
          )}
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-[#1d0e2d] transition text-sm"
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[260px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-5 text-center text-gray-400 text-xs space-y-1.5">
            <div className="text-xl">🕊️</div>
            <div>No notifications yet</div>
            <p className="text-[10px] text-gray-400">
              We’ll notify you when something new arrives.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`
                  relative px-1 py-3 transition
                  ${notif.read ? "bg-white" : "bg-purple-50/50"}
                  hover:bg-purple-50
                `}
              >
                {!notif.read && (
                  <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-purple-500" />
                )}

                <div className="pl-3 pr-1">
                  <div className="flex justify-between items-start">
                    {/* Smaller Title */}
                    <h4
                      className={`text-[11px] ${
                        notif.read
                          ? "font-medium text-gray-600"
                          : "font-semibold text-pink-700/80"
                      }`}
                    >
                      {notif.title}
                    </h4>

                    {/* Mark read */}
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="text-[10px] text-[#1d0e2d] hover:text-purple-900 hover:underline ml-2"
                      >
                        Mark
                      </button>
                    )}
                  </div>

                  {/* Bigger Message */}
                  <p className="text-[13px] font-medium text-gray-800 leading-snug mt-0.5">
                    {notif.message}
                  </p>

                  {/* Full Timestamp */}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatOriginalTime(notif.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
