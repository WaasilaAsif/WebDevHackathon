<<<<<<< HEAD
import React from "react";
import Home from "./Components/Homepage/Home.jsx";
import { Login } from "../Auth/Login.jsx";
import UpdateProfile from "./Components/Dashboard/UpdateProfile.jsx";
import { UpdateProduct } from "./Components/Dashboard/UpdateProduct.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BuyerLayout from "./Components/Homepage/BuyerLayout.jsx"; // Add this
import AddCategoryForm from  "./Components/Dashboard/AddCategoyForm.jsx"
import  UpdateProductForm  from "./Components/Dashboard/UpdateProductForm.jsx";
import ProductDetail from "./Components/ProductDetail/ProductDetail.jsx";
import { BuyerDashboard } from "./Components/Dashboard/buyerDashboard.jsx";
import { Content } from "./Components/Dashboard/Content.jsx";
import { Products } from "./Components/Dashboard/Products.jsx";
import { Sales } from "./Components/Dashboard/Sales.jsx";
import { AddProducts } from "./Components/Dashboard/AddProducts.jsx";
import { AddProductForm } from "./Components/Dashboard/AddProductForm.jsx";
import SearchResults from "./Components/Search/SearchResults.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import BuyerUpdateProfile from "./Components/Profile/BuyerUpdateProfile.jsx";
import Chat from "./Components/Dashboard/Chat.jsx";
import BuyerChatPage from "./Components/Chat/BuyerChatPage.jsx";
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
function App() {
  //const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/auth/admin" element={<AdminDashboard />} >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        </Route>


        {/* Buyer routes with layout */}


        <Route element={<BuyerLayout />}>
          {/*}<Route path="/" element={<Home />} />{*/}
          <Route path="/home" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile/update" element={<BuyerUpdateProfile />} />
          <Route path="/chat" element={<BuyerChatPage />} />
          <Route path="/chat/:chatId" element={<BuyerChatPage />} />
          <Route path="/chat/product/:productId" element={<BuyerChatPage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        
        {/* Seller dashboard routes (without buyer layout) */}
        <Route path="/auth/seller" element={<BuyerDashboard />}>
          <Route index element={<Content />} />
          <Route path="home" element={<Content />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="update-product" element={<UpdateProduct />} />
          <Route path="update-product/:id" element={<UpdateProductForm />} />
          <Route path="add-category" element={<AddCategoryForm />} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="sales" element={<Sales />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
/*
import React from "react";
import Home from "./Components/Homepage/Home.jsx";
import { Login } from "../Auth/Login.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductDetail from "./Components/ProductDetail/ProductDetail.jsx";
import { BuyerDashboard } from "./Components/Dashboard/buyerDashboard.jsx";
import { Content } from "./Components/Dashboard/Content.jsx";
import { Products } from "./Components/Dashboard/Products.jsx";
import { Sales } from "./Components/Dashboard/Sales.jsx";
import { AddProductForm } from "./Components/Dashboard/AddProductForm.jsx";
import ProtectedRoute from "./ProtectedRoutes.jsx"; // import the wrapper

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={token ? <Navigate to={role === "seller" ? "/auth/seller" : "/"} /> : <Home />}
        />

      
        <Route
          path="/login"
          element={role ? <Navigate to={role === "seller" ? "/auth/seller" : "/"} /> : <Login />}
        />

        
        <Route path="/product/:id" element={<ProductDetail />} />

      
        <Route
          path="/auth/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Content />} />
          <Route path="home" element={<Content />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="sales" element={<Sales />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

*/
=======
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Layout
import AppShell from './components/layout/AppShell';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Onboarding from './pages/Auth/Onboarding';

// Main Pages
import Main from './pages/home/Main';
import UploadResume from './pages/resume/UploadResume';
import ResumeResult from './pages/resume/ResumeResult';
import InterviewInput from './pages/interview/InterviewInput';
import InterviewResult from './pages/interview/InterviewResult';
import History from './pages/history/History';

// Loading Spinner Component (no Tailwind needed)
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

// Onboarding Route (only for users who haven't completed onboarding)
const OnboardingRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.profileComplete) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            } 
          />

          {/* Protected Routes - Wrapped in AppShell */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Main />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-upload"
            element={
              <ProtectedRoute>
                <AppShell>
                  <UploadResume />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-result/:analysisId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ResumeResult />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <AppShell>
                  <InterviewInput />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-result/:prepId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <InterviewResult />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppShell>
                  <History />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
>>>>>>> origin/waasila-branch
