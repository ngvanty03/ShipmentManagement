import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { userApi } from '../../api/userApi';
import UserContainer from './UserContainer';
vi.mock('../../api/userApi', () => ({
    userApi: {
        searchUser: vi.fn(),
        getUserById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
}));
vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() }
}));

const mockUsers = [
    { id: '1', email: 'alice@example.com', firstName: 'Alice', lastName: 'Nguyen', isActive: true },
];
const mockUserDetail = {
    id: '1',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Nguyen',
    isActive: true,
};
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        }
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
describe('User Feature Real Integration', () => {

    it('should show the data from loading list user API ', async () => {
        // ✅ API returns list
        vi.mocked(userApi.searchUser).mockResolvedValue({
            pageNumber: 0,
            pageSize: 10,
            totalCount: 2,
            totalPages: 1,
            items: mockUsers
        });

        render(<UserContainer />, { wrapper: createWrapper() });
        // wait for list to load
        await waitFor(() => {
            expect(screen.getByText('alice@example.com')).toBeInTheDocument();
        });
        expect(screen.getByText('Alice Nguyen')).toBeInTheDocument();
    });
    it('should show loading state while fetching user detail', async () => {
        // ✅ API returns list
        vi.mocked(userApi.searchUser).mockResolvedValue({
            pageNumber: 0,
            pageSize: 10,
            totalCount: 2,
            totalPages: 1,
            items: mockUsers
        });

        // ✅ API delays detail response — simulates loading
        vi.mocked(userApi.getUserById).mockImplementation(() =>
            new Promise(resolve =>
                setTimeout(() => resolve(mockUserDetail), 500)
            )
        );

        render(<UserContainer />, { wrapper: createWrapper() });

        // wait for list to load
        await waitFor(() => {
            expect(screen.getByText('alice@example.com')).toBeInTheDocument();
        });

        // click edit button
        await userEvent.click(screen.getByTestId('btn-edit-1'));
        expect(screen.getByTestId('modal-submit-btn')).toBeDisabled();
        expect(screen.getByTestId('modal-submit-btn')).toHaveTextContent('Loading…');
        // wait for form to load
        await waitFor(() => {
            expect(screen.getByTestId('user-form-email')).toHaveValue('alice@example.com');
        });
        expect(screen.getByTestId('user-form-first-name')).toHaveValue('Alice');
        expect(screen.getByTestId('user-form-last-name')).toHaveValue('Nguyen');
        expect(screen.getByTestId('user-form-is-active')).toBeChecked();
        expect(screen.getByTestId('modal-submit-btn')).not.toBeDisabled();
        expect(screen.getByTestId('modal-submit-btn')).toHaveTextContent('Save');
    });
});