import { useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import axios from 'axios';
import { FaSignInAlt } from 'react-icons/fa';
import './ButtonStyles.css';

const endpoint = process.env.REACT_APP_TOKENS_ENDPOINT;

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleSignin = useCallback(async () => {
        try {
            const response = await instance.loginPopup(loginRequest);
            console.log(`Response: ${JSON.stringify(response)}`);

            const accessToken = response.accessToken;
            const expiresOn = response.expiresOn.toISOString();
            const email = response.account.username;

            const payload = { accessToken, expiresOn, email };
            const headers = {
                accept: "application/json",
                'Content-Type': 'application/json'
            };

            try {
                const setToken = await axios.post(endpoint, payload, { headers });
                console.log(`Result of setToken: ${setToken.data}`);
            } catch (error) {
                console.log(`An error occurred while setting the token: ${error}`);
            }
        } catch (error) {
            console.log(`An error occurred while signing in: ${error}`);
        }
    }, [instance]);

    return (
        <button onClick={handleSignin} className="auth-button">
            <FaSignInAlt /> Integrate
        </button>
    );
};
