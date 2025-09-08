"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "../Header";

export default function HomePage() {
  // Dummy profile data
  const profile = {
    username: "insta_user",
    name: "Jagadeesh Kumar",
    bio: "Full Stack Developer",
    followers: 1200,
    following: 300,
    profilePic: "/profile-pic.jpg",
  };

  // Example posts data
  const posts = [
    {
      id: 1,
      image: "/images/post1.jpg",
      caption: "Experimenting with automated direct messages",
      likes: 120,
      comments: 15,
      instaUrl: "https://instagram.com/p/POST1",
    },
    {
      id: 2,
      image: "/images/post2.jpg",
      caption: "Learning and exploring Next.js concepts",
      likes: 90,
      comments: 10,
      instaUrl: "https://instagram.com/p/POST2",
    },
    {
      id: 3,
      image: "/images/post3.jpg",
      caption: "Documenting the journey of building a new tool",
      likes: 150,
      comments: 20,
      instaUrl: "https://instagram.com/p/POST3",
    },
  ];

  return (
    <>
       <Header />

      {/* Page Wrapper with custom dark theme */}
      <div className="min-h-screen bg-black text-gray-200 p-6">
        
        {/* Profile Section */}
        <div className="p-6 rounded-lg shadow mb-8 flex items-center gap-6"
             style={{ background: "#2b2b2b" }}>
          {/* Profile Picture */}
          <Image
            src={profile.profilePic}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border-2 border-green-400"
          />

          {/* Profile Info */}
          <div>
            <h2 className="text-2xl font-bold">@{profile.username}</h2>
            <p className="text-gray-300">{profile.name}</p>
            <p className="text-gray-400">{profile.bio}</p>
            <div className="flex gap-6 mt-2">
              <span>Followers: {profile.followers}</span>
              <span>Following: {profile.following}</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Posts</h3>
            <Link href="/allposts" className="text-blue-400 hover:underline">
              View All Posts
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/dashboard/${post.id}`}>
                <div
                  className="p-4 rounded-lg shadow hover:scale-105 transition"
                  style={{ background: "#2b2b2b" }}
                >
                  {/* Post Image */}
                  <Image
                    src={post.image}
                    alt={post.caption}
                    width={400}
                    height={300}
                    className="rounded-lg mb-3"
                  />

                  {/* Post Caption */}
                  <p className="mb-2">{post.caption}</p>

                  {/* Post Stats */}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>❤️ {post.likes} Likes</span>
                    <span>💬 {post.comments} Comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
     
    </>
  );
}
