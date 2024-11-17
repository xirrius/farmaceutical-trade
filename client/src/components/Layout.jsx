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
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const {t} = useTranslation()

  const menuItems = isAuthenticated
    ? [
        ["Home", "/"],
        // ["Profile", "/profile"],
        ["Marketplace", "/products"],
        ["View Items", "/products/my"],
        ["Add Items", "/products/add"],
        ["My Activity Log", "/transactions/"],
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
            <p className="font-bold text-inherit">{t("Farmaceutical Trade")}</p>
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
                {t(item[0])}
              </NavLink>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
        <NavbarContent as="div" justify="end">
          <NavbarItem className="hidden md:flex">
            <NavLink color="foreground" to={"/"}>
              {t("Home")}
            </NavLink>
          </NavbarItem>
          <NavbarItem className="hidden sm:flex">
            <NavLink color="foreground" to="/products">
              {t("Marketplace")}
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
                  {t("Sign In")}
                </Button>
              </NavbarItem>
              <NavbarItem className="hidden md:flex">
                <Button
                  as={NavLink}
                  color="primary"
                  to="/register"
                  variant="flat"
                >
                  {t("Sign Up")}
                </Button>
              </NavbarItem>
            </>
          )}
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
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
                  <p className="font-semibold">{t("Signed in as")}</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  onClick={() => navigate("/profile")}
                >
                  {t("My Profile")}
                </DropdownItem>
                <DropdownItem
                  key="myprofile"
                  onClick={() => navigate("/conversations")}
                >
                  {t("Chat")}
                </DropdownItem>
                <DropdownItem
                  key="chat"
                  onClick={() => navigate("/products/my")}
                  className="hidden sm:block"
                >
                  {t("View Items")}
                </DropdownItem>
                <DropdownItem
                  key="myproducts"
                  onClick={() => navigate("/products/add")}
                  className="hidden sm:block"
                >
                  {t("Add Items")}
                </DropdownItem>
                <DropdownItem
                  key="addproduct"
                  onClick={() => navigate("/transactions")}
                  className="hidden sm:block"
                >
                  {t("My Activity Log")}
                </DropdownItem>
                <DropdownItem
                  key="transactions"
                  onClick={() => navigate("/rentals")}
                  className="hidden sm:block"
                >
                  {t("My Rentals")}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  {t("Log Out")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          <LanguageSwitcher />
        </NavbarContent>
      </Navbar>

      <div>
        <Outlet />
      </div>

      <div className="bg-black w-full h-[50px] flex items-center justify-center text-white text-xs">
        {t("@farmaceutical_trade")}
      </div>
    </div>
  );
};
export default Layout;
