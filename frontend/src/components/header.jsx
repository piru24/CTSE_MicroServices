import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "./Store";
import { HiMenu, HiX } from "react-icons/hi";
import Logo from "./ui/Logo";
import NavItem from "./ui/NavItem";
import MobileMenu from "./MobileMenu";
import ConfirmationModal from "./authentication/ConfirmationModal";
import LoginModal from "./authentication/login";
import RegisterModal from "./authentication/register";

// ✅ Axios global
axios.defaults.withCredentials = true;

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const NAV_CONFIG = {
  buyer: [
    { path: "/products", label: "Browse" },
    { path: "/cart", label: (qty) => `Cart (${qty})` },
    { path: "/getOrders", label: "Orders" },
    { path: "/profile", label: "Profile" },
  ],
  seller: [
    { path: "/seller/dashboard", label: "My Products" },
    { path: "/viewOrders", label: "Sales" },
    { path: "/profile", label: "Profile" },
  ],
  admin: [
    { path: "/admin/users", label: "Users" },
    { path: "/admin/orders", label: "Orders" },
    { path: "/admin/analytics", label: "Analytics" },
  ],
  delivery: [
    { path: "/profile", label: "Profile" },
    { path: "/deliveryDashboard", label: "Assigned Deliveries" },
  ],
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, role: reduxRole } = useSelector((s) => s.auth);
  const cartQuantity = useSelector((s) => s.cart.quantity);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(reduxRole || "");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // ✅ HELPER: GET TOKEN HEADER
  const getAuthConfig = () => ({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ✅ INITIAL AUTH CHECK
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/user/profile`,
          getAuthConfig()
        );

        if (response.data?.user) {
          const user = response.data.user;

          dispatch(
            authActions.login({
              userId: user._id,
              role: user.role,
              email: user.email,
            })
          );

          setUserRole(user.role);
        }
      } catch (error) {
        dispatch(authActions.logout());
        setUserRole("");
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  // ✅ UPDATE ROLE AFTER LOGIN
  useEffect(() => {
    if (!isLoggedIn) {
      setUserRole("");
      return;
    }

    const getUserProfile = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/user/profile`,
          getAuthConfig()
        );

        if (res.data?.user?.role) {
          setUserRole(res.data.user.role);
        }
      } catch (err) {
        console.error("Profile error:", err);
        dispatch(authActions.logout());
        setUserRole("");
      }
    };

    getUserProfile();
  }, [isLoggedIn, dispatch]);

  // ✅ LOGOUT
  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE}/user/logout`,
        {},
        getAuthConfig()
      );

      localStorage.removeItem("token"); // 🔥 IMPORTANT
      dispatch(authActions.logout());
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  // ✅ NAV ITEMS
  const navItems =
    isLoggedIn && NAV_CONFIG[userRole]
      ? NAV_CONFIG[userRole].map((item) => ({
          path: item.path,
          label:
            typeof item.label === "function"
              ? item.label(cartQuantity)
              : item.label,
        }))
      : [];

  return (
    <header className="bg-gradient-to-r from-orange-600 via-[#f7941d] to-orange-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">

          {/* LEFT */}
          <div className="flex items-center space-x-10">
            <Link to="/" className="flex items-center space-x-3">
              <Logo />
              <span className="text-2xl font-extrabold text-white">
                EBuy
              </span>
            </Link>

            {isLoggedIn && (
              <nav className="hidden md:flex space-x-8">
                {navItems.map((item) => (
                  <NavItem key={item.path} to={item.path}>
                    {item.label}
                  </NavItem>
                ))}
              </nav>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center space-x-6">

            {!isLoggedIn ? (
              <>
                <NavItem onClick={() => setShowLogin(true)}>
                  Log In
                </NavItem>

                <NavItem onClick={() => setShowRegister(true)}>
                  Sign Up
                </NavItem>
              </>
            ) : (
              <NavItem onClick={() => setShowLogoutConfirm(true)}>
                Logout
              </NavItem>
            )}

            <LoginModal
              isOpen={showLogin}
              onClose={() => setShowLogin(false)}
              onSuccess={() => setShowLogin(false)}
            />

            <RegisterModal
              isOpen={showRegister}
              onClose={() => setShowRegister(false)}
              onSuccess={() => setShowRegister(false)}
            />

            <ConfirmationModal
              isOpen={showLogoutConfirm}
              onClose={() => setShowLogoutConfirm(false)}
              onConfirm={handleLogout}
              message="Are you sure you want to log out?"
            />

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        isAuthenticated={isLoggedIn}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;