import axios from 'axios';

async function testUpdatedCalculation() {
  try {
    console.log('Testing updated badge point calculations...');
    
    // Test with original URL
    console.log('\n1. Testing with original profile URL...');
    const response1 = await axios.post('http://localhost:5001/api/calculate-points', {
      profileUrl: "https://www.cloudskillsboost.google/public_profiles/09f59c76-4837-46e9-b1cd-6d0619e6f2a2"
    });
    
    console.log('Total points:', response1.data.user.points);
    console.log('Badge count:', response1.data.user.badges.length);
    
    // Show sample badges with their point values
    console.log('\nTop 10 badges with points:');
    response1.data.user.badges.slice(0, 10).forEach(badge => {
      console.log(`  ${badge.name}: ${badge.points} points`);
    });
    
    // Test checking available badges directly
    console.log('\n2. Checking some key badge values in database...');
    const badgesResponse = await axios.get('http://localhost:5001/api/available-badges');
    const allBadges = badgesResponse.data.availableBadges;
    
    const keyBadges = [
      'Level 3: The Arcade Quiz',
      'Advanced Conversation Design', 
      'Cloud Architecture: Design, Implement, and Manage',
      'Build and Deploy Machine Learning Solutions on Vertex AI',
      'Digital Transformation with Google Cloud'
    ];
    
    keyBadges.forEach(badgeName => {
      const badge = allBadges.find(b => b.name === badgeName);
      if (badge) {
        console.log(`  ${badgeName}: ${badge.defaultPoints} points in DB`);
      }
    });
    
    // Try to force a fresh calculation by deleting the user first
    console.log('\n3. Attempting fresh calculation...');
    try {
      // Delete the existing user data to force fresh calculation
      await axios.delete(`http://localhost:5001/api/user/${encodeURIComponent("https://www.cloudskillsboost.google/public_profiles/09f59c76-4837-46e9-b1cd-6d0619e6f2a2")}`);
      console.log('User data deleted');
    } catch (deleteError) {
      console.log('No existing user to delete or deletion failed');
    }
    
    // Now recalculate
    const response2 = await axios.post('http://localhost:5001/api/calculate-points', {
      profileUrl: "https://www.cloudskillsboost.google/public_profiles/09f59c76-4837-46e9-b1cd-6d0619e6f2a2"
    });
    
    console.log('\nAfter fresh calculation:');
    console.log('Total points:', response2.data.user.points);
    console.log('Badge count:', response2.data.user.badges.length);
    
    console.log('\nTop 10 badges with updated points:');
    response2.data.user.badges.slice(0, 10).forEach(badge => {
      console.log(`  ${badge.name}: ${badge.points} points`);
    });
    
    // Calculate expected vs actual
    const highValueBadges = response2.data.user.badges.filter(b => b.points >= 3);
    const mediumValueBadges = response2.data.user.badges.filter(b => b.points >= 2 && b.points < 3);
    const lowValueBadges = response2.data.user.badges.filter(b => b.points < 2);
    
    console.log('\nBadge distribution:');
    console.log(`  High value (3+ points): ${highValueBadges.length} badges`);
    console.log(`  Medium value (2+ points): ${mediumValueBadges.length} badges`);
    console.log(`  Low value (<2 points): ${lowValueBadges.length} badges`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testUpdatedCalculation();