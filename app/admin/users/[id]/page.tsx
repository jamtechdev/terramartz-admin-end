/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import UserForm from "@/app/components/admin/users/UserForm";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const userId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!userId) return;

    // Dummy fetch for now
    const dummyUser: User = {
      id: userId,
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      status: "Active",
    };

    setUser(dummyUser);
  }, [params?.id]);

  if (!user) return <p>Loading...</p>;

  const handleSave = () => {
    // Here you would call your API to save the user
    toast.success(`User ${user.name} updated successfully`);
    router.push("/admin/users");
  };

  return (
    <UserForm
      user={user}
      onChange={(updatedUser: User) => setUser(updatedUser)}
      onSave={handleSave}
      title="Edit User"
    />
  );
}
