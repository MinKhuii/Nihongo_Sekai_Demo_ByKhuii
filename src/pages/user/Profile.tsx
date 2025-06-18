import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, MapPin, Edit, Camera } from "lucide-react";

export default function Profile() {
  const user = {
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka",
    role: "Learner",
    joinDate: "January 15, 2024",
    location: "Tokyo, Japan",
    level: "Intermediate",
    interests: [
      "Business Japanese",
      "Conversational Practice",
      "Cultural Studies",
    ],
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-gradient-crimson text-white text-2xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-nihongo-crimson-600 hover:bg-nihongo-crimson-700 p-0"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl lg:text-3xl font-heading font-bold text-nihongo-ink-900">
                        {user.name}
                      </h1>
                      <Badge className="bg-nihongo-sakura-100 text-nihongo-sakura-800">
                        {user.role}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-nihongo-ink-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {user.joinDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className="bg-nihongo-gold-100 text-nihongo-gold-800">
                        {user.level} Level
                      </Badge>
                    </div>
                  </div>

                  <Button className="bg-gradient-crimson hover:opacity-90 text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-nihongo-ink-700">
                      Full Name
                    </label>
                    <p className="text-nihongo-ink-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-nihongo-ink-700">
                      Email
                    </label>
                    <p className="text-nihongo-ink-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-nihongo-ink-700">
                      Location
                    </label>
                    <p className="text-nihongo-ink-900">{user.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-nihongo-ink-700">
                      Member Since
                    </label>
                    <p className="text-nihongo-ink-900">{user.joinDate}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Learning Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-nihongo-ink-700">
                      Current Level
                    </label>
                    <p className="text-nihongo-ink-900">{user.level}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-nihongo-ink-700">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
