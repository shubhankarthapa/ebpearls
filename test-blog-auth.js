// Test blog creation with and without authentication
// Run this with: node test-blog-auth.js

const BASE_URL = 'http://localhost:3000/api';

// Test blog creation WITHOUT token (should fail)
async function testBlogCreationWithoutAuth() {
    try {
        console.log('🚫 Testing blog creation WITHOUT authentication...');
        const response = await fetch(`${BASE_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Unauthorized Blog',
                description: 'This should fail',
                content: 'This blog should not be created.',
                tags: ['unauthorized'],
                isPublished: true
            })
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response:', result);
        
        if (response.status === 401) {
            console.log('✅ Correctly blocked - authentication required');
        } else {
            console.log('❌ Security issue - blog created without authentication!');
        }
        
        return result;
    } catch (error) {
        console.error('Test Error:', error);
    }
}

// Test blog creation WITH token (should succeed)
async function testBlogCreationWithAuth() {
    try {
        console.log('\n🔐 Testing blog creation WITH authentication...');
        
        // First, signup to get a token
        const signupResponse = await fetch(`${BASE_URL}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Blog Test User',
                email: 'blogtest@example.com',
                password: 'password123',
                profile_url: 'https://example.com/profile.jpg',
                gender: 'male',
                address: '123 Blog Test St, Test City, Test Country',
                username: 'blogtestuser'
            })
        });

        const signupResult = await signupResponse.json();
        console.log('Signup result:', signupResult);
        
        if (!signupResult.token) {
            console.log('❌ No token received from signup');
            return;
        }
        
        // Now create blog with token
        const blogResponse = await fetch(`${BASE_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${signupResult.token}`
            },
            body: JSON.stringify({
                title: 'Authorized Blog',
                description: 'This should succeed',
                content: 'This blog should be created successfully.',
                tags: ['authorized', 'test'],
                isPublished: true
            })
        });

        const blogResult = await blogResponse.json();
        console.log('Blog creation status:', blogResponse.status);
        console.log('Blog creation result:', blogResult);
        
        if (blogResponse.status === 201) {
            console.log('✅ Correctly created - authentication working');
        } else {
            console.log('❌ Failed to create blog with authentication');
        }
        
        return blogResult;
    } catch (error) {
        console.error('Auth Test Error:', error);
    }
}

// Test public routes (should work without auth)
async function testPublicRoutes() {
    try {
        console.log('\n📖 Testing public routes...');
        
        // Test get all blogs
        const response = await fetch(`${BASE_URL}/blogs`);
        const result = await response.json();
        console.log('Get blogs status:', response.status);
        console.log('Get blogs result:', result);
        
        if (response.status === 200) {
            console.log('✅ Public route working correctly');
        } else {
            console.log('❌ Public route not working');
        }
        
    } catch (error) {
        console.error('Public route test error:', error);
    }
}

// Run all tests
async function runTests() {
    console.log('🔍 Testing Blog Authentication Security...\n');
    
    await testBlogCreationWithoutAuth();
    await testBlogCreationWithAuth();
    await testPublicRoutes();
    
    console.log('\n✅ All tests completed!');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { testBlogCreationWithoutAuth, testBlogCreationWithAuth, testPublicRoutes }; 