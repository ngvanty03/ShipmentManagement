import { PopupFormModal } from '../../../components/PopupFormModal';
import type { CreateUserRequest } from '../../../dto/user';
import type { FormErrors } from '../hooks/useUserForm';

interface UserFormModalProps {
    modalMode: string;
    formData: CreateUserRequest;
    setFormData: (data: CreateUserRequest) => void;
    errors: FormErrors;
    onClose: () => void;
    onSubmit: () => void;
}

export function UserFormModal({
    modalMode,
    formData,
    setFormData,
    errors,
    onClose,
    onSubmit
}: UserFormModalProps) {
    if (modalMode === '') return null;

    return (
        <PopupFormModal
            title={modalMode === 'create' ? 'New User' : 'Edit User'}
            isOpen={modalMode !== ''}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={false}
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="email"
                        type="text"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                </div>
                {modalMode === 'create' && (
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Password <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                        )}
                    </div>
                )}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">
                        First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Enter your first name"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                    {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1.5">
                        Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Enter your last name"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                    {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        id="user-isactive-toggle"
                        type="button"
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={`relative w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-indigo-600' : 'bg-slate-600'}`}
                        role="switch"
                        aria-checked={formData.isActive}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.isActive ? 'translate-x-5' : ''}`}
                        />
                    </button>
                    <span className="text-sm text-slate-600">Active</span>
                </div>
            </div>
        </PopupFormModal>
    );
}
