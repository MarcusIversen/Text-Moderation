import Button from "@mui/material/Button";
// @ts-ignore
import * as React from "react"
import {useNavigate} from "react-router-dom";

export default function ForgotPassword() {
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