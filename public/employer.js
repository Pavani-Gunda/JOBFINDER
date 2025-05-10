import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signOut,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, query, equalTo, orderByChild, get, update, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";



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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);





// logout feature
let employerLogoutBtn = document.getElementById("employerLogoutBtn");

employerLogoutBtn.addEventListener("click",()=>{
    Swal.fire({
        title: "Are you sure?",
        text: "You want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!"
      }).then((result) => {
        if (result.isConfirmed) {
          signOut(auth)
          .then(()=>{
            Swal.fire({
                title: "Logged Out!",
                text: "You have been successfully logged out.",
                icon: "success"
              }).then(()=>{
                window.location.href = "./index.html"
              });
          })
          .catch((err)=>{
            Swal.fire({
                title: "Error!",
                text: err.message,
                icon: "error"
              });
          });
        }
      });
})

onAuthStateChanged(auth, (user) => {
  if (user) {
      let employerId = user.uid;
      // console.log(employerId);
      

      // Get all job posts by this employer
      const jobPostsRef = ref(db, 'jobs/');
      get(jobPostsRef).then((snapshot) => {
          if (snapshot.exists()) {
              const jobs = snapshot.val();
              for (let jobId in jobs) {
                  if (jobs[jobId].employerId === employerId) {
                      // For each job, fetch applications
                      // console.log(jobId);
                      
                      fetchApplicationsForJob(jobId);
                  }
              }
          } else {
              console.log("No jobs found");
          }
      }).catch((error) => {
          console.error(error);
      });
  } else {
     window.location.href = "./index.html";
  }
});

// Fetch applications for a specific job
function fetchApplicationsForJob(jobId) {
  const applicationsRef = ref(db, 'applications/' + jobId);
  get(applicationsRef).then((snapshot) => {
      const applicationsTable = document.getElementById("applicationsTable");

      
      if (snapshot.exists()) {
          const applications = snapshot.val();
          // console.log(applications);
          
          for (let applicationId in applications) {
              const application = applications[applicationId];
              console.log(application);
              
              // Append each application to the table
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${application.candidateName}</td>
                  <td><a href="${application.resumeLink}" target="_blank">View Resume</a></td>
                  <td><span class="badge bg-${getStatusClass(application.status)}">${application.status}</span></td>
                  <td>
                      <button class="btn btn-warning btn-sm" onclick="updateApplicationStatus('${jobId}', '${applicationId}', 'Success')">Review</button>
                      <button class="btn btn-success btn-sm" onclick="updateApplicationStatus('${jobId}', '${applicationId}', 'Shortlisted')">Shortlist</button>
                      <button class="btn btn-danger btn-sm" onclick="updateApplicationStatus('${jobId}', '${applicationId}', 'Rejected')">Reject</button>
                  </td>
              `;
              applicationsTable.appendChild(row);
          }
      } else {
          console.log("No applications found");
      }
  }).catch((error) => {
      console.error(error);
  });
}


// Helper function to get the class for the application status 
function getStatusClass(status) {
  switch (status) {
      case 'New':
          return 'info';
      case 'Success':
          return 'warning';
      case 'Shortlisted':
          return 'success';
      case 'Rejected':
          return 'danger';
      default:
          return 'secondary';
  }
}


window.updateApplicationStatus = (jobId, applicationId, newStatus)=>{
    // console.log("Updating:", jobId, applicationId, newStatus); // Debugging
    const applicationRef = ref(db, 'applications/' + jobId + '/' + applicationId);
    // console.log("Database Path:", applicationRef.toString()); // Debugging
  
    update(applicationRef, {
        status: newStatus
    }).then(() => {
        Swal.fire({
            title: "Success!",
            text: "Application status updated.",
            icon: "success"
        }).then(() => {
            location.reload();
        });
    }).catch((error) => {
        console.error("Error updating application status:", error); // Debugging
        Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error"
        });
    });

}


