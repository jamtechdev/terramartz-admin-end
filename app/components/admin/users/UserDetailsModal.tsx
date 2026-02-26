import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { Loader } from "./UserList";

export function UserDetailsModal({
    userId,
    onClose,
}: {
    userId: string;
    onClose: () => void;
}) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        fetchUserDetails();
    }, [userId, token]);

    const fetchUserDetails = async () => {
        if (!token) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to fetch user details");
                setLoading(false);
                return;
            }

            setUserData(data.data);
            setLoading(false);
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 py-6">{error}</div>
                ) : userData ? (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                Basic Profiler
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Name:</span>
                                    <p className="text-gray-900">{userData.name || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Email:</span>
                                    <p className="text-gray-900">{userData.email || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Phone Number:</span>
                                    <p className="text-gray-900">{userData.phoneNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Role:</span>
                                    <p className="text-gray-900 capitalize">{userData.role || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <span
                                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ml-2 ${userData.status === "online"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {userData.status || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Account Type:</span>
                                    <p className="text-gray-900 capitalize">{userData.accountType || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Account Verified:</span>
                                    <span
                                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ml-2 ${userData.isAccountVerified
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {userData.isAccountVerified ? "Yes" : "No"}
                                    </span>
                                </div>
                                {userData.loyaltyPoints !== undefined && (
                                    <div>
                                        <span className="font-medium text-gray-700">Loyalty Points:</span>
                                        <p className="text-gray-900 font-bold">{userData.loyaltyPoints}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
