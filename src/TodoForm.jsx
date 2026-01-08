import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addTodo } from "./services/todoAPI";

export default function TodoForm() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      setTask("");
      setPriority("");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!task || !priority) return;

    const newTodo = {
      task,
      due_date: new Date().toISOString(),
      priority: priority,
      category: "Generals",
      completed: false,
    };

    mutation.mutate(newTodo);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mb-10 p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end"
    >
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Task
        </label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="w-full md:w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white outline-none"
          onChange={(e) => setPriority(e.target.value)}
          value={priority}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-200"
      >
        Add Todo
      </button>
    </form>
  );
}
