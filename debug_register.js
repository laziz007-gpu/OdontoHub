const registerUrl = 'http://127.0.0.1:8000/auth/register';

async function tryRegister(phone, role, fullName, password) {
    console.log(`Trying registration with phone: "${phone}"`);
    try {
        const response = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone,
                role: role,
                full_name: fullName,
                password: password
            })
        });

        const status = response.status;
        let data;
        try {
            data = await response.json();
        } catch (e) {
            // failed to parse JSON
            console.log('Response body (text):', await response.text());
            return;
        }

        console.log(`Status: ${status}`);
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Network error:', error.message);
    }
    console.log('---');
}

// Test case 1: Phone with spaces (as in screenshot)
// Test case 2: Phone without spaces
// Test case 3: Phone without spaces and +

(async () => {
    // 1. With spaces
    await tryRegister("+998 90 321 94 59", "patient", "Test User 1", "password123");

    // 2. Without spaces
    // Use a unique number to avoid duplicate error if previous calls succeeded or if DB has data
    const randomSuffix = Math.floor(Math.random() * 10000);
    const cleanPhone = `+99890${randomSuffix}99`;

    await tryRegister(cleanPhone, "patient", "Test User 2", "password123");
})();
