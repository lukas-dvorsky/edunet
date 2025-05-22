import React from "react";

interface Props {
  searchData: UserData[];
  returnData: boolean;
}

interface UserData {
  id: string;
  fname: string;
  lname: string;
  email: string;
  profilePicture: string;
}


function SearchResults({ searchData, returnData }: Props) {
  return (
    <ul className="mt-5 w-full rounded-md border border-b-0">
      {searchData.map((user) => {
        return (
          <li key={user.id} className="w-full hover:bg-gray-100">
            {!returnData ? (
              <a href={`/user/${user.id}`}>
                <div className="flex gap-5 border-b p-1">
                  <img
                    className="h-16 w-16 object-cover lg:h-20 lg:w-20"
                    src={`/images/${user.profilePicture}`}
                    alt=""
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-xl lg:text-2xl">{`${user.fname} ${user.lname}`}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </a>
            ) : (
              <a href={`/admin/${user.id}`}>
                <div className="flex gap-5 border-b p-1">
                  <img
                    className="h-16 w-16 object-cover lg:h-20 lg:w-20"
                    src={`/images/${user.profilePicture}`}
                    alt=""
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-xl lg:text-2xl">{`${user.fname} ${user.lname}`}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default SearchResults;
