// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import Customer from "ERP/Pages/CustomerPage.js";
import Product from "ERP/Pages/ProductPage.js";
import POS from "ERP/Pages/PosPage.js";
import ProductCategory from "ERP/Pages/ProductCategoryPage.js";
import TableList from "views/TableList/TableList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";

const dashBoardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Table List",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: LocationOn,
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/customer",
    name: "Customer",
    icon: LibraryBooks,
    component: Customer,
    layout: "/admin"
  },
  {
    path: "/productCat",
    name: "Product Category",
    icon: LibraryBooks,
    component: ProductCategory,
    layout: "/admin"
  },
  {
    path: "/productA",
    name: "Product",
    icon: LibraryBooks,
    component: Product,
    layout: "/admin"
  },
  {
    path: "/pos",
    name: "Point Of Sale",
    icon: LibraryBooks,
    component: POS,
    layout: "/admin"
  }
];

export default dashBoardRoutes;