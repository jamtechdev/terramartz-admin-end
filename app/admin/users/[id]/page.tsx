/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import UserForm from "@/app/components/admin/users/UserForm";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams(); // <-- Use this in client component
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    // Fetch user data (dummy for now)
    const dummyUser = {
      id: params.id,
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      status: "Active",
    };
    setUser(dummyUser);
  }, [params?.id]);

  if (!user) return <p>Loading...</p>;

  const handleSave = () => {
    alert(`User ${user.name} updated!`);
    router.push("/admin/users");
  };

  return (
    <UserForm
      user={user}
      onChange={setUser}
      onSave={handleSave}
      title="Edit User"
    />
  );
}
