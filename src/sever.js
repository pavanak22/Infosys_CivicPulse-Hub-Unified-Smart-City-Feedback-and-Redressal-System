// ---------------- FORMS ---------------- //
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const complaintForm = document.getElementById('complaintForm'); // your complaint form

// ---------------- USER REGISTRATION ---------------- //
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const full_name = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name, email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Registration failed');
                return;
            }

            alert('Registration successful!');
            registerForm.reset();
        } catch (err) {
            console.error(err);
            alert('Error connecting to server.');
        }
    });
}

// ---------------- USER LOGIN ---------------- //
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const res = await fetch('/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Login failed');
                return;
            }

            alert('Login successful!');
            loginForm.reset();
            // Optionally save user ID for complaint submission
            localStorage.setItem('userId', data.id);
        } catch (err) {
            console.error(err);
            alert('Error connecting to server.');
        }
    });
}

// ---------------- SUBMIT COMPLAINT ---------------- //
if (complaintForm) {
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem('userId'); // ensure user is logged in
        const department_id = document.getElementById('departmentId').value;
        const title = document.getElementById('complaintTitle').value;
        const description = document.getElementById('complaintDescription').value;

        if (!user_id) {
            alert('You must be logged in to submit a complaint.');
            return;
        }

        try {
            const res = await fetch('/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, department_id, title, description })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Failed to submit complaint');
                return;
            }

            alert('Complaint submitted successfully!');
            complaintForm.reset();
        } catch (err) {
            console.error(err);
            alert('Error connecting to server.');
        }
    });
}
