import React, {useCallback, useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Collapse,
    CssBaseline,
    Fade,
    FormGroup,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import {ThemeProvider} from "@mui/material/styles";
import {defaultTheme, errorTheme} from "../../assets/theme.ts";
import {SideBar} from "../../components/SideBar/SideBar.tsx";
import Cookies from "universal-cookie";
import {jwtDecode, JwtPayload} from "jwt-decode";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {AxiosError} from "axios";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import {ModerationService} from "../../services/ModerationService.ts";
import {useParams} from "react-router-dom";

interface TokenPayload extends JwtPayload {
    id?: string;
    firstName: string;
    lastName: string;
}


export const Home: React.FunctionComponent = () => {

    const {textInputId} = useParams(); // Add this line to get the 'id' parameter from the URL
    const cookies = new Cookies();
    const moderationService = new ModerationService();
    const cookie = cookies.get("AuthCookie");

    const [id, setId] = useState("");
    const [moderationTags, setModerationTags] = useState("");
    const [theme, setTheme] = useState(defaultTheme);
    const [textValue, setTextValue] = useState("");
    const [showWordStep, setShowWordStep] = useState(false);
    const [loadingWordStep, setLoadingWordStep] = useState(false);
    const [approvedWordStep, setApprovedWordStep] = useState(false);
    const [wordStepOver, setWordStepOver] = useState(false);
    const [showAIStep, setShowAIStep] = useState(false);
    const [loadingAIStep, setLoadingAIStep] = useState(false);
    const [approvedAIStep, setApprovedAIStep] = useState(false);
    const [AIStepOver, setAIStepOver] = useState(false);
    const [unclassifiableAIStep, setUnclassifiableAIStep] = useState(false);
    const [showManualStep, setShowManualStep] = useState(false);
    const [manualExpanded, setManualExpanded] = useState(false);
    const [pendingManualModeration, setPendingManualModeration] = useState(true);
    const [approveChecked, setApproveChecked] = useState(false);
    const [rejectChecked, setRejectChecked] = useState(false);
    const [approveReason, setApproveReason] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [approvedManualStep, setApprovedManualStep] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [prevTextInputId, setPrevTextInputId] = useState<string | null>(null);
    const [showManualStepForm, setShowManualStepForm] = useState(false);
    const [showManualStepResult, setShowManualStepResult] = useState(false);
    const [loadingManualModeration, setLoadingManualModeration] = useState(false);


    const fillTextInputInfo = useCallback(async () => {
        try {
            const textInput = await moderationService.getTextInputById(textInputId);
            const textLog = await moderationService.getTextLogById(textInputId);
            if (textLog) {
                setModerationTags(textLog.moderationTags);
            }

            // Check if the new textInput.textInput is different from the current textValue
            if (textValue !== textInput.textInput) {
                setTextValue(textInput.textInput);
            }

            setTheme(defaultTheme);
            setShowErrorMessage(false);
            setWordStepOver(true);
            setLoadingWordStep(false);
            setShowWordStep(true);

            if (textInput.step === "1: BadWord" && textInput.status === "pending" || !textLog) {
                setShowWordStep(false);
                setShowManualStep(false);
                setErrorMessage("Moderation of this text input is failed, choose another text input.");
                setShowErrorMessage(true);
                setTheme(errorTheme);
            }

            if (textInput.badWordStep === "rejected") {
                setApprovedWordStep(false);
                setShowAIStep(false);
                setShowManualStep(false);
            }

            if (textInput.badWordStep === "approved") {
                setShowAIStep(true);
                setApprovedWordStep(true);
                if (textInput.aiModerationStep === "approved") {
                    setUnclassifiableAIStep(false);
                    setApprovedAIStep(true);
                    setAIStepOver(true);
                    setLoadingAIStep(false);
                    setTimeout(() => {
                        setManualExpanded(prev => !prev);
                    }, 1200); // Adjust the delay as needed
                }
                if (textInput.aiModerationStep === "unclassifiable") {
                    setApprovedAIStep(false);
                    setUnclassifiableAIStep(true);
                    setAIStepOver(true);
                    setLoadingAIStep(false);
                    setShowManualStep(true);
                    if (textInput.manualModerationStep === "pending") {
                        setShowManualStep(true);
                        setShowManualStepResult(false);
                        setShowManualStepForm(true);
                        setTimeout(() => {
                            setManualExpanded(prev => !prev);
                        }, 1200); // Adjust the delay as needed
                    }
                }
                if (textInput.manualModerationStep === "approved") {
                    setUnclassifiableAIStep(true);
                    setShowManualStep(true);
                    setShowManualStepForm(false);
                    setShowManualStepResult(true);
                    setModerationTags(textLog.moderationTags);
                    setApprovedManualStep(true);
                    setPendingManualModeration(false);
                }
                if (textInput.manualModerationStep === "rejected") {
                    setUnclassifiableAIStep(true);
                    setShowManualStep(true);
                    setShowManualStepForm(false);
                    setShowManualStepResult(true);
                    setModerationTags(textLog.moderationTags);
                    setApprovedManualStep(false);
                    setPendingManualModeration(false);
                }
                if (textInput.manualModerationStep === "previouslyRejected") {
                    setUnclassifiableAIStep(true);
                    setAIStepOver(true);
                    setShowManualStep(false);
                    setShowManualStepForm(false);
                    setShowManualStepResult(false);
                    setModerationTags(textLog.moderationTags);
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [textInputId, textValue]);


    const handleApproveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setApproveChecked(true);
            setRejectChecked(false);
        } else {
            setApproveChecked(false);
        }
    };

    const handleRejectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setRejectChecked(true);
            setApproveChecked(false);
        } else {
            setRejectChecked(false);
        }
    };

    const handleApproveReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApproveReason(event.target.value);
    };

    const handleRejectReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRejectReason(event.target.value);
    };


    useEffect(() => {
        if (!textInputId) {
            moderationService.aiConnectionTest();
        } else if (textInputId !== prevTextInputId) {
            // Only fill the information if the textInputId has changed
            fillTextInputInfo();
            setPrevTextInputId(textInputId);
        }
    }, [textInputId, fillTextInputInfo, prevTextInputId]);


    if (!cookie) return;
    const decodedCookie = jwtDecode<TokenPayload>(cookie);

    const handleTextChange = (value: string) => {
        setTextValue(value);
    }

    const handleManualExpandClick = () => {
        setManualExpanded(!manualExpanded);
    };

    const handleApproveSubmit = async () => {
        setLoadingManualModeration(true);
        try {
            console.log(approveReason)

            setApprovedManualStep(true);
            setPendingManualModeration(false);

            if (!id) {
                await moderationService.approveTextInput(textInputId, approveReason)
            } else if (!textInputId) {
                await moderationService.approveTextInput(id, approveReason)
            }

            setTimeout(() => {
                setLoadingManualModeration(false);
            }, 1000);
        } catch (error) {
            console.error(error);
            throw error;
        }

    };

    const handleRejectSubmit = async () => {
        try {
            setApprovedManualStep(false);
            setPendingManualModeration(false);

            if (!id) {
                await moderationService.rejectTextInput(textInputId, rejectReason)
            } else if (!textInputId) {
                await moderationService.rejectTextInput(id, rejectReason)
            }
            setTimeout(() => {
                setLoadingManualModeration(false);
            }, 1000);
        } catch (error) {
            console.error(error);
            throw error;
        }

    };


    const submitTextInput = async () => {
        if ((textValue && showWordStep && showAIStep && showManualStep) || (textValue || showWordStep || showAIStep || showManualStep)) {
            setShowWordStep(false);
            setLoadingWordStep(false);
            setApprovedWordStep(false);
            setWordStepOver(false);

            setShowAIStep(false);
            setLoadingAIStep(false);
            setApprovedAIStep(false);
            setAIStepOver(false);
            setUnclassifiableAIStep(false);

            setShowManualStep(false);
            setManualExpanded(false);
            setPendingManualModeration(true);
            setApproveChecked(false);
            setRejectChecked(false);
            setApproveReason('');
            setRejectReason('');
            setApprovedManualStep(false);
            setTheme(defaultTheme);
            setShowErrorMessage(false);
        }

        try {
            const response = await moderationService.createAndProcessTextInput(decodedCookie.id, textValue);
            setId(response.id);
            setShowWordStep(true)
            setLoadingWordStep(true);


            const badWordPromise = await new Promise<{ approved: boolean }>((resolve) => {
                if (response.step === "BadWords") {
                    if (response.status === "approved") {
                        setTimeout(() => {
                            setWordStepOver(true);
                            resolve({approved: true}); // Simulate a successful response
                        }, 2000); // Simulate a delay
                    }
                    if (response.status === "rejected") {
                        setTimeout(() => {
                            setWordStepOver(true);
                            resolve({approved: false}); // Simulate a successful response
                        }, 2000); // Simulate a delay
                    }
                } else if (response.step === "AI") {
                    setTimeout(() => {
                        setWordStepOver(true);
                        resolve({approved: true}); // Simulate a successful response
                    }, 2000); // Simulate a delay
                }
            });

            setApprovedWordStep(badWordPromise.approved);
            setLoadingWordStep(false);
            setShowAIStep(badWordPromise.approved);
            setLoadingAIStep(true);


            const AIPromise = await new Promise<{ approved: boolean }>((resolve) => {
                if (response.step === "AI") {

                    if (response.status === "approved") {
                        setTimeout(() => {
                            setAIStepOver(true);
                            resolve({approved: true}); // Simulate a successful response
                        }, 3000); // Simulate a delay
                    }
                    if (response.status === "rejected") {
                        setTimeout(() => {
                            setAIStepOver(true);
                            resolve({approved: false}); // Simulate a successful response
                        }, 3000); // Simulate a delay
                    }
                    if (response.status === "unclassifiable") {
                        setTimeout(() => {
                            setAIStepOver(true);
                            setUnclassifiableAIStep(true);
                            setLoadingAIStep(false);
                            setShowManualStep(true);
                            setPendingManualModeration(true);
                            setShowManualStepForm(true);
                            setShowManualStepResult(false);
                        }, 3000); // Simulate a delay

                        setTimeout(() => {
                            setManualExpanded(prev => !prev);
                        }, 3400); // 0.4 sec after previous delay
                    }
                }
            });

            setApprovedAIStep(AIPromise.approved);

        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 500) {
                setErrorMessage("AI Moderation API is slow, try again after 5-20 seconds.");
                setShowErrorMessage(true);
                setTheme(errorTheme);
            } else if (axiosError.response && axiosError.response.status === 400) {
                setErrorMessage("400 Internal Server Error - Try another text input.");
                setShowErrorMessage(true);
                setTheme(errorTheme);
            } else {
                throw error;
            }
        } finally {
            setLoadingWordStep(false);
            setLoadingAIStep(false);
        }

    }


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box sx={{display: "flex", minHeight: "100vh"}}>
                <SideBar/>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        padding: 2,
                    }}
                >
                    <Typography variant="subtitle1" sx={{paddingBottom: 5}}>Automated Text Moderation
                        V1.0</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            flexGrow: 1,
                        }}
                    >
                        {textValue && !showErrorMessage && (
                            <Card sx={{
                                width: 1000,
                                borderRadius: 5,
                                backgroundColor: "rgba(39,51,51,0.31)"
                            }}>
                                <Typography sx={{
                                    fontWeight: "bold", display: 'flex',
                                    alignItems: 'center',
                                    paddingTop: 2,
                                    paddingLeft: 2
                                }}>
                                    Your Text Input:
                                    {textValue && !showWordStep && (
                                        <Box sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            paddingRight: 3,
                                            width: 25,
                                            height: 25,
                                        }}>
                                            <CircularProgress/>
                                        </Box>
                                    )}
                                </Typography>
                                <Typography sx={{
                                    marginBottom: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 2
                                }}>
                                    {textValue}
                                </Typography>

                            </Card>
                        )}

                        <Box sx={{paddingTop: 2}}>
                            {showWordStep && (
                                <Fade in timeout={750}>
                                    <Card
                                        sx={{
                                            width: 1000,
                                            borderRadius: 5,
                                            backgroundColor: "background.paper"
                                        }}>
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingTop: 2,
                                                paddingLeft: 2
                                            }}
                                            variant="h4">
                                            Step 1 - Bad Words Moderation check
                                            <Box sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3,
                                            }}>
                                                {loadingWordStep &&
                                                    <CircularProgress style={{width: 60, height: 60}}/>
                                                }
                                                {approvedWordStep && (
                                                    <CheckCircleIcon
                                                        sx={{height: 60, width: 60, color: "green"}}/>
                                                )}
                                                {!approvedWordStep && !loadingWordStep && (
                                                    <CancelIcon sx={{height: 60, width: 60, color: "red"}}/>
                                                )}
                                            </Box>
                                        </Typography>
                                        {wordStepOver && approvedWordStep && (
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3.5,
                                                fontSize: "small"
                                            }}>
                                                approved
                                            </Typography>)}

                                        {wordStepOver && !approvedWordStep && !loadingWordStep && (
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3.75,
                                                fontSize: "small"
                                            }}>
                                                rejected
                                            </Typography>)}
                                        <Typography sx={{paddingLeft: 1.2, paddingBottom: 1.5}}>
                                            <IconButton
                                                sx={{
                                                    color: "primary.main",
                                                    borderRadius: 1.75,
                                                    fontSize: 16, // You can adjust the font size as needed
                                                    width: 75, // You can adjust the width as needed
                                                    height: 25, // You can adjust the height as needed
                                                }}
                                                onClick={handleManualExpandClick}
                                                aria-expanded={manualExpanded}
                                                aria-label="show more"
                                            >
                                                {!manualExpanded && <ExpandMoreIcon/>}
                                                {manualExpanded && <ExpandLessIcon/>}
                                            </IconButton>
                                        </Typography>

                                        <Collapse in={manualExpanded} timeout="auto" unmountOnExit>
                                            {showManualStepResult && (<CardContent sx={{
                                                backgroundColor: "secondary.main",
                                                borderRadius: 1,
                                                boxShadow: 4,
                                                p: 3
                                            }}>
                                                <Typography variant="h5" sx={{color: "primary.main"}}>
                                                    Bad Words Moderation Result:
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    marginTop: 1,
                                                    backgroundColor: "info.main",
                                                    fontWeight: "bold",
                                                    fontSize: 15,
                                                    border: "1px solid",
                                                    borderColor: "primary.main",
                                                    borderRadius: 2,
                                                    padding: 2,
                                                }}>
                                                    {moderationTags}
                                                </Typography>
                                            </CardContent>)}
                                            {showManualStepForm && (
                                                <CardContent sx={{backgroundColor: "secondary.main"}}>
                                                    <Typography variant="h6" sx={{paddingLeft: 1, paddingTop: 1}}>
                                                        Text is unclassifiable - Approve/Reject manually</Typography>
                                                    <FormGroup
                                                        sx={{
                                                            paddingLeft: 5,
                                                            paddingTop: 1,
                                                            paddingRight: 5,
                                                            paddingBottom: 2
                                                        }}>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={approveChecked}
                                                                               onChange={handleApproveChange}/>}
                                                            label="Approve text"
                                                        />
                                                        {approveChecked && (
                                                            <Box sx={{paddingBottom: 4}}>
                                                                <TextField
                                                                    label="Approval Reasons"
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    fullWidth
                                                                    multiline={true}
                                                                    rows={2}
                                                                    value={approveReason}
                                                                    onChange={handleApproveReasonChange}
                                                                />
                                                                <Button variant="contained"
                                                                        onClick={handleApproveSubmit}>
                                                                    Submit Approval
                                                                </Button>
                                                            </Box>
                                                        )}
                                                        <FormControlLabel
                                                            control={<Checkbox checked={rejectChecked}
                                                                               onChange={handleRejectChange}/>}
                                                            label="Reject text"
                                                        />
                                                        {rejectChecked && (
                                                            <Box>
                                                                <TextField
                                                                    label="Rejection Reasons"
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    fullWidth
                                                                    multiline={true}
                                                                    rows={2}
                                                                    value={rejectReason}
                                                                    onChange={handleRejectReasonChange}
                                                                />
                                                                <Button variant="contained"
                                                                        onClick={handleRejectSubmit}>
                                                                    Submit Rejection
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </FormGroup>
                                                </CardContent>)}
                                        </Collapse>
                                    </Card>
                                </Fade>
                            )}
                        </Box>


                        <Box sx={{paddingTop: 3}}>
                            {showAIStep && !showErrorMessage && (
                                <Fade in timeout={750}>

                                    <Card
                                        sx={{
                                            width: 1000,
                                            height: 105,
                                            borderRadius: 5,
                                            backgroundColor: "background.paper"
                                        }}>
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingTop: 2,
                                                paddingLeft: 2
                                            }}
                                            variant="h4">
                                            Step 2 - AI Moderation check
                                            <Box sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3,
                                            }}>
                                                {unclassifiableAIStep && showManualStep &&
                                                    <CancelIcon
                                                        style={{height: 60, width: 60, color: "orange"}}/>
                                                }
                                                {loadingAIStep &&
                                                    <CircularProgress style={{width: 60, height: 60}}/>
                                                }
                                                {approvedAIStep && !unclassifiableAIStep &&(
                                                    <CheckCircleIcon
                                                        sx={{height: 60, width: 60, color: "green"}}/>
                                                )}
                                                {!approvedAIStep && !loadingAIStep && !unclassifiableAIStep && (
                                                    <CancelIcon sx={{height: 60, width: 60, color: "red"}}/>
                                                )}
                                            </Box>
                                        </Typography>
                                        {AIStepOver && approvedAIStep && !unclassifiableAIStep &&(
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3.5,
                                                fontSize: "small"
                                            }}>
                                                approved
                                            </Typography>)}

                                        {AIStepOver && !approvedAIStep && !loadingAIStep && !unclassifiableAIStep && (
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3.75,
                                                fontSize: "small"
                                            }}>
                                                rejected
                                            </Typography>)}
                                        {AIStepOver && unclassifiableAIStep && (
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 2,
                                                fontSize: "small"
                                            }}>
                                                unclassifiable
                                            </Typography>)}
                                    </Card>
                                </Fade>
                            )}
                        </Box>

                        <Box sx={{paddingTop: 3}}>
                            {showManualStep &&
                                <Fade in timeout={750}>
                                    <Card
                                        sx={{
                                            width: 1000,
                                            borderRadius: 5,
                                            backgroundColor: "background.paper"
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingTop: 2,
                                                paddingLeft: 2
                                            }}
                                            variant="h4">
                                            Step 3 - Manual Moderation
                                            <Box sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3,
                                            }}>
                                                {pendingManualModeration && !loadingManualModeration && (
                                                    <AccessTimeFilledIcon
                                                        sx={{height: 60, width: 60, color: "orange"}}/>
                                                )}
                                                {!approvedManualStep && !pendingManualModeration && !loadingManualModeration && (
                                                    <CancelIcon sx={{height: 60, width: 60, color: "red"}}/>
                                                )}
                                                {approvedManualStep && !pendingManualModeration && !loadingManualModeration && (
                                                    <CheckCircleIcon
                                                        sx={{height: 60, width: 60, color: "green"}}/>
                                                )}
                                                {loadingManualModeration && (
                                                    <CircularProgress style={{width: 45, height: 45}}/>
                                                )}
                                            </Box>
                                        </Typography>
                                        {pendingManualModeration && !loadingManualModeration && (
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 4,
                                                fontSize: "small"
                                            }}>
                                                pending
                                            </Typography>)}
                                        {!approvedManualStep && !pendingManualModeration && !loadingManualModeration && (
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3.75,
                                                fontSize: "small"
                                            }}>
                                                rejected
                                            </Typography>
                                        )}
                                        {approvedManualStep && !pendingManualModeration && !loadingManualModeration && (
                                            <Typography sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                paddingRight: 3.5,
                                                fontSize: "small"
                                            }}>
                                                approved
                                            </Typography>
                                        )}

                                        <Typography sx={{paddingLeft: 1.2, paddingBottom: 1.5}}>
                                            <IconButton
                                                sx={{
                                                    color: "primary.main",
                                                    borderRadius: 1.75,
                                                    fontSize: 16, // You can adjust the font size as needed
                                                    width: 75, // You can adjust the width as needed
                                                    height: 25, // You can adjust the height as needed
                                                }}
                                                onClick={handleManualExpandClick}
                                                aria-expanded={manualExpanded}
                                                aria-label="show more"
                                            >
                                                {!manualExpanded && <ExpandMoreIcon/>}
                                                {manualExpanded && <ExpandLessIcon/>}
                                            </IconButton>
                                        </Typography>

                                        <Collapse in={manualExpanded} timeout="auto" unmountOnExit>
                                            {showManualStepResult && (<CardContent sx={{
                                                backgroundColor: "secondary.main",
                                                borderRadius: 1,
                                                boxShadow: 4,
                                                p: 3
                                            }}>
                                                <Typography variant="h5" sx={{color: "primary.main"}}>
                                                    Manual Moderation Result:
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    marginTop: 1,
                                                    backgroundColor: "info.main",
                                                    fontWeight: "bold",
                                                    fontSize: 15,
                                                    border: "1px solid",
                                                    borderColor: "primary.main",
                                                    borderRadius: 2,
                                                    padding: 2,
                                                    height: 115
                                                }}>
                                                    {moderationTags}
                                                </Typography>
                                            </CardContent>)}
                                            {showManualStepForm && (
                                                <CardContent sx={{backgroundColor: "secondary.main"}}>
                                                    <Typography variant="h6" sx={{paddingLeft: 1, paddingTop: 1}}>
                                                        Text is unclassifiable - Approve/Reject manually</Typography>
                                                    <FormGroup
                                                        sx={{
                                                            paddingLeft: 5,
                                                            paddingTop: 1,
                                                            paddingRight: 5,
                                                            paddingBottom: 2
                                                        }}>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={approveChecked}
                                                                               onChange={handleApproveChange}/>}
                                                            label="Approve text"
                                                        />
                                                        {approveChecked && (
                                                            <Box sx={{paddingBottom: 4}}>
                                                                <TextField
                                                                    label="Approval Reasons"
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    fullWidth
                                                                    multiline={true}
                                                                    rows={2}
                                                                    value={approveReason}
                                                                    onChange={handleApproveReasonChange}
                                                                />
                                                                <Button variant="contained"
                                                                        onClick={handleApproveSubmit}>
                                                                    Submit Approval
                                                                </Button>
                                                            </Box>
                                                        )}
                                                        <FormControlLabel
                                                            control={<Checkbox checked={rejectChecked}
                                                                               onChange={handleRejectChange}/>}
                                                            label="Reject text"
                                                        />
                                                        {rejectChecked && (
                                                            <Box>
                                                                <TextField
                                                                    label="Rejection Reasons"
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    fullWidth
                                                                    multiline={true}
                                                                    rows={2}
                                                                    value={rejectReason}
                                                                    onChange={handleRejectReasonChange}
                                                                />
                                                                <Button variant="contained"
                                                                        onClick={handleRejectSubmit}>
                                                                    Submit Rejection
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </FormGroup>
                                                </CardContent>)}


                                        </Collapse>
                                    </Card>
                                </Fade>
                            }
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flexGrow: 1,
                            }}
                        >
                            {!showWordStep && !showErrorMessage && (
                                <Fade in timeout={1800}>
                                    <Box justifyContent="center" textAlign="center" paddingRight={1}>
                                        <img src={"../IconLogo.png"} alt="logo" width="86px" height="86px"
                                             style={{paddingRight: 1}}/>
                                        <Typography variant="h5" sx={{mt: 1}}>
                                            What text can I moderate today?
                                        </Typography>
                                    </Box>
                                </Fade>
                            )}
                            {showErrorMessage && (
                                <Fade in timeout={1800}>
                                    <Box justifyContent="center" textAlign="center">
                                        <Typography variant="h4"><ReportGmailerrorredIcon sx={{
                                            color: "error.main",
                                            width: 120,
                                            height: 120
                                        }}/></Typography>
                                        <Typography variant="h4">ERROR!</Typography>
                                        <Typography variant="body1" className={"heading"}>
                                            {errorMessage} {/* Display the error message */}
                                        </Typography>
                                    </Box>
                                </Fade>
                            )}

                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mt: 2,
                            }}
                        >
                            <TextField
                                helperText={
                                    "This text moderation platform is not perfect yet, it can be slow with a response, and it can make mistakes. Please use it with patience."
                                }
                                style={{width: 800}}
                                variant="outlined"
                                placeholder="Write text input here..."
                                multiline={true}
                                maxRows={4}
                                onBlur={(e) => {
                                    handleTextChange(e.target.value)
                                }}
                            />
                            <IconButton
                                color="primary"
                                size="large"
                                sx={{ml: 1, alignSelf: "flex-start"}}
                                onClick={() => submitTextInput()}
                            >
                                <SendIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

