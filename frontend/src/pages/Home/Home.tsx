import axios from "axios";
import { Button, CircularProgress, Input } from "@mui/material";
import * as React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const api = axios.create({
  baseURL: `http://localhost:3000/api/`,
});

export const Home: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    distilbert: null,
    nsfw: null,
    moderation: null,
    contactInfo: null,
    addresses: null,
    "moderation/bad-words-check": null,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const logOut = () => {
    setLoading(true);
    localStorage.clear();
    cookies.remove("AuthCookie");
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2000);
  };

  const fetchPost = useCallback(
    async (endpoint: string) => {
      if (input === "" || input == " ") {
        return;
      }
      setLoading(true);
      try {
        const result = await api.post(endpoint, { inputs: input });
        setData((prevData) => ({ ...prevData, [endpoint]: result.data }));
      } catch (error) {
        console.error(`Error fetching ${endpoint} data:`, error);
      } finally {
        setLoading(false);
      }
    },
    [input],
  );

  return (
    <>
      <div style={{ paddingLeft: 25 }}>
        <Button
          style={{ backgroundColor: "Teal", color: "black" }}
          onClick={() => logOut()}
        >
          Log out
        </Button>
        <h2>Write a sentence and do a moderation check</h2>
        <div>
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            style={{ width: 1000 }}
          />
          <Button
            style={{ backgroundColor: "yellow", color: "black" }}
            onClick={() => {
              fetchPost("moderation/bad-words-check");
              fetchPost("distilbert");
              fetchPost("nsfw");
              fetchPost("moderation");
              fetchPost("contactInfo");
            }}
          >
            Moderation Search
          </Button>
        </div>
        <br />

        {loading && <CircularProgress />}
        <br />
        <Button
          style={{ backgroundColor: "purple", color: "white" }}
          onClick={() => fetchPost("moderation/bad-words-check")}
        >
          Check Bad Words
        </Button>
        {data["moderation/bad-words-check"] && (
          <pre>
            {JSON.stringify(data["moderation/bad-words-check"], null, 2)}
          </pre>
        )}
        <Button
          style={{ backgroundColor: "blue", color: "white" }}
          onClick={() => fetchPost("distilbert")}
        >
          Distilbert
        </Button>
        {data.distilbert && (
          <pre>{JSON.stringify(data.distilbert, null, 2)}</pre>
        )}

        <Button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => fetchPost("nsfw")}
        >
          NSFW
        </Button>
        {data.nsfw && <pre>{JSON.stringify(data.nsfw, null, 2)}</pre>}

        <Button
          style={{ backgroundColor: "orange", color: "white" }}
          onClick={() => fetchPost("moderation")}
        >
          Moderation
        </Button>
        {data.moderation && (
          <pre>{JSON.stringify(data.moderation, null, 2)}</pre>
        )}

        <Button
          style={{ backgroundColor: "green", color: "white" }}
          onClick={() => fetchPost("contactInfo")}
        >
          Contact Info
        </Button>
        {data.contactInfo && (
          <pre>{JSON.stringify(data.contactInfo, null, 2)}</pre>
        )}
      </div>
    </>
  );
};
