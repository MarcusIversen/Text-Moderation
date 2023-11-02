import React, {useState, useCallback} from 'react';
import axios from 'axios';
import {Button, CircularProgress, Input} from "@material-ui/core";

function App() {
    const [inputSentence, setInputSentence] = useState("");
    const [loading, setLoading] = useState(false);
    const [distilbertData, setDistilbertData] = useState(null);
    const [nsfwData, setNsfwData] = useState(null);
    const [moderationData, setModerationData] = useState(null);
    const [contactInfoData, setContactInfoData] = useState(null);
    const [addressesData, setAddressesData] = useState(null);

    // const staticInputSentence = "This sentence hits all bad categories. Sex, i hate you, lets fight, you are ugly, suicidal thoughts, children, throat is cut and bleeding. Marcus Iversen (351) 321 4455"

    const handleInputChange = (event) => {
        setInputSentence(event.target.value);
        console.log(inputSentence)
    }

    const fetchDistilbertResult = useCallback(async () => {
        setLoading(true);
        try {
            const result = await axios.post('http://localhost:3000/api/distilbert',
                {'inputs': inputSentence});
            setDistilbertData(result.data);
        } catch (error) {
            console.error("Error fetching Distilbert data:", error);
        }
        setLoading(false);
    }, [inputSentence]);

    const fetchNSFWData = useCallback(async () => {
        setLoading(true)
        try {
            const result = await axios.post('http://localhost:3000/api/nsfw',
                {'inputs': inputSentence});
            setNsfwData(result.data);
        } catch (error) {
            console.error("Error fetching NSFW data:", error);
        }
    }, [inputSentence])

    const fetchModerationData = useCallback(async () => {
        setLoading(true)
        try {
            const result = await axios.post('http://localhost:3000/api/moderation',
                {'inputs': inputSentence});
            setModerationData(result.data);
        } catch (error) {
            console.error("Error fetching Moderation data:", error);
        }
    }, [inputSentence])

    const fetchContactInfoData = useCallback(async () => {
        setLoading(true)
        try {
            const result = await axios.post('http://localhost:3000/api/contactInfo',
                {'inputs': inputSentence});
            setContactInfoData(result.data);
        } catch (error) {
            console.error("Error fetching ContactInfo data:", error);

        }

    }, [inputSentence])

    const fetchAddressesData = useCallback(async () => {
        setLoading(true)
        try {
            const result = await axios.post('http://localhost:3000/api/addresses',
                {'inputs': inputSentence});
            setAddressesData(result.data);
        } catch (error) {
            console.error("Error fetching Address data:", error);

        }

    }, [inputSentence])

    return (
        <div>
            <div style={{paddingLeft: 25}}>
                <h2>Write a sentence and do a moderation check</h2>
                <div>
                    <Input type="text" value={inputSentence} onChange={handleInputChange}
                           style={{width: 1000}}/>
                    <Button style={{backgroundColor: 'yellow', color: 'black'}} onClick={() => {
                        fetchDistilbertResult()
                        fetchNSFWData()
                        fetchModerationData()
                        fetchContactInfoData()
                        fetchAddressesData()
                    }}>
                        Moderation Search
                    </Button>
                </div>
                <br/>

                {loading && <CircularProgress/>}
                <br/>
                <Button style={{backgroundColor: 'blue', color: 'white'}}
                        onClick={fetchDistilbertResult}>Distilbert</Button>
                {distilbertData && <pre>{JSON.stringify(distilbertData, null, 2)}</pre>}


                <Button style={{backgroundColor: 'red', color: 'white'}} onClick={fetchNSFWData}>NSFW</Button>
                {nsfwData && <pre>{JSON.stringify(nsfwData, null, 2)}</pre>}

                <Button style={{backgroundColor: 'orange', color: 'white'}}
                        onClick={fetchModerationData}>Moderation</Button>
                {moderationData && <pre>{JSON.stringify(moderationData, null, 2)}</pre>}

                <Button style={{backgroundColor: 'green', color: 'white'}} onClick={fetchContactInfoData}>Contact
                    Info</Button>
                {contactInfoData && <pre>{JSON.stringify(contactInfoData, null, 2)}</pre>}

                <Button style={{backgroundColor: 'purple', color: 'white'}} onClick={fetchAddressesData}>Address
                    Info</Button>
                {addressesData && <pre>{JSON.stringify(addressesData, null, 2)}</pre>}
            </div>
        </div>

    );

}


export default App;
