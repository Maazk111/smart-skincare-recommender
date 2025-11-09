import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Spa as SpaIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecommendations: 0,
    recentUsers: [],
    recentRecommendations: [],
    activeUsers: 0,
  });
  const [users, setUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersResponse, recommendationsResponse] = await Promise.all([
        axios.get('/users/admin/all-users'),
        axios.get('/users/admin/all-recommendations'),
      ]);

      const usersData = usersResponse.data.users || [];
      const recommendationsData = recommendationsResponse.data.recommendations || [];

      setUsers(usersData);
      setRecommendations(recommendationsData);
      
      const activeUsers = usersData.filter(user => 
        new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;

      setStats({
        totalUsers: usersData.length,
        totalRecommendations: recommendationsData.length,
        recentUsers: usersData.slice(0, 5),
        recentRecommendations: recommendationsData.slice(0, 5),
        activeUsers,
      });
      setError('');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete || !deleteType) return;

    try {
      if (deleteType === 'user') {
        await axios.delete(`/users/admin/delete-user/${itemToDelete.id}`);
        setUsers(users.filter(user => user.id !== itemToDelete.id));
      } else if (deleteType === 'recommendation') {
        await axios.delete(`/users/admin/delete-recommendation/${itemToDelete.id}`);
        setRecommendations(recommendations.filter(rec => rec.id !== itemToDelete.id));
      }
      
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteType('');
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    }
  };

  const openDeleteDialog = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };

  const getRoleColor = (role) => {
    return role === 'ADMIN' ? 'error' : 'primary';
  };

  const getSkinTypeColor = (skinType) => {
    const colors = {
      'Dry': 'error',
      'Oily': 'warning',
      'Combination': 'info',
      'Simple': 'success',
    };
    return colors[skinType] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecommendations = recommendations.filter(rec =>
    rec.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.skinType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.skinConcern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading admin data...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper
        elevation={8}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #d63031 0%, #e17055 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AdminIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Admin Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Manage users and monitor system activity
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
              Welcome, {user?.name}! Here's your system overview.
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Refresh Data">
              <IconButton onClick={fetchAdminData} sx={{ color: 'white' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <PeopleIcon sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body1">
                Total Users
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ mt: 2, backgroundColor: 'rgba(255,255,255,0.3)' }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <SpaIcon sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.totalRecommendations}
              </Typography>
              <Typography variant="body1">
                Total Recommendations
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={60} 
                sx={{ mt: 2, backgroundColor: 'rgba(255,255,255,0.3)' }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.activeUsers}
              </Typography>
              <Typography variant="body1">
                Active Users (30d)
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={90} 
                sx={{ mt: 2, backgroundColor: 'rgba(255,255,255,0.3)' }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {Math.round((stats.totalRecommendations / Math.max(stats.totalUsers, 1)) * 10) / 10}
              </Typography>
              <Typography variant="body1">
                Avg Recommendations
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ mt: 2, backgroundColor: 'rgba(255,255,255,0.3)' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users, recommendations, or any data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Users (${filteredUsers.length})`} />
          <Tab label={`Recommendations (${filteredRecommendations.length})`} />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredUsers.length} users found
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Recommendations</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const userRecommendations = recommendations.filter(rec => rec.userId === user.id);
                    return (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {user.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ID: {user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(user.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={userRecommendations.length} 
                            color="secondary" 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                color="primary"
                                onClick={() => openUserDetails(user)}
                                size="small"
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {user.role !== 'ADMIN' && (
                              <Tooltip title="Delete User">
                                <IconButton
                                  color="error"
                                  onClick={() => openDeleteDialog(user, 'user')}
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recommendation Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredRecommendations.length} recommendations found
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Skin Profile</TableCell>
                    <TableCell>Concern</TableCell>
                    <TableCell>Sensitivity</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecommendations.map((rec) => (
                    <TableRow key={rec.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            {rec.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {rec.user?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {rec.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={rec.skinType}
                            color={getSkinTypeColor(rec.skinType)}
                            size="small"
                          />
                          <Typography variant="body2">
                            {rec.gender} • {rec.ageRange}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {rec.skinConcern}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {rec.skinSensitivity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(rec.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete Recommendation">
                          <IconButton
                            color="error"
                            onClick={() => openDeleteDialog(rec, 'recommendation')}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Recent Users
                </Typography>
                <List>
                  {stats.recentUsers.map((user, index) => (
                    <React.Fragment key={user.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.name}
                          secondary={`${user.email} • Joined ${formatDate(user.createdAt)}`}
                        />
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </ListItem>
                      {index < stats.recentUsers.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Recent Recommendations
                </Typography>
                <List>
                  {stats.recentRecommendations.map((rec, index) => (
                    <React.Fragment key={rec.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <SpaIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${rec.skinType} - ${rec.skinConcern}`}
                          secondary={`${rec.user?.name} • ${formatDate(rec.createdAt)}`}
                        />
                        <Chip
                          label={rec.skinType}
                          color={getSkinTypeColor(rec.skinType)}
                          size="small"
                        />
                      </ListItem>
                      {index < stats.recentRecommendations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

    
      <Dialog open={userDetailsOpen} onClose={() => setUserDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {selectedUser?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedUser?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                <Typography variant="body1">{selectedUser.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                <Chip label={selectedUser.role} color={getRoleColor(selectedUser.role)} size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Joined</Typography>
                <Typography variant="body1">{formatDate(selectedUser.createdAt)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Total Recommendations</Typography>
                <Typography variant="body1">
                  {recommendations.filter(rec => rec.userId === selectedUser.id).length}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType}? This action cannot be undone.
          </Typography>
          {itemToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              {deleteType === 'user' ? (
                <Typography>
                  <strong>User:</strong> {itemToDelete.name} ({itemToDelete.email})
                </Typography>
              ) : (
                <Typography>
                  <strong>Recommendation:</strong> {itemToDelete.skinType} skin - {itemToDelete.skinConcern}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
