import React, { useEffect, useRef } from 'react'

interface PopupFormModalProps {
    title: string
    isOpen: boolean
    onClose: () => void
    onSubmit: () => void
    isSubmitting?: boolean
    isLoading: boolean
    children: React.ReactNode
}

export function PopupFormModal({
    title,
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    isLoading,
    children,
}: PopupFormModalProps) {
    const backdropRef = useRef<HTMLDivElement>(null)

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            ref={backdropRef}
            id="popup-form-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === backdropRef.current && onClose()}
        >
            <div
                id="popup-form-modal"
                className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl"
                style={{ animation: 'slideUp 0.2s ease' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    <button
                        id="modal-close-btn"
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">{children}</div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
                    <button
                        id="modal-cancel-btn"
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting || isLoading}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >

                        Cancel
                    </button>
                    <button
                        id="modal-submit-btn"
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting || isLoading}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {(isSubmitting || isLoading) && (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {isSubmitting ? 'Saving…' : isLoading ? 'Loading…' : 'Save'}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}
