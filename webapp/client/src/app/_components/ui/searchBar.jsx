import { Input } from "@nextui-org/react";

const SearchBar = ({ value, setValue }) => {
  return (
    <Input
      className="w-1/3"
      placeholder="Search inputs"
      value={value}
      key="search"
      onChange={(e) => setValue(e.target.value)}
    ></Input>
  );
};
export default SearchBar;
