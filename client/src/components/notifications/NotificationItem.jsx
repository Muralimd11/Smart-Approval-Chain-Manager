import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDateTime } from '../../utils/helpers';

const NotificationItem = ({ notification }) => {
    const { markAsRead } = useNotifications();

    const handleClick = () => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''
                }`}
        >
            <p className="text-sm text-gray-900">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
                {formatDateTime(notification.createdAt)}
            </p>
            {!notification.isRead && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                    New
                </span>
            )}
        </div>
    );
};

export default NotificationItem;
