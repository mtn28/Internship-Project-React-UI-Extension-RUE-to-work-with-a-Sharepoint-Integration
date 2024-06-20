import React from "react";
import { useMsal } from "@azure/msal-react";
import { FaSignOutAlt } from 'react-icons/fa';
import './ButtonStyles.css';

export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/",
        });
    };

    return (
        <button onClick={() => handleLogout()} className="auth-button">
            <FaSignOutAlt /> Disintegrate
        </button>
    );
};
