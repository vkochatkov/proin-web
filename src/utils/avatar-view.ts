import { red, blue, green, yellow } from '@mui/material/colors';

const colorShade = 700;
const colors = [
  red[colorShade],
  blue[colorShade],
  green[colorShade],
  yellow[colorShade],
];

export const backgroundColor = (firstLetter: string) => {
  const index = firstLetter.charCodeAt(0) % colors.length;
  return colors[index];
};
