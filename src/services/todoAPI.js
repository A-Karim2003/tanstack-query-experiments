export async function fetchTodo() {
  const res = await fetch("http://localhost:9000/todos");
  if (!res.ok) throw new Error("Failed to Fetch");
  const data = await res.json();
  return data;
}

export async function addTodo(newTodo) {
  const res = await fetch("http://localhost:9000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(newTodo),
  });

  if (!res.ok) throw new Error("Failed to Add");

  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`http://localhost:9000/todos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to Delete");

  return res.json();
}
