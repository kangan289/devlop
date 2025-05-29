import axios from 'axios';

const badgePointsMap = {
  // High-value skill badges (complex topics)
  'Cloud Architecture: Design, Implement, and Manage': 5,
  'Build and Deploy Machine Learning Solutions on Vertex AI': 4,
  'Implement DevOps Workflows in Google Cloud': 4,
  'Deploy Kubernetes Applications on Google Cloud': 4,
  'Manage Kubernetes in Google Cloud': 4,
  'Build Infrastructure with Terraform on Google Cloud': 4,
  'Implement Cloud Security Fundamentals on Google Cloud': 3,
  'Build a Data Warehouse with BigQuery': 3,
  'Engineer Data for Predictive Modeling with BigQuery ML': 3,
  'Create ML Models with BigQuery ML': 3,

  // Medium-value skill badges (intermediate topics)
  'Build a Secure Google Cloud Network': 2,
  'Monitor and Log with Google Cloud Observability': 2,
  'Develop Serverless Applications on Cloud Run': 2,
  'Create and Manage Cloud SQL for PostgreSQL Instances': 2,
  'Implement CI/CD Pipelines on Google Cloud': 2,
  'Get Started with Looker': 2,
  'Build LookML Objects in Looker': 2,

  // Arcade Level badges (progressive difficulty)
  'Level 3: The Arcade Quiz': 3,
  'Level 3: GenAIus Chats': 3,
  'Level 3: GenAIus Travels': 3,
  'Level 3: Google Cloud Adventures': 3,
  'Level 2: Databases': 2,
  'Level 2: Develop and Deploy': 2,
  'Level 1: Automation and CI/CD Skills': 1,
  'Level 1: Security and Identity': 1,
  'Level 1: Cloud Networking': 1,

  // AI/ML specialized badges (high value)
  'Gemini for Cloud Architects': 3,
  'Gemini for Security Engineers': 3,
  'Gemini for end-to-end SDLC': 3,
  'Machine Learning Operations (MLOps)  for Generative AI': 4,
  'Introduction to Generative AI': 2,
  'Introduction to Large Language Models': 2,
  'Introduction to Responsible AI': 2,
  'Prompt Design in Vertex AI': 3,

  // Conversation AI badges (specialized)
  'Advanced Conversation Design': 3,
  'Conversation Design Fundamentals': 2,
  'Customer Experience with Google AI Architecture': 3,
  'Conversational AI telephony and chat integrations': 3,
  'Handle Consumer Interactions with CCAIP': 2,

  // Cloud learning journey badges (foundational)
  'Digital Transformation with Google Cloud': 2,
  'Infrastructure and Application Modernization with Google Cloud': 2,
  'Innovating with Google Cloud Artificial Intelligence': 2,
  'Scaling with Google Cloud Operations': 2,
  'Trust and Security with Google Cloud': 2,
  'Exploring Data Transformation with Google Cloud': 2,

  // Monthly trivia badges (participation)
  'The Arcade Trivia November 2024 Week 1': 0.5,
  'The Arcade Trivia November 2024 Week 2': 0.5,
  'The Arcade Trivia October 2024 Week 1': 0.5,
  'The Arcade Trivia October 2024 Week 2': 0.5,
  'The Arcade Trivia October 2024 Week 3': 0.5,
  'The Arcade Trivia October 2024 Week 4': 0.5,
  'The Arcade Trivia September 2024 Week 1': 0.5,
  'The Arcade Trivia September 2024 Week 2': 0.5,
  'The Arcade Trivia September 2024 Week 3': 0.5,
  'The Arcade Trivia September 2024 Week 4': 0.5,
  'The Arcade Trivia June 2024 Week 1': 0.5,
  'The Arcade Trivia June 2024 Week 2': 0.5,
  'The Arcade Trivia June 2024 Week 3': 0.5,
  'The Arcade Trivia June 2024 Week 4': 0.5,

  // Special event badges
  'Diwali in The Arcade': 1,
  'Trick-or-Skills': 1,
  'The Arcade Base Camp November 2024': 1,
  'The Arcade June Speedrun': 2,
  'The Arcade Certification Zone October 2024': 2,
  'The Arcade Certification Zone September 2024': 2
};

async function updateBadgePoints() {
  try {
    console.log('Fetching current badges...');
    const response = await axios.get('http://localhost:5001/api/available-badges');
    const badges = response.data.availableBadges;
    
    console.log(`Found ${badges.length} badges to update`);
    
    let updateCount = 0;
    
    for (const badge of badges) {
      const newPoints = badgePointsMap[badge.name];
      
      if (newPoints && newPoints !== badge.defaultPoints) {
        console.log(`Updating "${badge.name}": ${badge.defaultPoints} -> ${newPoints} points`);
        
        try {
          // Update via the seed endpoint (which does upsert)
          await axios.post('http://localhost:5001/api/admin/seed-available-badges', {
            badges: [{
              name: badge.name,
              description: badge.description || `Updated badge points`,
              imageUrl: badge.imageUrl,
              sourceUrl: badge.sourceUrl || badge.url,
              defaultPoints: newPoints
            }]
          });
          updateCount++;
        } catch (error) {
          console.error(`Failed to update badge "${badge.name}":`, error.message);
        }
      }
    }
    
    console.log(`Successfully updated ${updateCount} badge point values`);
    
    // Test the calculation again
    console.log('\nTesting updated calculation...');
    const testResponse = await axios.post('http://localhost:5001/api/calculate-points', {
      profileUrl: "https://www.cloudskillsboost.google/public_profiles/09f59c76-4837-46e9-b1cd-6d0619e6f2a2"
    });
    
    console.log(`New total points: ${testResponse.data.user.points}`);
    console.log(`Badge count: ${testResponse.data.user.badges.length}`);
    
    // Show a few sample badges with their new points
    const sampleBadges = testResponse.data.user.badges.slice(0, 10);
    console.log('\nSample badge points:');
    sampleBadges.forEach(badge => {
      console.log(`  ${badge.name}: ${badge.points} points`);
    });
    
  } catch (error) {
    console.error('Error updating badge points:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

updateBadgePoints();