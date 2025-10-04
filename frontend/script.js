const API_URL = "http://localhost:5000/api/tasks";

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });

  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  loadTasks();
});

async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.slice(0, 5).forEach(task => {
      const card = document.createElement('div');
      card.className = 'bg-gray-200 p-4 rounded-md shadow flex items-center justify-between';
      card.innerHTML = `
        <div>
          <h3 class="font-bold text-lg">${task.title}</h3>
          <p class="text-sm text-gray-700">${task.description || 'No description'}</p>
        </div>
        <button 
          onclick="markDone(${task.id})"
          class="border border-gray-700 px-4 py-1 rounded-md text-sm hover:bg-gray-300"
        >
          Done
        </button>
      `;
      taskList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function markDone(id) {
  try {
    await fetch(`${API_URL}/${id}/done`, {
      method: 'PUT'
    });
    loadTasks();
  } catch (error) {
    console.error('Error marking task as done:', error);
  }
}

window.onload = loadTasks;