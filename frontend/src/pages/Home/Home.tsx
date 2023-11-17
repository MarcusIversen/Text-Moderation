import axios from "axios";
import {Button, CircularProgress, Input} from "@mui/material";
import * as React from "react";
import {useCallback, useState} from "react";

const api = axios.create({
  baseURL: `http://localhost:3000/api/`,
});


function Home() {

  const [inputSentence, setInputSentence] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    distilbert: null,
    nsfw: null,
    moderation: null,
    contactInfo: null,
    addresses: null,
    "check-bad-words": null
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSentence(event.target.value);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setInputSentence(event.target.value);
  };

  const fetchPost = useCallback(async (endpoint: string) => {
    if (inputSentence === '' || inputSentence == ' ') {
      return;
    }
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


  const fetchGet = useCallback(async (endpoint: string, params = {sentence: inputSentence}) => {
    setLoading(true);
    try {
      const result = await api.get(endpoint, {params});
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
                  fetchGet('check-bad-words')
                  fetchPost('distilbert')
                  fetchPost('nsfw');
                  fetchPost('moderation');
                  fetchPost('contactInfo');
                }}
            >
              Moderation Search
            </Button>
          </div>
          <br/>

          {loading && <CircularProgress/>}
          <br/>
          <Button
              style={{backgroundColor: 'purple', color: 'white'}}
              onClick={() => fetchGet('check-bad-words', {sentence: inputSentence})}
          >
            Check Bad Words
          </Button>
          {data['check-bad-words'] && <pre>{JSON.stringify(data['check-bad-words'], null, 2)}</pre>}
          <Button
              style={{backgroundColor: 'blue', color: 'white'}}
              onClick={() => fetchPost('distilbert')}
          >
            Distilbert
          </Button>
          {data.distilbert && <pre>{JSON.stringify(data.distilbert, null, 2)}</pre>}

          <Button
              style={{backgroundColor: 'red', color: 'white'}}
              onClick={() => fetchPost('nsfw')}
          >
            NSFW
          </Button>
          {data.nsfw && <pre>{JSON.stringify(data.nsfw, null, 2)}</pre>}

          <Button
              style={{backgroundColor: 'orange', color: 'white'}}
              onClick={() => fetchPost('moderation')}
          >
            Moderation
          </Button>
          {data.moderation && <pre>{JSON.stringify(data.moderation, null, 2)}</pre>}

          <Button
              style={{backgroundColor: 'green', color: 'white'}}
              onClick={() => fetchPost('contactInfo')}
          >
            Contact Info
          </Button>
          {data.contactInfo && <pre>{JSON.stringify(data.contactInfo, null, 2)}</pre>}


        </div>
      </>

  );
}

export default Home;
