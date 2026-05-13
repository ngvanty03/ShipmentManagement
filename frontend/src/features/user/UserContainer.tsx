import { useUser } from './UserHook'
import UserView from './UserView';

export default function UserContainer() {
    const { loading, users, filterParam, setParams, handleSortData } = useUser();
    return (
        <UserView
            data={users}
            loading={loading}
            filterParam={filterParam}
            setFilterParam={setParams}
            handleSortData={handleSortData}
        />
    )
}