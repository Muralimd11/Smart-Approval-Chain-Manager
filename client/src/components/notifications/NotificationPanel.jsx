import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationPanel = ({ onClose }) => {
    const { notifications, markAllAsRead } = useNotifications();
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={panelRef}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 max-h-96 overflow-y-auto"
        >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    Mark all read
                </button>
            </div>

            <div className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
