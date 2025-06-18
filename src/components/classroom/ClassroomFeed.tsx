import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Classroom, FeedPost } from "@/types";
import {
  MessageSquare,
  Send,
  Paperclip,
  Calendar,
  AlertCircle,
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  Volume2,
  Plus,
  Pin,
} from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { cn } from "@/lib/utils";

interface ClassroomFeedProps {
  classroom: Classroom;
}

export function ClassroomFeed({ classroom }: ClassroomFeedProps) {
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("New post:", newPostContent);
      setNewPostContent("");
    } catch (error) {
      console.error("Failed to post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "document":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Volume2 className="h-4 w-4" />;
      default:
        return <Paperclip className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const sortedPosts = [...classroom.feedPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-6">
      {/* Create New Post */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-nihongo-crimson-600" />
            <span>Share with the Class</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <Textarea
              placeholder="Share an update, ask a question, or start a discussion..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
                <Button type="button" variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>

              <Button
                type="submit"
                disabled={!newPostContent.trim() || isPosting}
                className="bg-gradient-crimson hover:opacity-90 text-white"
              >
                {isPosting ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Posting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feed Posts */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-nihongo-ink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nihongo-ink-900 mb-2">
                No posts yet
              </h3>
              <p className="text-nihongo-ink-600">
                Be the first to start a conversation!
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <Card
              key={post.id}
              className={cn(
                "border-0 shadow-lg transition-all duration-200 hover:shadow-xl",
                post.isAnnouncement &&
                  "border-l-4 border-l-nihongo-crimson-500 bg-nihongo-crimson-50/30",
                post.isAssignment &&
                  "border-l-4 border-l-nihongo-gold-500 bg-nihongo-gold-50/30",
              )}
            >
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.authorAvatar} />
                    <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-nihongo-ink-900">
                        {post.authorName}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          post.authorRole === "teacher"
                            ? "bg-nihongo-crimson-50 text-nihongo-crimson-700 border-nihongo-crimson-200"
                            : "bg-nihongo-ink-50 text-nihongo-ink-700 border-nihongo-ink-200",
                        )}
                      >
                        {post.authorRole === "teacher" ? "Teacher" : "Student"}
                      </Badge>

                      {post.isAnnouncement && (
                        <Badge className="bg-nihongo-crimson-100 text-nihongo-crimson-800 text-xs">
                          <Pin className="h-3 w-3 mr-1" />
                          Announcement
                        </Badge>
                      )}

                      {post.isAssignment && (
                        <Badge className="bg-nihongo-gold-100 text-nihongo-gold-800 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Assignment
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-nihongo-ink-500">
                      <span>
                        {formatDistanceToNow(parseISO(post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {post.dueDate && (
                        <>
                          <span>•</span>
                          <span className="text-nihongo-gold-600 font-medium">
                            Due:{" "}
                            {format(parseISO(post.dueDate), "MMM d, h:mm a")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-nihongo-ink-700 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Attachments */}
                {post.attachments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h5 className="text-sm font-medium text-nihongo-ink-700 mb-2">
                      Attachments ({post.attachments.length})
                    </h5>
                    <div className="grid gap-2">
                      {post.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-nihongo-ink-50 rounded-lg hover:bg-nihongo-ink-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded border">
                              {getAttachmentIcon(attachment.type)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-nihongo-ink-900">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-nihongo-ink-500">
                                {formatFileSize(attachment.size)}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(attachment.url, "_blank")
                            }
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center space-x-4 pt-3 border-t border-nihongo-ink-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-nihongo-ink-600 hover:text-nihongo-crimson-600"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-nihongo-ink-600 hover:text-nihongo-crimson-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    React
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {sortedPosts.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="w-full">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}
