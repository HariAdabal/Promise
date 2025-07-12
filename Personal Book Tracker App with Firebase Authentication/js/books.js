document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");
  const addBookForm = document.getElementById("add-book-form");
  const booksList = document.getElementById("books-list");
  const loadingSpinner = document.getElementById("loading-spinner");
  const emptyMessage = document.getElementById("empty-message");

  // Mock database
  let userBooks = [];
  let loadingTimeout;

  // Logout button
  logoutBtn.addEventListener("click", function () {
    clearTimeout(loadingTimeout); // Clear any pending timeouts
    AuthService.logout();
  });

  // Add new book
  addBookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("book-title").value.trim();
    const author = document.getElementById("book-author").value.trim();

    if (!title || !author) {
      alert("Please fill in all fields");
      return;
    }

    const user = AuthService.getCurrentUser();
    if (!user) {
      alert("You need to be logged in to add books");
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      userId: user.uid,
      read: false,
      createdAt: new Date().toISOString(),
    };

    userBooks.push(newBook);
    addBookForm.reset();
    renderBooks();
  });

  // Load books with better loading state handling
  function loadBooks() {
    showLoadingState();

    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }

    const user = AuthService.getCurrentUser();
    if (!user) {
      hideLoadingState();
      return;
    }

    // Set timeout to simulate API call (max 3 seconds)
    loadingTimeout = setTimeout(() => {
      // Filter books by current user (mock implementation)
      userBooks = [
        {
          id: "1",
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          read: false,
          userId: user.uid,
        },
        {
          id: "2",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          read: true,
          userId: user.uid,
        },
        {
          id: "3",
          title: "1984",
          author: "George Orwell",
          read: false,
          userId: user.uid,
        },
      ].filter((book) => book.userId === user.uid);

      renderBooks();
      hideLoadingState();
    }, 1500); // Reduced from 3s to 1.5s for better UX
  }

  function showLoadingState() {
    loadingSpinner.classList.remove("hidden");
    booksList.classList.add("hidden");
    emptyMessage.classList.add("hidden");
  }

  function hideLoadingState() {
    loadingSpinner.classList.add("hidden");
    booksList.classList.remove("hidden");
  }

  // Render books to the UI
  function renderBooks() {
    booksList.innerHTML = "";

    if (userBooks.length === 0) {
      emptyMessage.classList.remove("hidden");
      booksList.classList.add("hidden");
      return;
    }

    userBooks.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.className = `book-item ${book.read ? "read" : ""}`;
      bookElement.innerHTML = `
        <div class="book-info">
          <h3>${book.title}</h3>
          <p>by ${book.author}</p>
          ${book.read ? '<span class="read-badge">Read</span>' : ""}
        </div>
        <div class="book-actions">
          <button class="btn ${
            book.read ? "btn-primary" : "btn-secondary"
          } mark-read" data-id="${book.id}">
            ${book.read ? "✓ Read" : "Mark as Read"}
          </button>
          <button class="btn btn-danger delete-book" data-id="${book.id}">
            Delete
          </button>
        </div>
      `;
      booksList.appendChild(bookElement);
    });

    // Add event listeners
    document.querySelectorAll(".mark-read").forEach((btn) => {
      btn.addEventListener("click", toggleReadStatus);
    });

    document.querySelectorAll(".delete-book").forEach((btn) => {
      btn.addEventListener("click", deleteBook);
    });
  }

  // Toggle read status
  function toggleReadStatus(e) {
    const bookId = e.target.getAttribute("data-id");
    const book = userBooks.find((b) => b.id === bookId);

    if (book) {
      book.read = !book.read;
      renderBooks();
    }
  }

  // Delete book
  function deleteBook(e) {
    if (!confirm("Are you sure you want to delete this book?")) return;

    const bookId = e.target.getAttribute("data-id");
    userBooks = userBooks.filter((book) => book.id !== bookId);
    renderBooks();
  }

  // Initial load
  loadBooks();
});
