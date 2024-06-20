import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import './PageLayout.css';

export const PageLayout = () => {
    const isAuthenticated = useIsAuthenticated();

    const handleImageClick = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="main-container">
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Card className="auth-card">
                    <Card.Header className="auth-card-header">
                        <img
                            width="150"
                            height="50"
                            src="https://findmore.solutions/wp-content/uploads/2020/11/Logo-Findmore-Solutions.svg"
                            className="d-inline-block align-top mx-4"
                            alt="Findmore Solutions"
                            onClick={() => handleImageClick('https://findmore.solutions')}
                            style={{ cursor: 'pointer' }}
                        />
                        <img
                            width="55"
                            height="50"
                            src="https://seeklogo.com/images/H/hubspot-logo-39CE90861B-seeklogo.com.png"
                            className="d-inline-block align-top mx-2"
                            alt="HubSpot"
                            onClick={() => handleImageClick('https://hubspot.com')}
                            style={{ cursor: 'pointer' }}
                        />
                        <img
                            width="100"
                            height="70"
                            src="https://www.logo.wine/a/logo/SharePoint/SharePoint-Logo.wine.svg"
                            className="d-inline-block align-top"
                            alt="SharePoint"
                            onClick={() => handleImageClick('https://sharepoint.com')}
                            style={{ cursor: 'pointer' }}
                        />
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Card.Title className="text-center" style={{ fontSize: '1.65rem', fontWeight: 'bold' }}>
                            {isAuthenticated ? "Successful Integration" : "Access SharePoint through HubSpot"}
                        </Card.Title>
                        <Card.Text className="text-center" style={{ fontSize: '1.1rem', color: '#555' }} dangerouslySetInnerHTML={{
                            __html: isAuthenticated
                                ? "Account Integrated with SharePoint"
                                : "By clicking the <strong>Integrate</strong> button, you will be redirected to the Microsoft Sign-In page.<br/><br/>There you should <strong>Sign In</strong> to integrate your HubSpot account with SharePoint"
                        }}>
                        </Card.Text>

                        {isAuthenticated && (
                            <Card.Text className="text-center" style={{ fontSize: '1.1rem', color: '#555' }} dangerouslySetInnerHTML={{ __html: "By clicking the <strong>Disintegrate</strong> button, your HubSpot account will no longer be integrated with SharePoint." }}>
                            </Card.Text>
                        )}
                        <div className="d-flex justify-content-center mt-4">
                            {isAuthenticated ? <SignOutButton className="btn btn-danger px-4" /> : <SignInButton className="btn btn-success px-4" />}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};
