import { Link } from "react-router-dom";
import "./EmptyState.css";

export default function EmptyState({ icon = "📦", title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      {title && <div className="empty-state-title">{title}</div>}
      {message && <p className="empty-state-message">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="empty-state-action">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}