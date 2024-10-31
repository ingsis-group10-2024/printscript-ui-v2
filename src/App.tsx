import './App.css';
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import RulesScreen from "./screens/Rules.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { withAuthenticationRequired } from "@auth0/auth0-react";

// Protect individual components with Auth0
const ProtectedHomeScreen = withAuthenticationRequired(HomeScreen);
const ProtectedRulesScreen = withAuthenticationRequired(RulesScreen);

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedHomeScreen />  // Ensures the home route redirects to login if not authenticated
    },
    {
        path: '/rules',
        element: <ProtectedRulesScreen />  // Protects the rules route as well
    }
]);

export const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

export default App;
