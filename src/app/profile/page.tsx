import { Suspense } from "react";
import ProfilePage from "@/components/profile/ProfilePage";

export const metadata = {
  title: "My Profile | Talli",
};

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#FAFAFA]" />}>
      <ProfilePage />
    </Suspense>
  );
}
