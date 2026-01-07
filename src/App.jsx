import { useQueryClient } from "@tanstack/react-query";

export default function App() {
  const client = useQueryClient();
  console.log(client);

  return (
    <div className="border h-screen">
      <h1 className="text-3xl font-black text-center">TanStack Query</h1>
      <div></div>
    </div>
  );
}
