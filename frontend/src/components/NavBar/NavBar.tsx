import React from "react";
import {
    Heart,
    MessageCircle,
    User,
    Settings,
    HelpCircle,
} from "lucide-react";
import "./NavBar.css";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
};

const navItems: NavItem[] = [
    {
        label: "Discover",
        icon: <Heart size={34} strokeWidth={2.2} />,
        active: true,
    },
    {
        label: "Profile",
        icon: <User size={34} strokeWidth={2.2} />,
    },
    {
        label: "Preferences",
        icon: <Settings size={34} strokeWidth={2.2} />,
    },
];

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar__items">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={`navbar__item ${item.active ? "active" : ""}`}
                        type="button"
                    >
                        <span className="navbar__icon">{item.icon}</span>
                        <span className="navbar__label">{item.label}</span>
                    </button>
                ))}
            </div>

        </nav>
    );
};

export default NavBar;