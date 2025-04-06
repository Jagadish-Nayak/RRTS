import { 
    FaWpforms , 
    FaClipboardList,  
    FaUser,
    FaSignOutAlt,
    FaHome,
  } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { IoDocumentText } from "react-icons/io5";

export const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: <FaHome className="h-5 w-5" />,
          label: "Home",
          href: "/",
          visible: ["user", "admin", "supervisor", "mayor"],
        },
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
          icon: <VscFeedback className="h-5 w-5" />,
          label: "Feedbacks",
          href: "/list/feedbacks",
          visible: ["supervisor"],
        },
        {
          icon: <VscFeedback className="h-5 w-5" />,
          label: "Give Feedback",
          href: "/feedback/1",
          visible: ["user"],
        },
        {
          icon: <MdManageAccounts className="h-5 w-5" />,
          label: "Supervisors",
          href: "/list/supervisors",
          visible: ["admin","mayor"],
        },
        {
          icon: <IoDocumentText className="h-5 w-5" />,
          label: "Report Submission",
          href: "/report/1",
          visible: ["supervisor"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: <FaUser className="h-5 w-5" />,
          label: "Profile",
          href: "/profile",
          visible: ["user", "supervisor"],
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