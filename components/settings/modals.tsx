import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import api from "@/_lib/api";

export function EditProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const obj = JSON.parse(user);
      setName(obj.name);
      setPhone(obj.phone);
      setEmail(obj.email);
    }
  }, []);
  const saveProfile = async () => {
    try {
      setLoading(true);
      await api.put("/user/profile", { name, phone });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200"></div>
        <Button variant="outline">Upload Image</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Input
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input placeholder="Email" value={email} disabled />
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium">Product NFT</span>
        <Switch />
      </div>

      <Button onClick={saveProfile} disabled={loading}>
        {loading ? "Saving..." : "Save Details"}
      </Button>
    </div>
  );
}

export function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    if (newPass !== confirmPass) return alert("Passwords do not match");

    try {
      setLoading(true);
      await api.put("/user/change-password", {
        oldPassword: oldPass,
        newPassword: newPass,
      });
      alert("Password updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Input
          placeholder="Enter Old Password"
          type="password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <div></div>
        <Input
          placeholder="Enter New Password"
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <Input
          placeholder="Confirm New Password"
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />
      </div>

      <Button onClick={changePassword} disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </Button>
    </div>
  );
}
