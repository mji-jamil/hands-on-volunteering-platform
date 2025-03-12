import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const CommentSection = ({ eventId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            const response = await axios.get(
                `http://localhost:5000/api/events/${eventId}/comments`,
            );
            console.log(response);
            setComments(response.data);
        };
        fetchComments();
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:5000/api/events/${eventId}/comments`,
                { content: newComment },
                {
                    withCredentials: true,

                }
            );

            setComments([response.data, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Comment post error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Failed to post comment");
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
                Comments ({comments?.length})
            </h3>

            {user && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-2 border rounded mb-2"
                        rows="3"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Post Comment
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment._id} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">
                                {comment?.user?.name}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {new Date(
                                    comment.createdAt,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;