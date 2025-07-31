import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing API endpoint...');
    
    const response = await axios.post('http://localhost:5001/api/calculate-points', {
      profileUrl: "https://www.cloudskillsboost.google/public_profiles/09f59c76-4837-46e9-b1cd-6d0619e6f2a2"
    }, {
      timeout: 60000, // 60 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error details:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    if (error.request) {
      console.error('Request made but no response received');
    }
  }
}

testAPI();