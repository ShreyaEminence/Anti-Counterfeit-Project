"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChangePassword, EditProfile } from "@/components/settings/modals";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="p-6 w-full">
      <div className="flex gap-4 mb-6">
        <Button
          variant={tab === "profile" ? "default" : "outline"}
          onClick={() => setTab("profile")}
        >
          Edit Profile
        </Button>
        <Button
          variant={tab === "password" ? "default" : "outline"}
          onClick={() => setTab("password")}
        >
          Change Password
        </Button>
      </div>

      {tab === "profile" && <EditProfile />}
      {tab === "password" && <ChangePassword />}
    </div>
  );
}
