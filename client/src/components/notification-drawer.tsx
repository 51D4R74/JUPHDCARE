/**
 * NotificationDrawer — slide-over panel listing recent in-app notifications.
 *
 * Uses shadcn Sheet component. Marks all as read on open.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Bell, Check } from "lucide-react";
import {
  getNotifications,
  markAllRead,
  markRead,
  type AppNotification,
  NOTIFICATION_TEMPLATES,
} from "@/lib/notification-engine";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export default function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (open) {
      setNotifications(getNotifications());
    }
  }, [open]);

  const handleMarkAllRead = () => {
    markAllRead();
    setNotifications(getNotifications());
  };

  const handleMarkRead = (id: string) => {
    markRead(id);
    setNotifications(getNotifications());
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white border-l border-border-soft shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-soft">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Notificações</h2>
          </div>
          <div className="flex items-center gap-1">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-brand-teal hover:underline px-2 py-1"
              >
                Marcar todas como lidas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Bell className="w-8 h-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Novas notificações aparecerão aqui
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border-soft/50">
              {notifications.map((n) => {
                const template = NOTIFICATION_TEMPLATES[n.type];
                return (
                  <li
                    key={n.id}
                    className={`px-4 py-3 hover:bg-surface-warm/50 transition-colors cursor-pointer ${
                      !n.read ? "bg-brand-teal/5" : ""
                    }`}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-base mt-0.5" role="img" aria-label={n.type}>
                        {template.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-xs ${!n.read ? "font-semibold" : "font-medium"} truncate`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1">
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.div>
    </>
  );
}
