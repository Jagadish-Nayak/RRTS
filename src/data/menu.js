import { 
    FaWpforms , 
    FaClipboardList, 
    FaMapMarkedAlt, 
    FaCog, 
    FaUser,
    FaSignOutAlt,
  } from "react-icons/fa";
import { MdManageAccounts, MdConstruction } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";

export const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: <FaWpforms className="h-5 w-5" />,
          label: "Complaint",
          href: "/complaint",
          visible: ["user"],
        },
        {
          icon: <FaClipboardList className="h-5 w-5" />,
          label: "All Complaints",
          href: "/list/complaints",
          visible: ["user", "admin", "supervisor", "mayor"],
        },
        {
          icon: <FaMapMarkedAlt className="h-5 w-5" />,
          label: "Track Complaint",
          href: "/track",
          visible: ["admin", "user", "supervisor", "mayor"],
        },
        {
          icon: <VscFeedback className="h-5 w-5" />,
          label: "Feedbacks",
          href: "/list/feedback",
          visible: ["user", "admin", "supervisor", "mayor"],
        },
        {
          icon: <MdManageAccounts className="h-5 w-5" />,
          label: "Supervisors",
          href: "/list/supervisors",
          visible: ["admin","mayor"],
        },
        {
          icon: <MdConstruction className="h-5 w-5" />,
          label: "Manage Resources",
          href: "/list/resources",
          visible: ["admin"],
        },
        // {
        //   icon: "/lesson.png",
        //   label: "Lessons",
        //   href: "/list/lessons",
        //   visible: ["admin", "teacher"],
        // },
        // {
        //   icon: "/exam.png",
        //   label: "Exams",
        //   href: "/list/exams",
        //   visible: ["admin", "teacher", "student", "parent"],
        // },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: <FaUser className="h-5 w-5" />,
          label: "Profile",
          href: "/profile",
          visible: ["admin", "user", "supervisor", "mayor"],
        },
        {
          icon: <FaCog className="h-5 w-5" />,
          label: "Settings",
          href: "/settings",
          visible: ["admin", "user", "supervisor", "mayor"],
        },
        {
          icon: <FaSignOutAlt className="h-5 w-5" />,
          label: "Logout",
          href: "/logout",
          visible: ["admin", "user", "supervisor", "mayor"],
        },
      ],
    },
  ];