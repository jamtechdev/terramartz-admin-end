import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { Loader } from "./UserList";

export function SellerDetailsModal({
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
          <h2 className="text-xl font-bold text-gray-900">Seller Details</h2>
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
            Seller Profile Section
            {userData.sellerProfile && userData.sellerProfile.shopName && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Shop Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Shop ID:</span>
                    <p className="text-gray-900 font-mono text-xs">{userData.sellerProfile.shopId || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Shop Name:</span>
                    <p className="text-gray-900">{userData.sellerProfile.shopName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Shop Slug:</span>
                    <p className="text-gray-900 font-mono text-xs">{userData.sellerProfile.shopSlug || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Shop Picture:</span>
                    {userData.sellerProfile.shopPicture ? (
                      <img
                        src={userData.sellerProfile.shopPicture}
                        alt="Shop Picture"
                        className="h-16 w-16 object-cover rounded-md mt-1"
                      />
                    ) : (
                      <p className="text-gray-500">N/A</p>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Shipping Charges:</span>
                    <p className="text-gray-900">${userData.sellerProfile.shippingCharges || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Free Shipping Threshold:</span>
                    <p className="text-gray-900">${userData.sellerProfile.freeShippingThreshold || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">KYC Status:</span>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        userData.sellerProfile.kycStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : userData.sellerProfile.kycStatus === "submitted"
                          ? "bg-yellow-100 text-yellow-700"
                          : userData.sellerProfile.kycStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {userData.sellerProfile.kycStatus || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">KYC ID:</span>
                    <p className="text-gray-900 font-mono text-xs">{userData.sellerProfile.kycId || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Is Verified:</span>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        userData.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {userData.isVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            Business Details Section
            {userData.businessDetails && userData.businessDetails.businessName && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Business Name:</span>
                    <p className="text-gray-900">{userData.businessDetails.businessName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Business Location:</span>
                    <p className="text-gray-900">{userData.businessDetails.businessLocation || "N/A"}</p>
                  </div>
                  {userData.businessDetails.city && (
                    <div>
                      <span className="font-medium text-gray-700">City:</span>
                      <p className="text-gray-900">{userData.businessDetails.city}</p>
                    </div>
                  )}
                  {userData.businessDetails.state && (
                    <div>
                      <span className="font-medium text-gray-700">State:</span>
                      <p className="text-gray-900">{userData.businessDetails.state}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Country:</span>
                    <p className="text-gray-900">{userData.businessDetails.country || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}

            Stripe Account Section
            {userData.sellerProfile && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Stripe Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Stripe Account ID:</span>
                    <p className="text-gray-900 font-mono text-xs">
                      {userData.sellerProfile.stripeAccountId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Stripe Account Status:</span>
                    <p className="text-gray-900">
                      {userData.sellerProfile.stripeAccountStatus || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Stripe Account Type:</span>
                    <p className="text-gray-900">
                      {userData.sellerProfile.stripeAccountType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Stripe Onboarding Complete:</span>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        userData.sellerProfile.stripeOnboardingComplete
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {userData.sellerProfile.stripeOnboardingComplete ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!userData.sellerProfile?.shopName && !userData.businessDetails?.businessName && (
              <div className="text-center py-6 text-gray-500">
                No seller details available
              </div>
            )}

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