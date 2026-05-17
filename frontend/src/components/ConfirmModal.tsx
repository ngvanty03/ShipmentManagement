interface ConfirmModalProps {
    title?: string
    message: string
    isOpen: boolean
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
    confirmLabel?: string
    danger?: boolean
}

export function ConfirmModal({
    title = 'Confirm Action',
    message,
    isOpen,
    onConfirm,
    onCancel,
    isLoading,
    confirmLabel = 'Confirm',
    danger = true,
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div
            id="confirm-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
            <div
                id="confirm-modal"
                className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl p-6"
                style={{ animation: 'slideUp 0.2s ease' }}
            >
                <div className="flex items-start gap-4 mb-6">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${danger ? 'bg-red-500/15 text-red-400' : 'bg-indigo-500/15 text-indigo-400'}`}>
                        {danger ? '⚠' : 'ℹ'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
                        <p className="text-sm text-slate-500">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        id="confirm-cancel-btn"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        id="confirm-ok-btn"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-2 ${danger ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'
                            }`}
                    >
                        {isLoading && (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {confirmLabel}
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
