import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserContainer from './UserContainer';

// ─── Mock hooks ───────────────────────────────────────────────────────────────
vi.mock('../../api/userApi', () => ({
    userApi: {
        searchUser: vi.fn(),
        getUserById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
}));

vi.mock('./hooks/useUserList');
vi.mock('./hooks/useUserForm');
vi.mock('./hooks/useUserDelete');
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

import { useUserList } from './hooks/useUserList';
import { useUserForm } from './hooks/useUserForm';
import { useUserDelete } from './hooks/useUserDelete';

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockUsers = [
    { id: '1', email: 'alice@example.com', firstName: 'Alice', lastName: 'Nguyen', isActive: true },
    { id: '2', email: 'bob@example.com', firstName: 'Bob', lastName: 'Tran', isActive: false },
    { id: '3', email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Le', isActive: true },
    { id: '4', email: 'david@example.com', firstName: 'David', lastName: 'Pham', isActive: false },
    { id: '5', email: 'eve@example.com', firstName: 'Eve', lastName: 'Vo', isActive: true },
];

const defaultFilterParam = {
    pageNumber: 1,
    pageSize: 10,
    isActive: true,
    email: '',
    sortDirection: 'asc',
    sortBy: 'id',
};

// ─── Default mock return values ───────────────────────────────────────────────

const defaultUseUserList = {
    loading: false,
    users: mockUsers,
    filterParam: defaultFilterParam,
    setParams: vi.fn(),
    handleSortData: vi.fn(),
    handlePageChange: vi.fn(),
    totalPages: 3,
};

const defaultUseUserForm = {
    formData: { email: '', password: '', firstName: '', lastName: '', isActive: true },
    setFormData: vi.fn(),
    modalMode: '',
    setModalMode: vi.fn(),
    errors: {},
    handleFormSubmit: vi.fn(),
    handleOpenAddModal: vi.fn(),
    handleOpenEditModal: vi.fn(),
    isSubmitting: false,
    isLoading: false,
};

const defaultUseUserDelete = {
    deleteTarget: null,
    handleDelete: vi.fn(),
    onDeleteConfirm: vi.fn(),
    onDeleteCancel: vi.fn(),
};

// ─── Helper: reset mocks before each test ────────────────────────────────────

beforeEach(() => {
    vi.mocked(useUserList).mockReturnValue(defaultUseUserList);
    vi.mocked(useUserForm).mockReturnValue(defaultUseUserForm);
    vi.mocked(useUserDelete).mockReturnValue(defaultUseUserDelete);
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('User Feature Integration', () => {

    // ── Journey 1: Page renders correctly ─────────────────────────────────────

    describe('Journey 1: Page Layout', () => {

        it('should render page correctly with empty data', () => {
            const customUseUserList = {
                ...defaultUseUserList,
                users: [],
            };
            vi.mocked(useUserList).mockReturnValue(customUseUserList);
            render(<UserContainer />);

            expect(screen.getByText('User Management')).toBeInTheDocument();
            expect(screen.getByText('Add new')).toBeInTheDocument();
            expect(screen.getByTestId('search-isactive')).toBeInTheDocument();
            expect(screen.getByText('Search')).toBeInTheDocument();
            expect(screen.getByText('Clear')).toBeInTheDocument();
            expect(screen.getByText('No data found')).toBeInTheDocument();
            const select = screen.getByTestId('search-isactive');
            expect(select).toHaveValue('true');
            expect(screen.getByPlaceholderText('Search by email...')).toHaveValue('');
        });
        it('should render page correctly with mock data', () => {
            render(<UserContainer />);
            expect(screen.getByText('User Management')).toBeInTheDocument();
            expect(screen.getByText('Add new')).toBeInTheDocument();
            expect(screen.getByTestId('search-isactive')).toBeInTheDocument();
            expect(screen.getByText('Search')).toBeInTheDocument();
            expect(screen.getByText('Clear')).toBeInTheDocument();
            expect(screen.queryByText('No data found')).not.toBeInTheDocument();
            const select = screen.getByTestId('search-isactive');
            expect(select).toHaveValue('true');
            expect(screen.getByPlaceholderText('Search by email...')).toHaveValue('');
            expect(screen.getByText('#')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('First Name')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Actions')).toBeInTheDocument();
        });
        it('should render pagination control correctly with mock data but totalPages is 1', () => {
            vi.mocked(useUserList).mockReturnValue({
                ...defaultUseUserList,
                totalPages: 1,
            });
            render(<UserContainer />);
            const pageSize = screen.getAllByTestId('pagination-pageSize');
            expect(pageSize).toHaveLength(2); // top + bottom ✅           
            expect(screen.queryByTestId('pagination-container')).not.toBeInTheDocument();
        });
        it('should render pagination control correctly with mock data but totalPages is more than 1', () => {

            render(<UserContainer />);
            const pageSize = screen.getAllByTestId('pagination-pageSize');
            expect(pageSize).toHaveLength(2); // top + bottom ✅           
            const pageContainer = screen.getAllByTestId('pagination-container');
            expect(pageContainer).toHaveLength(2); // top + bottom ✅  
        });
    });
    describe('Journey 2: Add Edit /  User', () => {
        it('should open modal when Add New clicked', async () => {
            vi.mocked(useUserForm).mockReturnValue({
                ...defaultUseUserForm,
                modalMode: 'create',
            });

            render(<UserContainer />);
            //check form control
            expect(screen.getByTestId('user-form-email')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-password')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-first-name')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-last-name')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-is-active')).toBeInTheDocument();
            expect(screen.getByText('New User')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
            //check form value
            expect(screen.getByTestId('user-form-email')).toHaveValue('');
            expect(screen.getByTestId('user-form-password')).toHaveValue('');
            expect(screen.getByTestId('user-form-first-name')).toHaveValue('');
            expect(screen.getByTestId('user-form-last-name')).toHaveValue('');
            expect(screen.getByTestId('user-form-is-active')).toBeChecked();
        });
        it('should open modal when edit clicked for user is active', async () => {
            vi.mocked(useUserForm).mockReturnValue({
                ...defaultUseUserForm,
                modalMode: 'edit',
                formData: {
                    email: 'ngvanty03@gmail.com',
                    password: '[PASSWORD]',
                    firstName: 'Ty',
                    lastName: 'Nguyen',
                    isActive: true,
                },
            });

            render(<UserContainer />);
            //check form control
            expect(screen.getByTestId('user-form-email')).toBeInTheDocument();
            expect(screen.queryByTestId('user-form-password')).not.toBeInTheDocument();
            expect(screen.getByTestId('user-form-first-name')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-last-name')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-is-active')).toBeInTheDocument();
            expect(screen.getByText('Edit User')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
            //check form value
            expect(screen.getByTestId('user-form-email')).toHaveValue('ngvanty03@gmail.com');
            expect(screen.getByTestId('user-form-first-name')).toHaveValue('Ty');
            expect(screen.getByTestId('user-form-last-name')).toHaveValue('Nguyen');
            expect(screen.getByTestId('user-form-is-active')).toBeChecked();
        });
        it('should open modal when edit clicked for user is inactive', async () => {
            vi.mocked(useUserForm).mockReturnValue({
                ...defaultUseUserForm,
                modalMode: 'edit',
                formData: {
                    email: 'ngvanty03@gmail.com',
                    password: '[PASSWORD]',
                    firstName: 'Ty',
                    lastName: 'Nguyen',
                    isActive: false,
                },
            });

            render(<UserContainer />);
            //check form control
            expect(screen.getByTestId('user-form-email')).toBeInTheDocument();
            expect(screen.queryByTestId('user-form-password')).not.toBeInTheDocument();
            expect(screen.getByTestId('user-form-first-name')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-last-name')).toBeInTheDocument();
            expect(screen.getByTestId('user-form-is-active')).toBeInTheDocument();
            expect(screen.getByText('Edit User')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
            //check form value
            expect(screen.getByTestId('user-form-email')).toHaveValue('ngvanty03@gmail.com');
            expect(screen.getByTestId('user-form-first-name')).toHaveValue('Ty');
            expect(screen.getByTestId('user-form-last-name')).toHaveValue('Nguyen');
            expect(screen.getByTestId('user-form-is-active')).not.toBeChecked();
            expect(screen.getByTestId('modal-submit-btn')).toBeEnabled();
            expect(screen.getByTestId('modal-submit-btn')).toHaveTextContent('Save');
        });
        it('should show spinner when isSubmitting is true', async () => {
            vi.mocked(useUserForm).mockReturnValue({
                ...defaultUseUserForm,
                modalMode: 'edit',
                isSubmitting: false,
                isLoading: true,
                formData: {
                    email: 'ngvanty03@gmail.com',
                    password: '[PASSWORD]',
                    firstName: 'Ty',
                    lastName: 'Nguyen',
                    isActive: false,
                },
            });

            render(<UserContainer />);
            //check form control
            expect(screen.getByTestId('modal-submit-btn')).toBeDisabled();
            expect(screen.getByTestId('modal-submit-btn')).toHaveTextContent('Save1');
        });
    });
});
