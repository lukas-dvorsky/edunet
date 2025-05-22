import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import SearchResults from "./SearchResults";
import { useRouter } from "next/router";
import { CiSearch } from "react-icons/ci";

interface Props {
  initialSearch?: string | string[] | undefined;
  styles?: string;
  showInput: boolean;
  showWrongInput: boolean;
  returnData?: boolean;
}

function SearchInput({
  initialSearch,
  styles,
  showInput,
  showWrongInput,
  returnData = false,
}: Props) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const search = api.user.searchUser.useQuery((searchTerm as string) || "");

  useEffect(() => {
    const fetchData = () => {
      void search.refetch().then();
    };

    fetchData();
  }, [searchTerm, initialSearch, search]);

  return (
    <div className={`w-full ${styles}`}>
      <form
        onSubmit={(e) => {
          if (
            showInput ||
            searchTerm === undefined ||
            searchTerm.toString().trim() === ""
          ) {
            e.preventDefault();
          } else {
            void router.push(`/search/${searchTerm?.toString().trim()}`);
          }
        }}
        className="flex justify-center"
      >
        <input
          type="text"
          value={searchTerm}
          placeholder="Vyhledat..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full rounded-md border p-2 outline-none ${
            showWrongInput &&
            search.data?.length === 0 &&
            "text-gray-400 line-through"
          } ${!showInput && "rounded-l-md rounded-r-none border-r-0"}`}
        />
        {!showInput && (
          <button className="rounded-e-md border border-l-0 bg-white p-2 px-3">
            <CiSearch />
          </button>
        )}
      </form>
      {searchTerm !== "" && search.data?.length === 0 && <></>}
      {showInput && searchTerm !== "" && search.data !== undefined && (
        <SearchResults
          searchData={search.data}
          returnData={returnData}
        ></SearchResults>
      )}
    </div>
  );
}

export default SearchInput;
