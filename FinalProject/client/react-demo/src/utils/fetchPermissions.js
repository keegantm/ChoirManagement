// utils/authUtils.js
import { jwtDecode } from "jwt-decode";
/**
 * Fetch user permissions from the backend.
 * @param {string} token - JWT token from session storage.
 * @param {function} router - Next.js router for navigation.
 * @returns {object|null} - Permissions object or null if there was an error.
 */
export const fetchPermissions = async (token, router) => {
    try {
        if (token && token !== "" && token !== undefined) {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);

            const permissionsResponse = await fetch("http://localhost:8080/permissions", {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
            });

            if (!permissionsResponse.ok) {
                console.log("Error getting user permissions");
                return null; // Return null or a default permissions object
            }

            const data = await permissionsResponse.json();
            console.log("Permissions fetched:", data.permissions);

            return {
                canEditMusicalRoles: data.permissions.canEditMusicalRoles || false,
                canEditBoardRoles: data.permissions.canEditBoardRoles || false,
                canAddMembers: data.permissions.canAddMembers || false,
                canChangeActiveStatus: data.permissions.canChangeActiveStatus || false,
                isAttendanceManager: data.permissions.isAttendanceManager || false,
                canViewFinancialData: data.permissions.canViewFinancialData || false,
            };
        } else {
            // User not logged in, send to login screen
            router.push('/login');
            return null;
        }
    } catch (error) {
        console.error("Error retrieving permissions:", error);
        return null;
    }
};
