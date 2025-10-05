// Login Debug Test Script
// Run this in the browser console to test login functionality

async function testLogin(email, password) {
  console.log('Testing login with:', email);
  
  try {
    // Test API endpoint directly
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token);
      console.log('User:', data.user);
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Test with sample credentials
// testLogin('test@example.com', 'password123');

console.log('Login test function ready. Use: testLogin("email@example.com", "password")');
