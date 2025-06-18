import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Download,
  Eye,
  Calendar,
  DollarSign,
  BookOpen,
  Users,
  Search,
  Filter,
} from "lucide-react";

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN-001",
    type: "course_purchase",
    item: "Japanese for Beginners: Hiragana & Katakana",
    amount: 49.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "Credit Card (**** 4242)",
    date: "2024-01-20T10:00:00Z",
    description: "Course purchase - Japanese for Beginners",
    invoice: "INV-2024-001",
  },
  {
    id: "TXN-002",
    type: "classroom_enrollment",
    item: "Morning Conversation Practice",
    amount: 0,
    currency: "USD",
    status: "completed",
    paymentMethod: "Free Enrollment",
    date: "2024-01-15T12:00:00Z",
    description: "Free classroom enrollment",
    invoice: null,
  },
  {
    id: "TXN-003",
    type: "course_purchase",
    item: "JLPT N5 Preparation Course",
    amount: 99.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "PayPal",
    date: "2024-02-01T14:30:00Z",
    description: "Course purchase - JLPT N5 Preparation",
    invoice: "INV-2024-002",
  },
  {
    id: "TXN-004",
    type: "course_purchase",
    item: "Conversational Japanese: Daily Life",
    amount: 79.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "Credit Card (**** 4242)",
    date: "2024-01-25T09:15:00Z",
    description: "Course purchase - Conversational Japanese",
    invoice: "INV-2024-003",
  },
  {
    id: "TXN-005",
    type: "refund",
    item: "Business Japanese: Professional Communication",
    amount: -129.99,
    currency: "USD",
    status: "processed",
    paymentMethod: "Credit Card (**** 4242)",
    date: "2024-02-10T16:45:00Z",
    description: "Refund - Business Japanese course",
    invoice: "REF-2024-001",
  },
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course_purchase":
        return <BookOpen className="h-4 w-4" />;
      case "classroom_enrollment":
        return <Users className="h-4 w-4" />;
      case "refund":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}${amount.toFixed(2)} ${currency}`;
  };

  const getTotalSpent = () => {
    return mockTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getThisMonthSpent = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return mockTransactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          date.getMonth() === thisMonth &&
          date.getFullYear() === thisYear &&
          t.amount > 0
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const TransactionStats = () => (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${getTotalSpent().toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Across {mockTransactions.filter((t) => t.amount > 0).length}{" "}
            purchases
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${getThisMonthSpent().toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { month: "long" })} spending
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockTransactions.length}</div>
          <p className="text-xs text-muted-foreground">Total transactions</p>
        </CardContent>
      </Card>
    </div>
  );

  const TransactionList = () => (
    <div className="space-y-4">
      {filteredTransactions.map((transaction) => (
        <Card key={transaction.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-nihongo-crimson-100 rounded-lg">
                {getTypeIcon(transaction.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{transaction.item}</h3>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                  <span>{transaction.id}</span>
                  <span>{formatDate(transaction.date)}</span>
                  <span>{transaction.paymentMethod}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-semibold ${
                  transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatAmount(transaction.amount, transaction.currency)}
              </div>
              <div className="flex space-x-1 mt-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                {transaction.invoice && (
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Invoice
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nihongo-ink-900">
            Transaction History
          </h1>
          <p className="text-nihongo-ink-600 mt-2">
            View your purchase history and payment details
          </p>
        </div>

        <TransactionStats />

        {/* Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course_purchase">Course Purchase</SelectItem>
                <SelectItem value="classroom_enrollment">
                  Classroom Enrollment
                </SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transaction List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              All ({filteredTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="purchases">
              Purchases (
              {filteredTransactions.filter((t) => t.amount > 0).length})
            </TabsTrigger>
            <TabsTrigger value="refunds">
              Refunds ({filteredTransactions.filter((t) => t.amount < 0).length}
              )
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredTransactions.length > 0 ? (
              <TransactionList />
            ) : (
              <Card className="p-12 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No transactions found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You haven't made any transactions yet"}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="purchases">
            <div className="space-y-4">
              {filteredTransactions
                .filter((t) => t.amount > 0)
                .map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                          {getTypeIcon(transaction.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{transaction.item}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="refunds">
            <div className="space-y-4">
              {filteredTransactions
                .filter((t) => t.amount < 0)
                .map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                          {getTypeIcon(transaction.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{transaction.item}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-red-600">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Transactions;
