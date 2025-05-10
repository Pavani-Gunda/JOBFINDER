    // Import Firebase dependencies
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
    import { getDatabase, ref, query, equalTo, orderByChild, get, update, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
    
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
    const auth = getAuth(app);
    const db = getDatabase(app);
    
    // DOM element
    const jobsContainer = document.getElementById("jobsContainer");
    
    // Fetch and display jobs
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const employerId = user.uid;
        const jobsRef = query(ref(db, "jobs"), orderByChild("employerId"), equalTo(employerId));
    
        const snapshot = await get(jobsRef);
        if (snapshot.exists()) {
          const jobs = snapshot.val();
          displayJobs(jobs);
        } else {
          jobsContainer.innerHTML = `<p class="text-center text-white">No jobs found.</p>`;
        }
      } else {
        jobsContainer.innerHTML = `<p class="text-center text-white">Unauthorized. Please log in.</p>`;
      }
    });
    
    // Display jobs
    function displayJobs(jobs) {
      jobsContainer.innerHTML = ""; // Clear previous jobs
      for (const jobId in jobs) {
        const job = jobs[jobId];
        const jobCard = document.createElement("div");
        jobCard.className = "job-card";
    
        jobCard.innerHTML = `
          <h5>${job.title}</h5>
          <p><strong>Company:</strong> ${job.companyName}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Skills:</strong> ${job.skills.join(", ")}</p>
          <div>
            <button class="btn btn-primary btn-sm" onclick="editJob('${jobId}')">Edit</button>
            <button class="btn btn-warning btn-sm" onclick="closeJob('${jobId}')">Close</button>
            <button class="btn btn-danger btn-sm" onclick="deleteJob('${jobId}')">Delete</button>
          </div>
        `;
        jobsContainer.appendChild(jobCard);
      }
    }
    
    // Edit job
    window.editJob = (jobId) => {
      Swal.fire("Edit Job", "Feature coming soon!", "info");
    };
    
    // Close job
    window.closeJob = async (jobId) => {
      try {
        await update(ref(db, `jobs/${jobId}`), { isActive: false });
        Swal.fire("Success", "Job has been closed.", "success");
        location.reload();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    };
    
    // Delete job
    window.deleteJob = async (jobId) => {
      try {
        await remove(ref(db, `jobs/${jobId}`));
        Swal.fire("Deleted", "Job has been deleted.", "success");
        location.reload();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    };