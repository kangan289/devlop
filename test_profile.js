import axios from 'axios';

const profileUrl = "https://www.cloudskillsboost.google/public_profiles/09f59c76-4837-46e9-b1cd-6d0619e6f2a2";

async function testProfileAccess() {
  try {
    console.log('Testing profile access...');
    
    const response = await axios.get(profileUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('HTML length:', response.data.length);
    
    // Test badge regex
    const html = response.data;
    const badgeNameRegex = /<span class=['"]ql-title-medium l-mts['"][^>]*>\s*([^<]+)\s*<\/span>/g;
    
    let match;
    let count = 0;
    const badges = [];
    
    while ((match = badgeNameRegex.exec(html)) !== null && count < 20) {
      count++;
      const badgeName = match[1].trim();
      
      if (badgeName && 
          badgeName.length > 3 && 
          !badgeName.toLowerCase().includes('points') &&
          !badgeName.toLowerCase().includes('earned')) {
        badges.push(badgeName);
        console.log(`Badge ${count}: "${badgeName}"`);
      }
    }
    
    console.log(`Total badges found: ${badges.length}`);
    
    // Test API call
    console.log('\nTesting API call...');
    const apiResponse = await axios.post('http://localhost:5001/api/calculate-points', {
      profileUrl: profileUrl
    }, {
      timeout: 30000
    });
    
    console.log('API Response:', apiResponse.data);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testProfileAccess();