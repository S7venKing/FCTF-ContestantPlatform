import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FaBell, FaFlag, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { API_GET_NOTIFICATION, BASE_URL } from "../constants/ApiConstant";
import { ACCESS_TOKEN_KEY } from "../constants/LocalStorageKey";
import ApiHelper from "../utils/ApiHelper";

const Template = ({ children, title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateUnreadCount = () => {
    setUnreadCount(
      notifications.filter((notification) => !notification.isRead).length
    );
  };

  useEffect(() => {
    updateUnreadCount();
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const api = new ApiHelper(BASE_URL);
      try {
        const response = await api.get(API_GET_NOTIFICATION);
        if (response.success) {
          const sortedNotifications = response.data
            .map((notification) => ({
              ...notification,
              isRead: false,
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setNotifications(sortedNotifications);
        } else {
          console.error("Error fetching notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatToCustomDateTime = (isoString) => {
    return format(new Date(isoString), "dd/MM/yyyy HH:mm");
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const menuItems = [
    { title: "Challenges", icon: <FaFlag />, url: "/topics" },
    { title: "Score Board", icon: <FaRankingStar />, url: "/rankings" },
    { title: "Ticket", icon: <IoTicket />, url: "/tickets" },
    { title: "Profile", icon: <FaUser />, url: "/profile" },
    {
      title: "Notifications",
      icon: (
        <div className="relative">
          <FaBell />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </div>
      ),
      onClick: () => setIsNotificationOpen(!isNotificationOpen),
    },
    { title: "Logout", icon: <FaSignOutAlt />, onClick: () => handleLogout() },
  ];

  return (
    <div className="bg-secondary min-h-screen flex flex-row font-mono">
      <div className="bg-secondary h-screen flex-shrink-0" style={{ flex: 1 }}>
        <div className="h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 my-5">
            <div className="flex-shrink-0 w-full" onClick={handleLogoClick}>
              <img
                className="h-20 w-auto"
                src="/fctf-logo.png"
                alt="Logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fctf-logo.png";
                }}
              />
            </div>
          </div>
          <div className="flex flex-col flex-grow bg-gradient-to-b from-primary-low to-orange mb-3">
            <div
              className=" shadow-md mt-3 p-3  flex flex-wrap items-center justify-center border-2 border-secondary rounded-lg max-w-7xl mx-auto"
              style={{ flex: 1 }}
            >
              {menuItems.map((item, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        navigate(item.url);
                      }
                    }}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-theme-color-gray hover:text-theme-color-primary-dark hover:bg-primary-low transition-all duration-300"
                  >
                    <span className="mr-2 text-3xl">{item.icon}</span>
                  </button>

                  {item.title === "Notifications" && isNotificationOpen && (
                    <div className=" right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                      {currentNotifications.length > 0 ? (
                        currentNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 cursor-pointer transition-all duration-300 ${
                              notification.isRead
                                ? "bg-gray-100"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatToCustomDateTime(notification.date)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          No notifications available
                        </div>
                      )}
                      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200">
                        <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                          className="text-sm text-theme-color-primary hover:text-theme-color-primary-dark disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-xs text-gray-500">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className="text-sm text-theme-color-primary hover:text-theme-color-primary-dark disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              className="shadow-md mt-5 overflow-y-auto p-3 w-full items-center justify-center border-2 border-secondary rounded-lg"
              style={{ height: "50vh" }}
            >
              <h1 className="text-2xl font-bold text-center mt-4 uppercase">
                Activity
              </h1>
              <div></div>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-theme-color-primary hover:text-theme-color-primary-dark"
              >
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <main
        className="font-mono bg-white rounded-lg m-3 flex-grow"
        style={{ flex: 3 }}
      >
        <h1 className="text-2xl font-bold text-center mt-4 uppercase text-primary">
          {title}
        </h1>
        <div className="max-w-7xl mx-auto text-primary">{children}</div>
      </main>
    </div>
  );
};

export default Template;
