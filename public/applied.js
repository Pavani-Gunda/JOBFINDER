// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// DOM Elements
const appliedJobsList = document.getElementById("appliedJobsList");

// Function to fetch applied jobs
async function fetchAppliedJobs(userId) {
    const applicationsRef = ref(db, "applications");
    const snapshot = await get(applicationsRef);

    if (snapshot.exists()) {
        const applicationsData = snapshot.val();
        let appliedJobs = [];

        // Iterate through jobs
        for (const jobId in applicationsData) {
            for (const appId in applicationsData[jobId]) {
                const application = applicationsData[jobId][appId];

                // Check if the logged-in user applied for this job
                if (application.candidateId === userId) {
                    appliedJobs.push({ jobId, ...application });
                }
            }
        }

        displayAppliedJobs(appliedJobs);
    } else {
        appliedJobsList.innerHTML = `<p class="text-center text-muted">No applications found.</p>`;
    }
}

// Function to display applied jobs
function displayAppliedJobs(appliedJobs) {
    appliedJobsList.innerHTML = ""; // Clear previous content

    if (appliedJobs.length === 0) {
        appliedJobsList.innerHTML = `<p class="text-center text-muted">You haven't applied for any jobs yet.</p>`;
        return;
    }

    appliedJobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("col-lg-4", "col-md-6", "col-12", "mb-4");

        jobCard.innerHTML = `
            <div class="card shadow-sm p-3">
        <h5>${job.jobTitle}</h5>
        <p><strong>Company:</strong> ${job.companyName}</p>
        <p><strong>Applied Date:</strong> ${new Date(job.appliedDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span class="status-${job.status.toLowerCase()}">${job.status}</span></p>
        <p><a href="${job.resumeLink}" target="_blank" class="btn btn-primary btn-sm">View Resume</a></p>
    </div>
        `;

        appliedJobsList.appendChild(jobCard);
    });
}

// Check authentication and fetch applied jobs
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchAppliedJobs(user.uid);
    } else {
        appliedJobsList.innerHTML = `<p class="text-danger text-center">Please log in to see your applications.</p>`;
    }
});