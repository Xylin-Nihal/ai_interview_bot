"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import api from "@/lib/api";
import { getResumeId } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorHandler";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
}

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = Number(searchParams.get("session_id"));
  const interviewTypeParam = searchParams.get("interview_type") || sessionStorage.getItem("interviewType") || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isFollowUpMode, setIsFollowUpMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resumeId = getResumeId();

  // Get interview type from query params or session storage
  const [interviewType, setInterviewType] = useState<string>(interviewTypeParam);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial question
  useEffect(() => {
    if (!sessionId || !resumeId || !interviewType) {
      if (!interviewType) {
        // Try to get interview type from session storage or redirect
        const storedType = sessionStorage.getItem("interviewType");
        if (storedType) {
          setInterviewType(storedType);
        } else {
          router.push("/interview-setup");
        }
      }
      return;
    }

    const fetchInitialQuestion = async () => {
      try {
        const response = await api.post("/interview/question", null, {
          params: {
            session_id: sessionId,
            interview_type: interviewType,
            resume_id: resumeId,
          },
        });

        if (response.data.message === "Interview completed") {
          setInterviewEnded(true);
          setMessages([
            {
              id: "end",
              type: "ai",
              content: "Interview completed! All 5 questions have been answered. You'll now see your feedback.",
              timestamp: new Date(),
            },
          ]);
          setTimeout(() => {
            router.push(`/feedback?session_id=${sessionId}`);
          }, 3000);
          return;
        }

        setCurrentQuestion(response.data.question);
        setQuestionCount(1);
        setIsFollowUpMode(false);
        setMessages([
          {
            id: "1",
            type: "ai",
            content: response.data.question,
            timestamp: new Date(),
          },
        ]);
      } catch (err: any) {
        setError(getErrorMessage(err));
        console.error(err);
      }
    };

    fetchInitialQuestion();
  }, [sessionId, resumeId, interviewType, router]);

  const handleSubmitAnswer = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);
    setError("");

    try {
      // Submit answer
      const answerResponse = await api.post("/interview/answer", {
        session_id: sessionId,
        question: currentQuestion,
        answer: inputValue,
      });

      // Check if there's a follow-up question
      if (answerResponse.data.follow_up_question) {
        setIsFollowUpMode(true);
        setCurrentQuestion(answerResponse.data.follow_up_question);
        const followUpMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: answerResponse.data.follow_up_question,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, followUpMessage]);
      } else {
        // Move to next main question
        setIsFollowUpMode(false);
        const response = await api.post("/interview/question", null, {
          params: {
            session_id: sessionId,
            interview_type: interviewType,
            resume_id: resumeId,
          },
        });

        if (response.data.message === "Interview completed") {
          setInterviewEnded(true);
          const endMessage: Message = {
            id: "end",
            type: "ai",
            content: "🎉 Interview completed! All 5 questions answered. Loading your detailed feedback...",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, endMessage]);
          setTimeout(() => {
            router.push(`/feedback?session_id=${sessionId}`);
          }, 3000);
        } else {
          setCurrentQuestion(response.data.question);
          setQuestionCount((prev) => prev + 1);
          const aiMessage: Message = {
            id: Date.now().toString(),
            type: "ai",
            content: response.data.question,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API handlers
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      // control flags
      (recognition as any).keepListening = true;
      (recognition as any).isRecognizing = false;

      recognition.onstart = () => {
        (recognition as any).isRecognizing = true;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        // only append final results to avoid duplicates from interim results
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        finalTranscript = finalTranscript.trim();
        if (finalTranscript) {
          setInputValue((prev) => (prev ? prev + " " + finalTranscript : finalTranscript));
        }
      };

      recognition.onerror = (ev: any) => {
        console.error("Speech recognition error", ev);
        const msg = ev?.error || ev?.message || JSON.stringify(ev) || "Speech recognition error";
        setError(msg);
      };

      recognition.onend = () => {
        (recognition as any).isRecognizing = false;
        // If keepListening is true, restart recognition so it stays active
        if ((recognition as any).keepListening) {
          try {
            if (!(recognition as any).isRecognizing) recognition.start();
          } catch (e) {
            // swallow start errors
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    try {
      // ensure keepListening is true so onend will restart
      recognitionRef.current.keepListening = true;
      recognitionRef.current.start();
      setIsListening(true);
      setError("");
    } catch (err) {
      console.error(err);
    }
  };

  const stopListening = () => {
    try {
      // tell recognition not to restart when it ends
      if (recognitionRef.current) recognitionRef.current.keepListening = false;
      recognitionRef.current?.stop();
    } catch (err) {
      console.error(err);
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  // Speak AI messages using Web Speech API (SpeechSynthesis)
  const speakText = (text: string) => {
    if (typeof window === "undefined") return;
    const synth = (window as any).speechSynthesis;
    if (!synth) return;
    try {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = 1.0;
      synth.speak(utter);
    } catch (err) {
      console.error("SpeechSynthesis error", err);
    }
  };

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last && last.type === "ai") {
      speakText(last.content);
    }
  }, [messages]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />

        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
          {/* Interview Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mock Interview</h1>
              <p className="text-gray-600 mt-1">Question {questionCount} of 5</p>
            </div>
            {!interviewEnded && (
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">
                  {(questionCount / 5 * 100).toFixed(0)}%
                </div>
                <p className="text-gray-600 text-sm">Progress</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {!interviewEnded && (
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${(questionCount / 5) * 100}%` }}
              ></div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 mb-6 overflow-y-auto space-y-4 max-h-96">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm lg:text-base">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.type === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!interviewEnded && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleSubmitAnswer();
                    }
                  }}
                  placeholder="Type your answer here..."
                  disabled={loading}
                  className="flex-1"
                />
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "primary" : "outline"}
                      size="md"
                      className={isListening ? "bg-red-500 border-red-500 text-white" : ""}
                      aria-label={isListening ? "Stop recording" : "Start recording"}
                    >
                      {isListening ? "🎤 Listening" : "🎤"}
                    </Button>

                    <Button
                      onClick={handleSubmitAnswer}
                      variant="primary"
                      size="md"
                      loading={loading}
                      disabled={!inputValue.trim() || loading}
                    >
                      Send
                    </Button>
                  </div>
              </div>
                <p className="text-xs text-gray-500">
                  Press Enter or click Send to submit your answer
                  {isListening && <span className="ml-3 text-sm text-red-600">Listening...</span>}
                </p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
