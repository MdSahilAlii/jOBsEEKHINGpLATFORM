import { userDropdownItems } from '@/layouts/components/data';
import { Link, useNavigate } from 'react-router';
import { Fragment } from 'react';
import { Dropdown, DropdownDivider, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import user2 from '@/assets/images/users/user-2.jpg';
import { useAuth } from '@/context/AuthContext';
const UserProfile = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/sign-in');
  };

  return <div className="topbar-item nav-user">
            <Dropdown align="end">
                <DropdownToggle as={'a'} className="topbar-link dropdown-toggle drop-arrow-none px-2">
                    <img src={user2} width="32" height="32" className="rounded-circle d-flex" alt="user-image" />
                </DropdownToggle>
                <DropdownMenu>
                    {userDropdownItems.map((item, idx) => <Fragment key={idx}>
                            {item.isHeader ? <div className="dropdown-header noti-title">
                                    <h6 className="text-overflow m-0">{user?.name ? `Welcome ${user.name}!` : item.label}</h6>
                                </div> : item.isDivider ? <DropdownDivider /> : item.label === 'Log Out' ? <DropdownItem onClick={handleLogout} className={item.class}>
                                    {item.icon && <item.icon className="me-2 fs-17 align-middle" />}
                                    <span className="align-middle">{item.label}</span>
                                </DropdownItem> : <DropdownItem as={Link} to={item.url ?? '#'} className={item.class}>
                                    {item.icon && <item.icon className="me-2 fs-17 align-middle" />}
                                    <span className="align-middle">{item.label}</span>
                                </DropdownItem>}
                        </Fragment>)}
                </DropdownMenu>
            </Dropdown>
        </div>;
};
export default UserProfile;