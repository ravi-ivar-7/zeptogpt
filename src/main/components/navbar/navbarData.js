import { Home, Menu, User, Building2, Mail} from 'lucide-react'

const menuItems = [
  {
    title: "Dashboard",
    description: "Access your main dashboard",
    emoji: "📊",
    gradient: "from-blue-600 to-indigo-600",
    href: "/"
  },
  {
    title: "Features",
    description: "Explore platform capabilities",
    emoji: "⚡",
    gradient: "from-purple-600 to-indigo-600",
    href: "/"
  }
]

const companyItems = [
  {
    title: "Contact",
    description: "Reach out to our support or sales team",
    emoji: "📬",
    gradient: "from-blue-500 to-blue-700",
    href: "/company/contact"
  },
  {
    title: "About Us",
    description: "Learn more about our mission and team",
    emoji: "🏢",
    gradient: "from-indigo-500 to-purple-600",
    href: "/company/about"
  },
  {
    title: "Privacy Policy",
    description: "Understand how we protect your data",
    emoji: "🔒",
    gradient: "from-green-500 to-emerald-600",
    href: "/company/privacy"
  },
  {
    title: "Terms of Service",
    description: "Read the rules for using our platform",
    emoji: "📄",
    gradient: "from-yellow-500 to-amber-600",
    href: "/company/terms"
  },
  {
    title: "Refund Policy",
    description: "Know when and how you can get a refund",
    emoji: "💸",
    gradient: "from-rose-500 to-pink-600",
    href: "/company/refund"
  }
];

const userDropdownItems = [
  {
    title: "Profile",
    description: "Manage your account settings",
    emoji: "👤",
    gradient: "from-blue-600 to-indigo-600",
    href: "/account/profile"
  },
  {
    title: "Sign Out",
    description: "End your current session",
    emoji: "🚪",
    gradient: "from-red-600 to-pink-600",
    href: "/account/logout"
  }
]

const authDropdownItems = [
  {
    title: "Sign In",
    description: "Access your account",
    emoji: "🔑",
    gradient: "from-blue-600 to-indigo-600",
    href: "/account/login"
  },
  {
    title: "Get Started",
    description: "Create a new account",
    emoji: "✨",
    gradient: "from-purple-600 to-pink-600",
    href: "/account/register"
  }
]


export const getNavItems = (isAuthenticated) => [
  {
    title: 'Home',
    icon: Home,
    href: '/',
    hasDropdown: false
  },
  {
    title: 'About',
    icon: Building2,
    href: '/company/about',
    hasDropdown: false
  },
  {
    title: 'Contact',
    icon: Mail,
    href: '/company/contact',
    hasDropdown: false
  }
]

export { menuItems, companyItems, userDropdownItems, authDropdownItems }
