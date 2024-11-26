import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("asc");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) {
          throw new Error(`Error while fetching data ! status: ${res.status}`);
        }
        const users = await res.json();
        setData(users);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleClick = () => {
    console.log(sort);
    const SortedArray = [...data].sort((a, b) => {
      if (sort === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setData(SortedArray);
    setSort(sort === "asc" ? "desc" : "asc");
  };

  const filteredUser = data.filter((user) => {
    return user.address.city.toLowerCase().includes(search.toLowerCase());
  });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center text-red-500">
        Error: {error}
      </div>
    );
  }
  return (
    <div className=" min-h-screen bg-gray-50  p-5">
      <div className="flex flex-col md:flex-row justify-center items-center md:justify-evenly gap-5">
        <input
          type="text"
          className="w-full md:w-auto p-2 border px-7 border-gray-500 border-solid rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          placeholder="filter by city"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={handleClick}
          className="w-full md:w-auto shadow-sm font-sans bg-blue-500 text-white hover:bg-blue-700 p-2 font-semibold rounded"
        >{`Sort by name in ${
          sort === "desc" ? "descending" : "ascending"
        }`}</button>
      </div>
      <div className="md:flex md:justify-center bg-white p-5 overflow-x-auto ">
        <table className="md:w-10/12 w-auto overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUser?.map((user) => (
              <tr className="hover:bg-gray-50" key={user.id}>
                <td>{user.id}</td>
                <td className="tracking-wider uppercase">{user.name}</td>
                <td>{user.username}</td>
                <td className="tracking-wider uppercase">
                  {user.address.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
