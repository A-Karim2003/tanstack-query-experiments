import { useQuery } from "@tanstack/react-query";
import { fetchTodo } from "./services/todoAPI";
import TodoForm from "./TodoForm";

export default function App() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["todo"],
    queryFn: fetchTodo,
  });

  if (isPending)
    return <h1 className="text-center text-2xl mt-20">Loading...</h1>;

  if (isError)
    return (
      <pre className="text-red-600 text-center mt-20">
        {JSON.stringify(error, null, 2)}
      </pre>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <TodoForm />
      <h1 className="text-4xl font-black text-center mb-10 text-gray-800">
        My Todos
      </h1>

      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((todo) => (
          <div
            key={todo.id}
            className={`p-6 rounded-xl shadow-md border-l-4 transition-all
              ${
                todo.priority === "High"
                  ? "border-red-500 bg-red-50"
                  : todo.priority === "Medium"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-green-500 bg-green-50"
              }
              ${todo.completed ? "opacity-75" : ""}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className={`font-semibold text-lg ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {todo.task}
              </h3>
              {todo.completed && (
                <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">
                  Done ✓
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Due:</span>{" "}
                {new Date(todo.due_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>
                <span className="font-medium">Priority:</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-medium
                  ${
                    todo.priority === "High"
                      ? "bg-red-200 text-red-800"
                      : todo.priority === "Medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {todo.priority}
                </span>
              </p>
              <p>
                <span className="font-medium">Category:</span>
                <span className="ml-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {todo.category}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
