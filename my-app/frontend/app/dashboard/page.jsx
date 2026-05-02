"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Button, LinearProgress, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventIcon from "@mui/icons-material/Event";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/navigation";

const DashboardBox = styled(Box)(({ theme }) => ({
  "& .dashboardBox": {
    padding: "40px 0",
    minHeight: "calc(100vh - 300px)",
  },
  "& .heroSection": {
    background: "#000000",
    color: "#fff",
    padding: "50px 0",
    borderRadius: "0 0 50px 50px",
    marginBottom: "40px",
  },
  "& .statCard": {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    padding: "24px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
    },
  },
}));

export default function Dashboard() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push("/");
      }
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setPopularBooks(data.popularBooks);
        setCategories(data.categoryStats);

        const activities = data.recentBorrowings.map((b) => ({
          id: b._id,
          user: b.user?.name || "Unknown",
          action: "borrowed",
          book: b.book?.title || "Unknown",
          time: new Date(b.createdAt).toLocaleString(),
        }));
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <HomeLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress />
        </Box>
      </HomeLayout>
    );
  }

  const displayStats = stats
    ? [
        {
          title: "Total Books",
          value: stats.totalBooks?.toLocaleString() || "0",
          icon: <LibraryBooksIcon sx={{ fontSize: 40 }} />,
          color: "#000000",
          bgColor: "#f0f0f0",
          trend: "In library",
        },
        {
          title: "Active Members",
          value: stats.totalMembers?.toLocaleString() || "0",
          icon: <PeopleIcon sx={{ fontSize: 40 }} />,
          color: "#333333",
          bgColor: "#e8e8e8",
          trend: "Registered users",
        },
        {
          title: "Books Borrowed",
          value: stats.activeBorrowings?.toLocaleString() || "0",
          icon: <BookIcon sx={{ fontSize: 40 }} />,
          color: "#000000",
          bgColor: "#f0f0f0",
          trend: "Currently active",
        },
        {
          title: "Available Books",
          value: stats.availableBooks?.toLocaleString() || "0",
          icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
          color: "#4CAF50",
          bgColor: "#e8f5e9",
          trend: "Ready to borrow",
        },
      ]
    : [];

  const maxCategoryCount = categories.length > 0 ? Math.max(...categories.map((c) => c.count)) : 1;

  return (
    <HomeLayout>
      <DashboardBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              Welcome to LibriVista Admin
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
              Library Management Dashboard - Monitor and manage all library operations
            </Typography>
          </Container>
        </Box>

        <Box className="dashboardBox">
          <Container maxWidth="lg">
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {displayStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card className="statCard">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: stat.bgColor, width: 56, height: 56, color: stat.color }}>
                            {stat.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ color: "#888" }}>
                              {stat.title}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>
                              {stat.value}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                          {stat.trend}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000" }}>
                            Recent Activity
                          </Typography>
                          <Button size="small" sx={{ textTransform: "none" }}>View All</Button>
                        </Box>

                        {recentActivities.length === 0 ? (
                          <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No recent activity</Typography>
                        ) : (
                          recentActivities.slice(0, 5).map((activity, index) => (
                            <Box key={activity.id || index}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: "#333333", fontSize: "0.875rem" }}>
                                  {activity.user.charAt(0)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2">
                                    <strong>{activity.user}</strong>{" "}
                                    <span style={{ color: "#666" }}>{activity.action}</span>{" "}
                                    <strong style={{ color: "#000000" }}>{activity.book}</strong>
                                  </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: "#999" }}>
                                  {activity.time}
                                </Typography>
                              </Box>
                              {index < recentActivities.length - 1 && <Divider />}
                            </Box>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000" }}>
                            Popular Books
                          </Typography>
                          <Button size="small" sx={{ textTransform: "none" }}>View All</Button>
                        </Box>

                        {popularBooks.length === 0 ? (
                          <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No popular books yet</Typography>
                        ) : (
                          popularBooks.map((book, index) => (
                            <Box key={book._id}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#ccc", minWidth: 24 }}>
                                  {index + 1}
                                </Typography>
                                <Box
                                  component="img"
                                  src={book.coverImage || "/images/footer/book22.png"}
                                  alt={book.title}
                                  sx={{ width: 40, height: 55, objectFit: "contain", borderRadius: "4px" }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {book.title}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#888" }}>
                                    {book.author}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#000000" }}>
                                  {book.borrowCount} borrows
                                </Typography>
                              </Box>
                              {index < popularBooks.length - 1 && <Divider />}
                            </Box>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000", mb: 3 }}>
                          Category Distribution
                        </Typography>

                        {categories.length === 0 ? (
                          <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No category data</Typography>
                        ) : (
                          categories.slice(0, 6).map((cat) => (
                            <Box key={cat._id} sx={{ mb: 2 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{cat._id}</Typography>
                                <Typography variant="body2" sx={{ color: "#888" }}>{cat.count.toLocaleString()} books</Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(cat.count / maxCategoryCount) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: "#f0f0f0",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 4,
                                    bgcolor: "#000000",
                                  },
                                }}
                              />
                            </Box>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000", mb: 3 }}>
                          Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                          {[
                            { icon: <BookIcon />, label: "Add New Book", color: "#000000" },
                            { icon: <PeopleIcon />, label: "Manage Members", color: "#333333" },
                            { icon: <EventIcon />, label: "Create Event", color: "#000000" },
                            { icon: <LocalLibraryIcon />, label: "View Reports", color: "#4CAF50" },
                          ].map((action, index) => (
                            <Grid item xs={6} key={index}>
                              <Button
                                fullWidth
                                variant="outlined"
                                startIcon={action.icon}
                                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                  py: 2,
                                  borderRadius: "12px",
                                  borderColor: action.color,
                                  color: action.color,
                                  textTransform: "none",
                                  justifyContent: "space-between",
                                  "&:hover": {
                                    bgcolor: action.color,
                                    color: "#fff",
                                    borderColor: action.color,
                                  },
                                }}
                              >
                                {action.label}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Container>
        </Box>
      </DashboardBox>
    </HomeLayout>
  );
}
