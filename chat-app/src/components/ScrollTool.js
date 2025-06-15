import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const ScrollableStack = styled(Stack)({
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '6px',
  },
});

const ScrollableBox = styled(Box)({
  overflowY: 'scroll',
  scrollbarWidth: 'thin', 
  scrollbarColor: '#888 transparent', 
  
  '&::-webkit-scrollbar-button': {
    display: 'none',
  },
  '&::-webkit-scrollbar-arrow': {
    backgroundColor: 'transparent', 
  },
  // Style scrollbar track
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },

  // Style scrollbar thumb
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '8px',
  },
});

export {ScrollableStack,ScrollableBox}