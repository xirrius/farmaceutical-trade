import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../redux/state/authSlice";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  Avatar,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  const menuItems = isAuthenticated
    ? [
        ["Home", "/"],
        // ["Profile", "/profile"],
        ["Marketplace", "/products"],
        ["View Listings", "/products/my"],
        ["Add Listing", "/products/add"],
        ["My Transactions", "/transactions/"],
        ["My Rentals", "/rentals"],
        // ["Chat", "/conversations/"],
        // ["Log Out"],
      ]
    : [
        ["Home", "/"],
        ["Marketplace", "/products"],
        ["Sign Up", "/register"],
        ["Sign In", "/login"],
      ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarBrand className="gap-2 ">
            <img src="logo.png" alt="" className="w-10" />
            <p className="font-bold text-inherit">Farmaceutical Trade</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NavLink
                color={
                  index === 2
                    ? "primary"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                className="w-full"
                to={item[1]}
                size="lg"
              >
                {item[0]}
              </NavLink>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
        <NavbarContent as="div" justify="end">
          <NavbarItem className="hidden md:flex">
            <NavLink color="foreground" to={'/'}>
              Home
            </NavLink>
          </NavbarItem>
          <NavbarItem className="hidden sm:flex">
            <NavLink color="foreground" to="/products">
              Marketplace
            </NavLink>
          </NavbarItem>
          {loading && (
            <NavbarItem>
              <Spinner></Spinner>
            </NavbarItem>
          )}
          {!isAuthenticated && !loading && (
            <>
              <NavbarItem>
                <Button as={NavLink} color="primary" to="/login" variant="flat">
                  Sign In
                </Button>
              </NavbarItem>
              <NavbarItem className="hidden sm:flex">
                <Button
                  as={NavLink}
                  color="primary"
                  to="/register"
                  variant="flat"
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}
          {user && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={user?.name}
                  size="sm"
                  src={user?.profile_pic}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  onClick={() => navigate("/profile")}
                >
                  My Profile
                </DropdownItem>
                <DropdownItem
                  key="myprofile"
                  onClick={() => navigate("/conversations")}
                >
                  Chat
                </DropdownItem>
                <DropdownItem
                  key="chat"
                  onClick={() => navigate("/products/my")}
                  className="hidden sm:block"
                >
                  View Listings
                </DropdownItem>
                <DropdownItem
                  key="myproducts"
                  onClick={() => navigate("/products/add")}
                  className="hidden sm:block"
                >
                  Add Listing
                </DropdownItem>
                <DropdownItem
                  key="addproduct"
                  onClick={() => navigate("/transactions")}
                  className="hidden sm:block"
                >
                  My Transactions
                </DropdownItem>
                <DropdownItem
                  key="transactions"
                  onClick={() => navigate("/rentals")}
                  className="hidden sm:block"
                >
                  My Rentals
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        </NavbarContent>
      </Navbar>

      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
