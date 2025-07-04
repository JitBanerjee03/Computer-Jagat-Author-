import React, { useEffect, createContext, useState } from "react";

export const contextProviderDeclare = createContext({
    setLoggedIn: () => {},
    isloggedIn: Boolean,
    handleSetAuthor: () => {},
    journals: [],
    setJournals: () => {},
    loader: Boolean,
    setAuthor: () => {},
    author: {},
    handleAcceptedJournals: () => {}
});

export const ContextProvider = ({ children }) => {
    const [isloggedIn, setLoggedIn] = useState(false);
    const [author, setAuthor] = useState(null);
    const [journals, setJournals] = useState([]);
    const [loader, setloader] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        // Handle logout via ?logout=true
        if (urlParams.get('logout') === 'true') {
            localStorage.removeItem('jwtToken');
            console.log('Author: Token cleared from localStorage');
            window.close(); // Close the tab after clearing token
            return;
        }

        const urlToken = urlParams.get('token');
        const localToken = localStorage.getItem('jwtToken');

        if (urlToken && !localToken) {
            localStorage.setItem('jwtToken', urlToken);
            console.log('Author: Token stored from URL parameter');
        }

        const token = urlToken || localToken;

        if (!token) {
            console.log('Author: No token found, redirecting to login');
            window.location.href = 'https://journal-management-system-frontend.vercel.app';
            return;
        }

        const validateAndInitialize = async () => {
            try {
                const validationResponse = await fetch(
                    `${import.meta.env.VITE_BACKEND_DJANGO_URL}/sso-auth/validate-token/`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (!validationResponse.ok) throw new Error('Invalid token');

                const userData = await validationResponse.json();

                if (!userData.id) throw new Error('User not authorized for this portal');

                setAuthor(userData);
                setLoggedIn(true);

                const journalsResponse = await fetch(
                    `${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/accepted-journals/`,
                    {
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!journalsResponse.ok) throw new Error('Failed to fetch journals');

                const journalsData = await journalsResponse.json();
                setJournals(journalsData);

            } catch (error) {
                console.error('Author: Initialization error:', error);
                localStorage.removeItem('jwtToken');
                window.location.href = 'https://journal-management-system-frontend.vercel.app';
            } finally {
                setloader(false);
            }
        };

        validateAndInitialize();

        // Clean URL
        if (urlToken) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Cross-tab logout sync
        const storageListener = (e) => {
            if (e.key === 'logout-event') {
                localStorage.removeItem('jwtToken');
                window.location.href = 'https://journal-management-system-frontend.vercel.app';
            }
        };
        window.addEventListener('storage', storageListener);
        return () => window.removeEventListener('storage', storageListener);
    }, []);

    const handleAcceptedJournals = async () => {
        setloader(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/accepted-journals/`,
                {
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch journals');
            const data = await response.json();
            setJournals(data);
        } catch (error) {
            console.error('Error fetching journals:', error);
        } finally {
            setloader(false);
        }
    };

    const handleSetAuthor = (authorObj) => setAuthor(authorObj);

    return (
        <contextProviderDeclare.Provider value={{
            isloggedIn, setLoggedIn, handleSetAuthor,
            journals, setJournals, loader, author, setAuthor,
            handleAcceptedJournals
        }}>
            {children}
        </contextProviderDeclare.Provider>
    );
};