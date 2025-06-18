import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PendingTeacherApplication } from "@/types/admin";
import { mockPendingApplications } from "@/data/adminMockData";
import {
  UserCheck,
  UserX,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  GraduationCap,
  Mail,
  Calendar,
  Star,
} from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminTeachers() {
  const [applications, setApplications] = useState<PendingTeacherApplication[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<PendingTeacherApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setApplications(mockPendingApplications);
      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleApprove = async (applicationId: string) => {
    try {
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: "approved" } : app,
        ),
      );
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: "rejected" } : app,
        ),
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const viewApplicationDetails = (application: PendingTeacherApplication) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      default:
        return Clock;
    }
  };

  const pendingCount = applications.filter(
    (app) => app.status === "pending",
  ).length;
  const approvedCount = applications.filter(
    (app) => app.status === "approved",
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "rejected",
  ).length;

  const ApplicationDetailModal = () => {
    if (!selectedApplication) return null;

    return (
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Teacher Application Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Applicant Info */}
            <div className="flex items-start space-x-4 p-4 bg-nihongo-ink-50 rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedApplication.name}`}
                />
                <AvatarFallback>
                  {selectedApplication.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-nihongo-ink-900">
                  {selectedApplication.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-nihongo-ink-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Applied{" "}
                      {formatDistanceToNow(
                        parseISO(selectedApplication.submittedAt),
                        { addSuffix: true },
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(selectedApplication.status)}>
                {selectedApplication.status}
              </Badge>
            </div>

            {/* Experience & Specializations */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Experience</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-nihongo-crimson-600">
                    {selectedApplication.experience} years
                  </p>
                  <p className="text-sm text-nihongo-ink-600">
                    Teaching Experience
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>Specializations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplication.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Submitted Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-nihongo-ink-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-nihongo-ink-500" />
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {selectedApplication.status === "pending" && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedApplication.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(selectedApplication.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-nihongo-ink-900">
                Teacher Applications
              </h1>
              <p className="text-nihongo-ink-600 mt-2">
                Review and manage pending teacher applications
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">
                      Total Applications
                    </p>
                    <p className="text-2xl font-bold text-nihongo-ink-900">
                      {applications.length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-nihongo-ink-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {pendingCount}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {approvedCount}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">
                      {rejectedCount}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                        </div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-nihongo-ink-400 mx-auto mb-4" />
                  <p className="text-nihongo-ink-600">No applications found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => {
                    const StatusIcon = getStatusIcon(application.status);
                    return (
                      <div
                        key={application.id}
                        className="p-6 border border-nihongo-ink-200 rounded-lg hover:border-nihongo-crimson-200 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.name}`}
                              />
                              <AvatarFallback>
                                {application.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-nihongo-ink-900">
                                  {application.name}
                                </h3>
                                <Badge
                                  className={getStatusColor(application.status)}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {application.status}
                                </Badge>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-nihongo-ink-600 mb-3">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{application.email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GraduationCap className="h-3 w-3" />
                                  <span>
                                    {application.experience} years experience
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {format(
                                      parseISO(application.submittedAt),
                                      "MMM d, yyyy",
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1 mb-4">
                                {application.specializations.map((spec) => (
                                  <Badge
                                    key={spec}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {spec}
                                  </Badge>
                                ))}
                              </div>

                              <p className="text-sm text-nihongo-ink-600">
                                {application.documents.length} documents
                                submitted • Applied{" "}
                                {formatDistanceToNow(
                                  parseISO(application.submittedAt),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                viewApplicationDetails(application)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>

                            {application.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(application.id)}
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(application.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <ApplicationDetailModal />
      </div>
    </Layout>
  );
}
