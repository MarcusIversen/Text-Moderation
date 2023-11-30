import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
// @ts-ignore
import * as React from 'react';

export function Copyright(props: any) {
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