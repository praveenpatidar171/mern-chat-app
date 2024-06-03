import { useChatState } from '../../Context/ChatProvider';
import '../style.css'

export const NotificationBadge = () => {

    const {notification } = useChatState();
    
    return <div>
        {notification.length > 0 && (
            <div className="notification-badge">
                <span className="badge">
                    {notification.length}
                </span>
            </div>
        )}
    </div>
}