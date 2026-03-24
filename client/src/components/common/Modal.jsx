import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

                <div className="inline-block relative z-[101] align-bottom bg-[#eef2f6] dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-[#eef2f6] dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 className="text-xl leading-6 font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
                                    {title}
                                </h3>
                                <div className="mt-4">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
