import { styled } from "@mui/material/styles";

const SearchIconWrapper = styled("div")(({ theme }) => ({
    position: "absolute",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    height: "100%",
  }));

  export default SearchIconWrapper;