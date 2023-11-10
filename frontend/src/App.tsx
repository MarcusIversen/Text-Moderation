import './App.css'
import axios from "axios";
import {Button, CircularProgress, Input} from "@mui/material";
import * as React from "react";
import {useCallback, useState} from "react";

const api = axios.create({
  baseURL: `http://localhost:3000/api/`,
});


function App() {

  const [inputSentence, setInputSentence] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    distilbert: null,
    nsfw: null,
    moderation: null,
    contactInfo: null,
    addresses: null,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSentence(event.target.value);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputSentence(event.target.value);
  };

  const fetchData = useCallback(async (endpoint : string) => {
    setLoading(true);
    try {
      const result = await api.post(endpoint, {inputs: inputSentence});
      setData((prevData) => ({...prevData, [endpoint]: result.data}));
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
    } finally {
      setLoading(false);
    }
  }, [inputSentence]);

  return (
      <>
        <div style={{paddingLeft: 25}}>
          <h2>Write a sentence and do a moderation check</h2>
          <div>
            <Input
                type="text"
                value={inputSentence}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                style={{width: 1000}}
            />
            <Button
                style={{backgroundColor: 'yellow', color: 'black'}}
                onClick={() => {
                  fetchData('distilbert')
                  fetchData('nsfw');
                  fetchData('moderation');
                  fetchData('contactInfo');
                  fetchData('addresses');
                }}
            >
              Moderation Search
            </Button>
          </div>
          <br/>

          {loading && <CircularProgress/>}
          <br/>
          <Button
              style={{backgroundColor: 'blue', color: 'white'}}
              onClick={() => fetchData('distilbert')}
          >
            Distilbert
          </Button>
          {data.distilbert && <pre>{JSON.stringify(data.distilbert, null, 2)}</pre>}

          <Button
              style={{backgroundColor: 'red', color: 'white'}}
              onClick={() => fetchData('nsfw')}
          >
            NSFW
          </Button>
          {data.nsfw && <pre>{JSON.stringify(data.nsfw, null, 2)}</pre>}

          <Button
              style={{backgroundColor: 'orange', color: 'white'}}
              onClick={() => fetchData('moderation')}
          >
            Moderation
          </Button>
          {data.moderation && <pre>{JSON.stringify(data.moderation, null, 2)}</pre>}

          <Button
              style={{backgroundColor: 'green', color: 'white'}}
              onClick={() => fetchData('contactInfo')}
          >
            Contact Info
          </Button>
          {data.contactInfo && <pre>{JSON.stringify(data.contactInfo, null, 2)}</pre>}

          <Button
              style={{backgroundColor: 'purple', color: 'white'}}
              onClick={() => fetchData('addresses')}
          >
            Address Info
          </Button>
          {data.addresses && <pre>{JSON.stringify(data.addresses, null, 2)}</pre>}
        </div>
      </>

  );
}

export default App;
