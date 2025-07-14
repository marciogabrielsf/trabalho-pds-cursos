"use client";
import React, { useState } from "react";
import ClassroomPost from "./ClassroomPost";
import ActivitiesSidebar from "./ActivitiesSidebar";
import {
    mockPosts,
    mockActivities,
    ClassroomPost as ClassroomPostType,
    Activity,
} from "./classroomTypes";

interface ClassroomProps {
    courseTitle: string;
    instructor: string;
}

const Classroom: React.FC<ClassroomProps> = ({ courseTitle, instructor }) => {
    const [posts, setPosts] = useState<ClassroomPostType[]>(mockPosts);
    const [activities] = useState<Activity[]>(mockActivities);

    // Mock current user name - in a real app, this would come from auth context
    const currentUserName = "Você";

    // TODO: Use courseTitle and instructor props for displaying course information
    console.log("Course:", courseTitle, "Instructor:", instructor);

    const handleActivityClick = (activityId: string) => {
        console.log("Activity clicked:", activityId);
        // TODO: Navigate to activity detail or open modal
    };

    const handleAddComment = (postId: string, commentContent: string) => {
        const newComment = {
            id: `comment-${Date.now()}`,
            author: currentUserName,
            content: commentContent,
            date: new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
            }),
        };

        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? {
                          ...post,
                          comments: [...(post.comments || []), newComment],
                      }
                    : post
            )
        );
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto p-6 space-y-6">
                {/* Posts */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <ClassroomPost
                            key={post.id}
                            post={post}
                            onAddComment={handleAddComment}
                            currentUserName={currentUserName}
                        />
                    ))}
                </div>
            </div>

            {/* Right Sidebar - Activities */}
            <ActivitiesSidebar activities={activities} onActivityClick={handleActivityClick} />
        </div>
    );
};

export default Classroom;
