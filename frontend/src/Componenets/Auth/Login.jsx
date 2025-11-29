import './styles/Login.css'
import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  //add google maps location here in setting the city
  //const [location, setLocation] = useState(null);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: ''
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      
      if (response.data.success) {
        try {
          //Checking local storage
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.user.role);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
        } catch (error) {
          console.error('Error saving to local storage:', error);
        }
        alert('Login successful!');
        console.log('User:', response.data.user);
        console.log (localStorage.getItem('token'));
        console.log (localStorage.getItem('user'));
        console.log (localStorage.getItem('userRole'));

        if (localStorage.getItem('userRole') === 'seller') {
          window.location.href = '/auth/seller/home';
        }
        else if (localStorage.getItem('userRole') === 'admin') {
          window.location.href = '/auth/admin/dashboard';
        }        
        else {
          window.location.href = '/home';
        }

      }
      
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
  setLoading(true);

  try {
    const data = new FormData();
    data.append('name', registerData.name);
    data.append('email', registerData.email);
    data.append('password', registerData.password);
    data.append('phone', registerData.phone);
    data.append('city', registerData.city);
    data.append('role', registerData.role);

    if (avatarFile) {
      data.append('avatar', avatarFile); // must match multer field name exactly
    }

    const response = await axios.post('http://localhost:5000/api/auth/signup', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });   
      if (response.data.success) {
        alert('Registration successful!');
        console.log('User:', response.data.user);
        // Switch to login mode or redirect
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="s-container">
      <div className={`box ${isLogin ? 'login-mode' : 'register-mode'}`}>
        <div className="toggle-box">
          <div className="toggle-content">
            {!isLogin ? (
              <div className="toggle-text">
                <h3>Already have an account?</h3>
                <p>Sign in to access your account</p>
                <button className="toggle-btn" onClick={toggleMode}>
                  Sign In
                </button>
              </div>
            ) : (
              <div className="toggle-text">
                <h3>New here?</h3>
                <p>Create an account to get started</p>
                <button className="toggle-btn" onClick={toggleMode}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-container">
          {/* Registration Form */}
          <div className={`register ${!isLogin ? 'active' : 'inactive'}`}>
            <h2 className="rhead">Registration</h2>
            <form id= "reg" onSubmit={handleRegister}>
              <input 
                className="rinfo" 
                type="text" 
                name="name"
                placeholder="Username" 
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
              <input 
                className="rinfo" 
                type="email" 
                name="email"
                placeholder="Email" 
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <input 
                className="rinfo" 
                type="password" 
                name="password"
                placeholder="Password" 
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
              <input 
                className="rinfo" 
                type="tel" 
                name="phone"
                placeholder="Phone" 
                value={registerData.phone}
                onChange={handleRegisterChange}
                required
              />
              <input 
                className="rinfo" 
                type="text" 
                name="city"
                placeholder="City" 
                value={registerData.city}
                onChange={handleRegisterChange}
                required
              />
              <input 
                className="rinfo" 
                type="file" 
                name="avatar"
                id= "ava"
                placeholder="Avatar (optional)" 
                onChange={(e) => setAvatarFile(e.target.files[0])} 
              />
             <select
  className="rinfo"
  id="role"
  name="role"
  required
  value={registerData.role}
  onChange={handleRegisterChange}
>
  <option value="" disabled hidden>Select role</option>
  <option value="buyer">Buyer</option>
  <option value="seller">Seller</option>
</select>
              <button 
                className="btn" 
                id="regbtn" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>

          {/* Login Form */}
          <div className={`login ${isLogin ? 'active' : 'inactive'}`}>
            <h2 className="head">Login</h2>
            <form id="log" onSubmit={handleLogin}>
              <input 
                className="info" 
                type="email" 
                name="email"
                placeholder="Email" 
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <input 
                className="info" 
                type="password" 
                name="password"
                placeholder="Password" 
                value={loginData.password}
                onChange={handleLoginChange}
                required
              /><br/>
              <a href="#" className="frgt">Forgot password?</a><br/>
              <button 
                className="btn" 
                id="logbtn" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="ad-info">or sign in with social platforms</p>
          </div>
        </div>
      </div>
    </div>
  );
};