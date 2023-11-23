import Button from "@mui/material/Button";
import * as React from "react"
import {useNavigate} from "react-router-dom";

export const ForgotPassword: React.FunctionComponent = ()  => {
  const navigate = useNavigate();


  return (
      <>
        <div>
          <Button onClick={() => {
            navigate("/login")
          }}>
            Not implemented yet! Go back
          </Button>
        </div>
      </>
  )
}