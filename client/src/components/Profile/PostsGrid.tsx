import { MapPin, Play } from "lucide-react";
import svgPaths from "@/imports/svg_paths";
import type { ProfilePost } from "@/imports/types";

interface PostsGridProps {
  displayedPosts: ProfilePost[];
  showAllPosts: boolean;
  setShowAllPosts: (show: boolean) => void;
}

export function PostsGrid({ displayedPosts, showAllPosts, setShowAllPosts }: PostsGridProps) {
  return (
    <div className="flex-1">
      {/* Collapse Button - Mobile Only */}
      {showAllPosts && (
        <button
          onClick={() => setShowAllPosts(false)}
          className="sm:hidden flex items-center justify-center gap-2 w-full mb-4 py-3 bg-white border border-[#e2e8f0] rounded-lg text-text-[#00b70d] font-medium text-sm hover:bg-bg-[#ff5900] transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          Collapse
        </button>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedPosts.map((post, index) => (
          <div key={index} className="group relative aspect-square bg-[#e2e8f0] rounded-lg overflow-hidden cursor-pointer">
            <img src={post.img} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5">
              <MapPin className="size-3 text-white flex-shrink-0" />
              <span className="text-white text-xs font-medium">{post.views}</span>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full size-8 flex items-center justify-center">
              {post.icon === "p1bc83290" ? (
                <Play className="size-4 text-white" />
              ) : (
                <MapPin className="size-4 text-white" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
              <div className="flex items-center gap-1">
                <svg className="size-5" fill="none" viewBox="0 0 20 18.35">
                  <path d={svgPaths.p279a9400} fill="white" />
                </svg>
                <span className="text-white font-bold">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p1fe7b600} fill="white" />
                </svg>
                <span className="text-white font-bold">{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button - Mobile Only */}
      {!showAllPosts && (
        <button
          onClick={() => setShowAllPosts(true)}
          className="sm:hidden w-full mt-4 py-3 bg-[#00b70d] text-white font-bold text-sm rounded-lg hover:bg-[#00b70d]-hover transition-colors"
        >
          View All Posts
        </button>
      )}
    </div>
  );
}


