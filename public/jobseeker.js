import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
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



let appliedjobsBtn =document.getElementById("appliedjobsBtn");

appliedjobsBtn.addEventListener("click",()=>{
  location.href="./applied.html"
})


document.getElementById("search-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission
  fetchJobListings(); // Call fetch function with filtering
});




async function fetchJobListings() {
  const jobListings = document.getElementById("jobListings");

  const jobTitle = document.getElementById("job-title").value.toLowerCase();
  const companyName = document.getElementById("company-name").value.toLowerCase();
  const location = document.getElementById("location").value.toLowerCase();




  try {
    const jobsRef = ref(db, "jobs");
    const snapshot = await get(jobsRef);

    if (snapshot.exists()) {
      const jobs = snapshot.val();
      jobListings.innerHTML = "";

      Object.keys(jobs).forEach((key) => {
        const job = jobs[key];




        // Convert values to lowercase for case-insensitive search
        const jobTitleMatch = job.title.toLowerCase().includes(jobTitle);
        const companyMatch = job.companyName.toLowerCase().includes(companyName);
        const locationMatch = job.location.toLowerCase().includes(location);

        if ((jobTitle === "" || jobTitleMatch) &&
          (companyName === "" || companyMatch) &&
          (location === "" || locationMatch)) {

          const jobCard = `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div class="card h-100 p-3 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${job.title}</h5>
                        <p class="card-text"><strong>Company:</strong> ${job.companyName}</p>
                        <p class="card-text"><strong>Skills:</strong> ${job.skills}</p>
                        <p class="card-text"><strong>Location:</strong> ${job.location}</p>
                        <p class="card-text"><strong>Experience:</strong> ${job.experience}</p>
                        <p class="card-text"><strong>Posted Date:</strong> ${job.postedDate}</p>
                        <a href="./apply.html?jobId=${key}" class="btn btn-primary mt-auto w-100">Apply</a>
                    </div>
                </div>
            </div>
        `;
          jobListings.innerHTML += jobCard;
        }
      });


    }
    else {
      jobListings.innerHTML = "<p>No jobs found.</p>";
    }
  }
  catch (err) {
    console.error("Error fetching jobs:", err);
    jobListings.innerHTML = "<p>Error loading jobs.</p>";

  }
}

// Call function when the page loads
window.onload = fetchJobListings;



// logout

let jobseekerLogoutBtn = document.getElementById("jobseekerLogoutBtn");

jobseekerLogoutBtn.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, do it!"
  }).then((result) => {
    if (result.isConfirmed) {
      signOut(auth)
        .then(() => {
          Swal.fire({
            title: "Logged Out!",
            text: "You have been successfully logged out.",
            icon: "success"
          }).then(() => {
            window.location.href = "./index.html"
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error"
          });
        });
    }
  });
})