const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin1218' // From server.js initialization
    });
    const token = loginRes.data.data.token;

    console.log('Got token');

    const res = await axios.post('http://localhost:5000/api/auth/admin/users', {
      name: 'Rohit Sharma',
      email: 'rohit@gmail.com',
      role: 'teamlead',
      department: 'Marketing'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error:', err.response?.data || err.message);
  }
}
test();
