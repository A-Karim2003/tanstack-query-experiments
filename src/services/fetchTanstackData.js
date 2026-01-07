export default async function fetchTanstackData() {
  return await fetch("https://api.github.com/repos/TanStack/query");
}
