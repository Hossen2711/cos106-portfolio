// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  initAcademicPlanner();
  initContactForm();
});

/* =========================================================
   1. ACADEMIC PLANNER (Arrays, Functions, DOM, Events)
   ========================================================= */
function initAcademicPlanner() {
  const plannerForm = document.getElementById("planner-form");
  if (!plannerForm) return; // Run only on planner.html

  const titleInput = document.getElementById("task-title");
  const courseInput = document.getElementById("task-course");
  const dueInput = document.getElementById("task-due");
  const feedbackEl = document.getElementById("planner-feedback");
  const taskListEl = document.getElementById("task-list");
  const taskCountEl = document.getElementById("task-count");

  const STORAGE_KEY = "cos106_academic_tasks";

  // Load saved tasks or start with two helpful default tasks
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    {
      id: 1,
      title: "Review HTML5 semantic tags & CSS Grid",
      course: "COS 106",
      due: "2026-11-20",
      completed: true,
    },
    {
      id: 2,
      title: "Deploy portfolio website to GitHub Pages",
      course: "COS 106",
      due: "2026-11-25",
      completed: false,
    },
  ];

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function showPlannerMessage(message, type) {
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${type}`;
  }

  function renderTasks() {
    taskListEl.innerHTML = "";
    taskCountEl.textContent = tasks.length;

    if (tasks.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.textContent = "No tasks yet. Add your first academic task above!";
      taskListEl.appendChild(emptyLi);
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = task.completed ? "task-item completed" : "task-item";

      const infoDiv = document.createElement("div");
      const titleSpan = document.createElement("strong");
      titleSpan.className = "task-title";
      titleSpan.textContent = `${task.title} (${task.course})`;

      const metaDiv = document.createElement("small");
      metaDiv.textContent = task.due ? ` — Due: ${task.due}` : "";

      infoDiv.appendChild(titleSpan);
      infoDiv.appendChild(metaDiv);

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "task-actions";

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "btn btn-secondary";
      toggleBtn.textContent = task.completed ? "Undo" : "Complete";
      toggleBtn.addEventListener("click", () => toggleTask(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      actionsDiv.appendChild(toggleBtn);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(infoDiv);
      li.appendChild(actionsDiv);
      taskListEl.appendChild(li);
    });
  }

  function addTask(title, course, due) {
    const newTask = {
      id: Date.now(),
      title,
      course: course || "General",
      due,
      completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }

  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    showPlannerMessage("Task removed.", "success");
  }

  plannerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const course = courseInput.value.trim();
    const due = dueInput.value;

    if (!title) {
      showPlannerMessage("Please enter a task description before adding.", "error");
      return;
    }

    addTask(title, course, due);
    plannerForm.reset();
    showPlannerMessage("Task added successfully!", "success");
  });

  renderTasks();
}

/* =========================================================
   2. CONTACT FORM VALIDATION
   Rules:
   - No field is empty
   - Email format is valid
   - Phone number contains only digits
   ========================================================= */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return; // Run only on contact.html

  const nameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const feedbackEl = document.getElementById("contact-feedback");

  function showContactMessage(message, type) {
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${type}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isDigitsOnly(phone) {
    return /^\d+$/.test(phone);
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !phone || !message) {
      showContactMessage("All fields are required. Please fill in every box.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showContactMessage("Please enter a valid email address (e.g., name@example.com).", "error");
      return;
    }

    if (!isDigitsOnly(phone)) {
      showContactMessage("Phone number must contain digits only (0-9).", "error");
      return;
    }

    showContactMessage(
      `Thank you, ${name}! Your message has been validated and sent.`,
      "success"
    );
    contactForm.reset();
  });
}