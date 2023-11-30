import Typography, { TypographyProps } from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from 'react';

export const Copyright: React.FunctionComponent<TypographyProps> = (props: TypographyProps) => {
  return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
          {new Date().getFullYear()}
          {' Copyright © '}
          <Link color="inherit" href="https://github.com/MarcusIversen" target="_blank">
            https://github.com/MarcusIversen
          </Link>{' '}
        </Typography>
  );
}