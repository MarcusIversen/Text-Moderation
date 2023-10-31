import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN
const headers = {
    'Authorization': 'Bearer ' + HF_ACCESS_TOKEN,
    'Content-Type': 'application/json'
};

const data = {
    //  'inputs': 'Penis is the educational term for the male genitals'
    //  'inputs': "You're a complete idiot, can't you do anything right? By the way, I'm moving to 1234 Main St., Springfield, USA."
    //   'inputs': "This is a load of crap, I don't believe a word of it. My new number is (123) 456-7890."
    //   'inputs': "I hate everything about you, you're just the worst. I'm relocating to 5678 Oak Dr., Metropolis, USA."
    //   'inputs': "That movie was absolute garbage, I can't believe I wasted my time on it. Call me at (987) 654-3210."
    //   'inputs': "I don't give a damn about your opinion. You can find me at 9101 Pine Ln., Gotham, USA."
    //   'inputs': "You're nothing but a lazy good-for-nothing. Reach me at (456) 789-1234."
    //   'inputs':  "What the hell were you thinking, messing everything up like that? My new address is 1112 Elm St. Smallville, USA."
    //   'inputs': "This is the stupidest thing I've ever heard. Call me at (321) 654-9870."
    //   'inputs': "You're a complete and utter moron. I'm moving to 1314 Maple Ave., Star City, USA."
    //   'inputs': "I've seen snails move faster than you. My new number is (789) 123-4567."
    //   'inputs': "You're a worthless piece of junk. Find me at 4321 Willow Rd., Riverdale, USA."
    //   'inputs': "I don't give a flying cat about your problems. Call me at (234) 567-8901."
    //   'inputs': "This is bloody ridiculous, I can't stand it anymore. I'm relocating to 8765 Birch Blvd., Emerald City, USA."
    //   'inputs':  "What a load of bull, you're lying through your teeth. Reach me at (678) 901-2345, Im Martin Love your next dentist."
    //   'inputs': "What a load of great news about your teeth, i cant show you my phone number or my name"
    //   'inputs': "You're a bloody nuisance, can't you just leave me alone? My new home is 3456 Cedar Ct., Atlantis, USA."
    //   'inputs': "You're a bloody nuisance, can't you just leave me alone? My new home is Skolegade 8, 2.t.h. 6700, Esbjerg"
    //   'inputs' : "My name is Marcus Iversen, i'm a happy man that works at Åstvej 1. Every day i travel from Ohio 2"
    //   'inputs' : "My name is Marcus and i live in Orlando, Elm St. 123, 5541, phone: (321) 3123-212"
    //   'inputs' : "My name is John Doe and im from Stockholm, Sweden. Reach me at +4530229443"
    //   'inputs' : "This sentence hits all bad categories. Sex, i hate you, lets fight, you are ugly, suicidal thoughts, children, throat is cut and bleeding."
    'inputs' : "Hello everyone, this sentence is safe and i like flowers and Lego"
};

await axios.post('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', data, {headers: headers})
    .then((res) => {
        res.data[0].forEach(label => {
            if(label.score > 0.5) {
                console.log("distilbert", label);
            }
        });
    })
    .catch((error) => {
        console.error("distilbert", error);
    });


await axios.post('https://api-inference.huggingface.co/models/michellejieli/inappropriate_text_classifier', data, {headers: headers})
    .then((res) => {
        res.data[0].forEach(label => {
            if(label.score > 0.5) {
                console.log("NSFW_Classifier", label);
            }
        });
    })
    .catch((error) => {
        console.error("NSFW_Classifier", error);
    });

await axios.post('https://api-inference.huggingface.co/models/KoalaAI/Text-Moderation', data, {headers: headers})
    .then((res) => {
        res.data[0].forEach(label => {
            console.log("Moderation_Classifications", label);
        });
    })
    .catch((error) => {
        console.error("Moderation_Classifications", error);
    });

await axios.post('https://api-inference.huggingface.co/models/jakariamd/opp_115_privacy_contact_information', data, {headers: headers})
    .then((res) => {
        res.data[0].forEach(label => {
            if(label.score > 0.5) {
                console.log("private_information", label);
            }
        });
    })
    .catch((error) => {
        console.error("private_information", error);
    });

await axios.post('https://api-inference.huggingface.co/models/ctrlbuzz/bert-addresses', data, {headers: headers})
    .then((res) => {
        res.data.forEach(entity => {
            if(entity.score > 0.5) {
                console.log("bert-addresses", entity);
            }
        });
    })
    .catch((error) => {
        console.error("bert-addresses", error);
    });

