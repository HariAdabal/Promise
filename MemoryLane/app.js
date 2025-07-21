import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNx0qkbRR9AbkYprm5cPES9hQvLlo8VtU",
  authDomain: "memorylane-162b9.firebaseapp.com",
  projectId: "memorylane-162b9",
  storageBucket: "memorylane-162b9.appspot.com",
  messagingSenderId: "932350649275",
  appId: "1:932350649275:web:195891511e4759eefd5a9e",
  measurementId: "G-J4XPBF5Y96",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// App state variables
let currentUser = null;
let memories = [];
let albums = [];
let milestones = [];
let currentView = "timeline";

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initFirebaseAuth();
  initEventListeners();
  initFileUploadHandlers();
});

// Authentication functions
function initFirebaseAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      loadUserData();
      showAppView();
    } else {
      currentUser = null;
      showLandingPage();
    }
  });
}

function initEventListeners() {
  // Navigation between pages
  document.getElementById("loginBtn")?.addEventListener("click", () => {
    showLoginPage();
  });

  document.getElementById("signupBtn")?.addEventListener("click", () => {
    showSignupPage();
  });

  document.getElementById("heroSignupBtn")?.addEventListener("click", () => {
    showSignupPage();
  });

  document.getElementById("backFromLogin")?.addEventListener("click", () => {
    showLandingPage();
  });

  document.getElementById("backFromSignup")?.addEventListener("click", () => {
    showLandingPage();
  });

  document.getElementById("backFromDetails")?.addEventListener("click", () => {
    switchView(currentView);
  });

  // Auth forms
  document
    .getElementById("loginForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Login error:", error);
        alert(`Login failed: ${error.message}`);
      }
    });

  document
    .getElementById("signupForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirm = document.getElementById("signupConfirm").value;
      const name = document.getElementById("signupName").value;

      if (password !== confirm) {
        alert("Passwords don't match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          name: name,
          email: email,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Signup error:", error);
        alert(`Signup failed: ${error.message}`);
      }
    });

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  });

  // App navigation
  document.getElementById("timelineBtn")?.addEventListener("click", () => {
    switchView("timeline");
  });

  document.getElementById("albumsBtn")?.addEventListener("click", () => {
    switchView("albums");
  });

  document.getElementById("milestonesBtn")?.addEventListener("click", () => {
    switchView("milestones");
  });

  // Memory operations
  document.getElementById("createMemoryBtn")?.addEventListener("click", () => {
    showMemoryForm();
  });

  document
    .getElementById("memoryForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const files = document.getElementById("memoryFiles").files;

      // First save the memory data
      try {
        const memoryRef = await addDoc(collection(db, "memories"), {
          userId: currentUser.uid,
          title: formData.get("title"),
          description: formData.get("description"),
          date: formData.get("date"),
          tags: formData
            .get("tags")
            .split(",")
            .map((tag) => tag.trim()),
          location: formData.get("location"),
          createdAt: serverTimestamp(),
          attachments: [], // Will be populated after file uploads
        });

        // Upload files if any
        if (files.length > 0) {
          const uploadPromises = Array.from(files).map((file) => {
            const fileRef = ref(
              storage,
              `memories/${currentUser.uid}/${memoryRef.id}/${file.name}`
            );
            return uploadBytes(fileRef, file)
              .then((snapshot) => getDownloadURL(snapshot.ref))
              .then((url) => ({
                name: file.name,
                type: file.type,
                size: file.size,
                url: url,
              }));
          });

          const attachments = await Promise.all(uploadPromises);

          // Update memory with attachment URLs
          await updateDoc(memoryRef, {
            attachments: attachments,
          });
        }

        e.target.reset();
        document.getElementById("filePreview").innerHTML = "";
        switchView(currentView);
      } catch (error) {
        console.error("Error saving memory:", error);
        alert("Error saving memory");
      }
    });

  document.getElementById("cancelMemoryBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("memoryFormPage").style.display = "none";
    document.getElementById("memoryForm").reset();
    document.getElementById("filePreview").innerHTML = "";
    showAppView();
  });

  // Album operations
  document.getElementById("createAlbumBtn")?.addEventListener("click", () => {
    showAlbumForm();
  });

  document
    .getElementById("albumForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const selectedMemories = Array.from(
        document.querySelectorAll("#albumMemorySelection input:checked")
      ).map((input) => input.value);

      try {
        await addDoc(collection(db, "albums"), {
          userId: currentUser.uid,
          title: formData.get("title"),
          description: formData.get("description"),
          memories: selectedMemories,
          createdAt: serverTimestamp(),
        });
        e.target.reset();
        switchView("albums");
      } catch (error) {
        console.error("Error saving album:", error);
        alert("Error saving album");
      }
    });

  document
    .getElementById("cancelAlbumBtn")
    ?.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("albumFormPage").style.display = "none";
      document.getElementById("albumForm").reset();

      // Uncheck all memory selections
      document
        .querySelectorAll('#albumMemorySelection input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      // Return to albums view
      switchView("albums");
    });

  // Random memory
  document.getElementById("reminisceBtn")?.addEventListener("click", () => {
    showRandomMemory();
  });
}

// File upload handlers
function initFileUploadHandlers() {
  const fileInput = document.getElementById("memoryFiles");
  if (!fileInput) return;

  fileInput.addEventListener("change", function (e) {
    const filePreview = document.getElementById("filePreview");
    filePreview.innerHTML = ""; // Clear previous previews

    const files = Array.from(e.target.files);

    files.forEach((file, index) => {
      const previewItem = document.createElement("div");
      previewItem.className = "file-preview-item";

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-file";
      removeBtn.innerHTML = "×";
      removeBtn.addEventListener("click", () => {
        previewItem.remove();
        // Remove the file from the input's files array
        const dataTransfer = new DataTransfer();
        Array.from(fileInput.files)
          .filter((_, i) => i !== index)
          .forEach((file) => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
      });

      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        previewItem.appendChild(img);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.controls = true;
        previewItem.appendChild(video);
      }

      previewItem.appendChild(removeBtn);
      filePreview.appendChild(previewItem);
    });
  });
}

// View management functions
function showLandingPage() {
  hideAllPages();
  document.getElementById("landingPage").style.display = "block";
}

function showLoginPage() {
  hideAllPages();
  document.getElementById("loginPage").style.display = "flex";
}

function showSignupPage() {
  hideAllPages();
  document.getElementById("signupPage").style.display = "flex";
}

function showAppView() {
  hideAllPages();
  document.getElementById("appContainer").style.display = "block";
  switchView("timeline");
}

function showMemoryForm() {
  hideAllPages();
  document.getElementById("memoryFormPage").style.display = "block";
}

function showAlbumForm() {
  hideAllPages();
  const memorySelection = document.getElementById("albumMemorySelection");
  memorySelection.innerHTML = memories
    .map(
      (memory) => `
    <div class="memory-selection-item">
      <input type="checkbox" id="memory-${memory.id}" value="${memory.id}">
      <label for="memory-${memory.id}">${memory.title}</label>
    </div>
  `
    )
    .join("");
  document.getElementById("albumFormPage").style.display = "block";
}

function showMemoryDetails(memoryId) {
  hideAllPages();
  const memory = memories.find((m) => m.id === memoryId);
  if (!memory) return;

  const detailsContent = document.getElementById("memoryDetailsContent");
  detailsContent.innerHTML = `
    <h2>${memory.title}</h2>
    <div class="memory-meta">
      <span class="date">${new Date(memory.date).toLocaleDateString()}</span>
      ${
        memory.location
          ? `<span class="location">📍 ${memory.location}</span>`
          : ""
      }
    </div>
    <div class="memory-description">
      <p>${memory.description}</p>
    </div>
    ${
      memory.attachments?.length > 0
        ? `
        <div class="memory-attachments">
          ${memory.attachments
            .map((attachment) => {
              if (attachment.type.startsWith("image/")) {
                return `<img src="${attachment.url}" alt="${attachment.name}">`;
              } else if (attachment.type.startsWith("video/")) {
                return `
                <video controls>
                  <source src="${attachment.url}" type="${attachment.type}">
                  Your browser does not support the video tag.
                </video>
              `;
              }
              return "";
            })
            .join("")}
        </div>
      `
        : ""
    }
    ${
      memory.tags?.length
        ? `
      <div class="memory-tags">
        ${memory.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `
        : ""
    }
    <div class="memory-actions">
      <button class="delete-memory-btn" data-id="${memory.id}">Delete</button>
    </div>
  `;

  document
    .querySelector(".delete-memory-btn")
    ?.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this memory?")) {
        try {
          // Delete attachments from storage first if they exist
          if (memory.attachments?.length > 0) {
            // Note: In a production app, you would need to implement actual deletion
            // from Firebase Storage here
            console.log("Attachments would be deleted in production");
          }

          await deleteDoc(doc(db, "memories", memory.id));
          memories = memories.filter((m) => m.id !== memory.id);
          switchView(currentView);
        } catch (error) {
          console.error("Error deleting memory:", error);
          alert("Error deleting memory");
        }
      }
    });

  document.getElementById("memoryDetailsPage").style.display = "block";
}

function hideAllPages() {
  document
    .querySelectorAll(
      "#landingPage, #loginPage, #signupPage, #appContainer, #memoryFormPage, #albumFormPage, #memoryDetailsPage"
    )
    .forEach((page) => (page.style.display = "none"));
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach((v) => (v.style.display = "none"));
  document.getElementById(`${view}View`).style.display = "block";

  // Update active nav button
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`${view}Btn`)?.classList.add("active");

  // Load appropriate data
  if (view === "timeline") renderTimeline();
  if (view === "albums") renderAlbums();
  if (view === "milestones") renderMilestones();
}

// Data loading and rendering
function loadUserData() {
  // Load memories
  const memoriesQuery = query(
    collection(db, "memories"),
    where("userId", "==", currentUser.uid)
  );

  onSnapshot(memoriesQuery, (snapshot) => {
    memories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderUserProfile();
    switchView(currentView);
  });

  // Load albums
  const albumsQuery = query(
    collection(db, "albums"),
    where("userId", "==", currentUser.uid)
  );

  onSnapshot(albumsQuery, (snapshot) => {
    albums = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (currentView === "albums") renderAlbums();
  });
}

function renderUserProfile() {
  if (!currentUser) return;
  const initials =
    currentUser.displayName?.charAt(0).toUpperCase() ||
    currentUser.email.charAt(0).toUpperCase();
  document.getElementById("userInitials").textContent = initials;
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  const sortedMemories = [...memories].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  timeline.innerHTML = sortedMemories
    .map(
      (memory) => `
    <div class="memory-card" data-id="${memory.id}">
      <h3>${memory.title}</h3>
      <div class="memory-date">${new Date(
        memory.date
      ).toLocaleDateString()}</div>
      ${
        memory.location
          ? `<div class="memory-location">📍 ${memory.location}</div>`
          : ""
      }
      <p>${memory.description}</p>
      ${
        memory.attachments?.length > 0
          ? `
          <div class="memory-attachments-preview">
            ${memory.attachments
              .slice(0, 3)
              .map((attachment) =>
                attachment.type.startsWith("image/")
                  ? `<img src="${attachment.url}" alt="${attachment.name}">`
                  : `<div class="video-thumbnail">🎥 ${attachment.name}</div>`
              )
              .join("")}
            ${
              memory.attachments.length > 3
                ? `<div class="more-files">+${
                    memory.attachments.length - 3
                  } more</div>`
                : ""
            }
          </div>
        `
          : ""
      }
      ${
        memory.tags?.length
          ? `
        <div class="memory-tags">
          ${memory.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
      `
          : ""
      }
      <button class="view-memory-btn" data-id="${
        memory.id
      }">View Details</button>
    </div>
  `
    )
    .join("");

  document.querySelectorAll(".view-memory-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      showMemoryDetails(e.target.getAttribute("data-id"));
    });
  });
}

function renderAlbums() {
  const albumsGrid = document.getElementById("albumsGrid");
  if (!albumsGrid) return;

  albumsGrid.innerHTML = albums
    .map(
      (album) => `
    <div class="album-card" data-id="${album.id}">
      <h3>${album.title}</h3>
      <p>${album.description || "No description"}</p>
      <div class="album-meta">
        <span>${album.memories?.length || 0} memories</span>
      </div>
    </div>
  `
    )
    .join("");
}

function showRandomMemory() {
  if (memories.length === 0) {
    alert("No memories to show. Create some memories first!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * memories.length);
  showMemoryDetails(memories[randomIndex].id);
}
