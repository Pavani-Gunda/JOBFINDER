// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, push, child } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0H9DCQBcQpbIClHX1tTm2i0Z82dQXc_Q",
    authDomain: "register-and-signin-fbd7b.firebaseapp.com",
    databaseURL: "https://register-and-signin-fbd7b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "register-and-signin-fbd7b",
    storageBucket: "register-and-signin-fbd7b.firebasestorage.app",
    messagingSenderId: "398801107437",
    appId: "1:398801107437:web:2c17a04256740dc09a4fe4"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Extract jobId from the URL
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("jobId");

// DOM Elements
const jobDetailsDiv = document.getElementById("jobDetails");
const applicationForm = document.getElementById("applicationForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");

// Fetch job details from Firebase
async function loadJobDetails() {
    if (!jobId) {
        jobDetailsDiv.innerHTML = `<p class="text-danger">Invalid Job ID</p>`;
        return;
    }

    try {
        const jobRef = ref(db, `jobs/${jobId}`);
        const snapshot = await get(jobRef);

        if (snapshot.exists()) {
            const job = snapshot.val();
            jobDetailsDiv.innerHTML = `
                <h4>${job.title}</h4>
                <p><strong>Company:</strong> ${job.companyName}</p>
                <p><strong>Skills:</strong> ${job.skills.join(", ")}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Description:</strong> ${job.description}</p>
                <p><strong>Experience:</strong> ${job.experience}</p>
            `;
        } else {
            jobDetailsDiv.innerHTML = `<p class="text-danger">Job not found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching job details:", error);
        jobDetailsDiv.innerHTML = `<p class="text-danger">Error loading job details.</p>`;
    }
}

// Auto-fill email field when user logs in
onAuthStateChanged(auth, (user) => {
    if (user) {
        emailInput.value = user.email; // Pre-fill the email field
        fullNameInput.value = user.name || ""; // Pre-fill name if available
    }
});

// Handle job application submission with validations
applicationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const resumeLink = document.getElementById("resumeLink").value.trim();
    const emailError = document.getElementById("emailError");
    const resumeError = document.getElementById("resumeError");

    let isValid = true;

    // Email validation
    if (!validateEmail(email)) {
        emailError.classList.remove("d-none");
        isValid = false;
    } else {
        emailError.classList.add("d-none");
    }

    //Resume link validation
    if (!resumeLink.startsWith("http") || resumeLink.length < 10) {
        resumeError.classList.remove("d-none");
        isValid = false;
    } else {
        resumeError.classList.add("d-none");
    }

    if (!isValid) {
        return;
    }

    // Ensure user is authenticated
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;

            try {
                // Fetch Job Details from Firebase
                const jobRef = ref(db, `jobs/${jobId}`);
                const jobSnapshot = await get(jobRef);

                if (!jobSnapshot.exists()) {
                    Swal.fire({
                        icon: "error",
                        title: "Job Not Found",
                        text: "This job no longer exists.",
                    });
                    return;
                }

                const job = jobSnapshot.val(); // Fetch job data
                const companyName = job.companyName;
                const jobTitle = job.title;

                // Generate unique application ID
                const newAppRef = push(ref(db, `applications/${jobId}`));
                const applicationId = newAppRef.key; 

                // Prepare application data
                const applicationData = {
                    applicationId,
                    candidateId: userId,
                    candidateName: fullName,
                    email,resumeLink,
                    status: "Pending",
                    appliedDate: new Date().toISOString(),
                    companyName,  // ✅ Added company name
                    jobTitle      // ✅ Added job title
                };

                // Store application in Firebase under the job's node
                await push(ref(db, `applications/${jobId}`), applicationData);

                Swal.fire({
                    title: "Application Submitted!",
                    text: "Your application has been successfully submitted.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    window.location.href = "./jobseeker.html"; // Redirect to dashboard
                });

            } catch (error) {
                console.error("Error submitting application:", error);
                Swal.fire({
                    icon: "error",
                    title: "Application Failed",
                    text: "An error occurred while submitting your application.",
                });
            }
        } else {
            Swal.fire({
                icon: "warning",
                title: "Not Logged In",
                text: "Please log in to apply for jobs.",
            });
        }
    });
});


// Function to validate email format
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Load job details on page load
window.onload = loadJobDetails;
