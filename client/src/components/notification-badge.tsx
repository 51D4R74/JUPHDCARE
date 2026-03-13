/**
 * NotificationBadge — bell icon with unread count dot.
 * Tapping opens the notification drawer.
 */

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getUnreadCount } from "@/lib/notification-engine";

interface NotificationBadgeProps {
  readonly onClick: () => void;
  readonly className?: string;
}

export default function NotificationBadge({ onClick, className }: Readonly<NotificationBadgeProps>) {
  const [count, setCount] = useState(() => getUnreadCount());

  // Refresh count on focus (e.g. user returns from another tab)
  useEffect(() => {
    function refresh() { setCount(getUnreadCount()); }
    window.addEventListener("focus", refresh);
    // Also poll periodically for in-tab updates
    const iv = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("focus", refresh);
      clearInterval(iv);
    };
  }, []);

  return (
    <button
      onClick={() => {
        onClick();
        // Re-read after opening
        setTimeout(() => setCount(getUnreadCount()), 300);
      }}
      className={`relative p-2 rounded-lg hover:bg-black/5 transition-colors ${className ?? ""}`}
      data-testid="button-notifications"
      aria-label={count > 0 ? `Notificações (${count} não lidas)` : "Notificações"}
    >
      <Bell className="w-4 h-4 text-muted-foreground" />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-score-critical rounded-full" />
      )}
    </button>
  );
}
