"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=5`);
      const newUsers: User[] = response.data.data;

      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setTotalPage(response.data.total_pages)

      if (response.data.total_pages === page) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <h1 className="text-center text-h1 py-5">User List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
        {users.map((user) => (
          <div key={user.id} className="border border-solid border-[#ccc] rounded-lg p-4 text-center bg-gray-50 hover:shadow-md">
            <div className="flex justify-center">
              <Image src={user.avatar} alt={`${user.first_name} ${user.last_name}`} width={100} height={100} className="rounded-full self-center h-24 w-24 object-cover border-gray-500 border" />
            </div>
            <h3 className="text-h3">{`${user.first_name} ${user.last_name}`}</h3>
            <p className="text-[20px]">Email: {user.email}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>Page {page} of {totalPage}</p>
            <button onClick={loadMore} disabled={loading || !hasMore} className="mt-4 py-2 px-4 bg-slate-700 disabled:bg-slate-300 text-white rounded-md m-4 text-h5">
              Load more
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
