import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const UserDashboard = () => {
  const { user } = useContext(UserContext);

  return <>{user.username}</>;
};

export default UserDashboard;
