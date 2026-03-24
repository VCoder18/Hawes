import { useState } from "react";
import { useParams } from "react-router";
import { profilePosts } from "@/imports/constants";
import { ProfileCard } from "@/components/Profile/ProfileCard";
import { ProfileTabs } from "@/components/Profile/ProfileTabs";
import { PostsGrid } from "@/components/Profile/PostsGrid";
import { UpcomingTripsCard } from "@/components/Profile/UpcomingTripsCard";
import { FollowersCard } from "@/components/Profile/FollowersCard";
import { RecommendedCard } from "@/components/Profile/RecommendedCard";

export default function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const [showAllPosts, setShowAllPosts] = useState(false);

  // On mobile, show only 4 posts initially, otherwise show all
  const displayedPosts = showAllPosts ? profilePosts : profilePosts.slice(0, 4);

  return (
    <>
      {/* Profile Card */}
      <ProfileCard viewingUsername={username} />

      {/* Tabs */}
      <ProfileTabs />

      {/* Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Posts Grid */}
        <PostsGrid 
          displayedPosts={displayedPosts}
          showAllPosts={showAllPosts}
          setShowAllPosts={setShowAllPosts}
        />

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 lg:space-y-8">
          <UpcomingTripsCard />
          <FollowersCard />
          <RecommendedCard />
        </aside>
      </div>
    </>
  );
}
