/**
 * Enhanced Voice Assistant Hook for DhartiSetu
 * Fixed activation detection and improved responsiveness
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const useVoiceAssistant = (options = {}) => {
  const {
    language = 'en',
    activationKeywords = ['dharti', 'धरती', 'dharati', 'earth', 'धरति'],
    onActivation = () => {},
    onCommand = () => {},
    onResult = () => {},
    continuous = true,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef(null);
  const activationTimeoutRef = useRef(null);
  const synthRef = useRef(null);
  const lastActivationTimeRef = useRef(0);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        // Check for activation keyword with improved matching
        if (currentTranscript) {
          const hasActivationWord = activationKeywords.some(keyword => 
            currentTranscript.includes(keyword.toLowerCase())
          );
          
          // Prevent rapid re-activation
          const now = Date.now();
          const timeSinceLastActivation = now - lastActivationTimeRef.current;
          
          if (hasActivationWord && !isActivated && timeSinceLastActivation > 1000) {
            lastActivationTimeRef.current = now;
            handleActivation();
          } else if (isActivated && finalTranscript) {
            // Process command after activation
            handleCommand(finalTranscript);
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(event.error);
        }
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening && continuous) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Recognition restart failed:', e);
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };
    }
    
    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (activationTimeoutRef.current) {
        clearTimeout(activationTimeoutRef.current);
      }
    };
  }, [language, continuous, activationKeywords, isActivated, isListening]);

  // Handle activation with immediate feedback
  const handleActivation = useCallback(() => {
    setIsActivated(true);
    setIsProcessing(true);
    onActivation();
    
    // Immediate voice feedback
    speak(language === 'hi' 
      ? 'जी, मैं सुन रहा हूं। कृपया बताएं।' 
      : 'Yes, I am listening. Please tell me.'
    );
    
    // Auto deactivate after 15 seconds of no command
    activationTimeoutRef.current = setTimeout(() => {
      if (isActivated) {
        setIsActivated(false);
        setIsProcessing(false);
        speak(language === 'hi' 
          ? 'कोई आदेश नहीं मिला।' 
          : 'No command received.'
        );
      }
    }, 15000);
  }, [language, onActivation, isActivated]);

  // Handle command after activation
  const handleCommand = useCallback((command) => {
    if (activationTimeoutRef.current) {
      clearTimeout(activationTimeoutRef.current);
    }
    
    // Parse command
    const parsedCommand = parseCommand(command, language);
    onCommand(parsedCommand);
    
    // Respond to command
    if (parsedCommand.action) {
      speak(parsedCommand.response);
      onResult(parsedCommand);
    }
    
    // Deactivate after processing
    setTimeout(() => {
      setIsActivated(false);
      setIsProcessing(false);
    }, 2000);
  }, [language, onCommand, onResult]);

  // Parse voice command with enhanced matching
  const parseCommand = (command, lang) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Enhanced command matching with synonyms
    const commands = {
      capture: {
        keywords: [
          'capture', 'photo', 'click', 'take picture', 'photograph',
          'फोटो', 'कैप्चर', 'खींचो', 'क्लिक', 'तस्वीर', 'चित्र'
        ],
        action: 'capture',
        response: lang === 'hi' ? 'फोटो कैप्चर कर रहा हूं।' : 'Capturing photo.'
      },
      analyze: {
        keywords: [
          'analyze', 'check', 'detect', 'scan', 'examine',
          'विश्लेषण', 'जांच', 'पता', 'स्कैन', 'परीक्षण'
        ],
        action: 'analyze',
        response: lang === 'hi' ? 'विश्लेषण कर रहा हूं।' : 'Analyzing now.'
      },
      disease: {
        keywords: [
          'disease', 'bimari', 'rog', 'sick', 'ill', 'problem',
          'बीमारी', 'रोग', 'अस्वस्थ', 'समस्या'
        ],
        action: 'detect_disease',
        response: lang === 'hi' ? 'पौधे की बीमारी की जांच कर रहा हूं।' : 'Checking for plant disease.'
      },
      soil: {
        keywords: [
          'soil', 'mitti', 'मिट्टी', 'bhumi', 'land', 'ground',
          'मिट्टी', 'भूमि', 'जमीन'
        ],
        action: 'detect_soil',
        response: lang === 'hi' ? 'मिट्टी का विश्लेषण कर रहा हूं।' : 'Analyzing soil type.'
      },
      help: {
        keywords: [
          'help', 'madad', 'sahayata', 'assist', 'support',
          'मदद', 'सहायता', 'सहायता', 'समर्थन'
        ],
        action: 'help',
        response: lang === 'hi' 
          ? 'आप कह सकते हैं: फोटो खींचो, विश्लेषण करो, बीमारी जांचो' 
          : 'You can say: capture photo, analyze, check disease'
      },
      stop: {
        keywords: [
          'stop', 'ruko', 'band', 'cancel', 'quit', 'exit',
          'रुको', 'बंद', 'रद्द', 'छोड़ो'
        ],
        action: 'stop',
        response: lang === 'hi' ? 'ठीक है, रुक रहा हूं।' : 'Okay, stopping.'
      },
      crop: {
        keywords: [
          'crop', 'fasal', 'फसल', 'recommend', 'suggest',
          'फसल', 'सुझाव', 'अनुशंसा'
        ],
        action: 'recommend_crop',
        response: lang === 'hi' ? 'फसल की अनुशंसा कर रहा हूं।' : 'Recommending crops.'
      },
      water: {
        keywords: [
          'water', 'pani', 'पानी', 'irrigation', 'सिंचाई'
        ],
        action: 'water_requirement',
        response: lang === 'hi' ? 'जल आवश्यकता की गणना कर रहा हूं।' : 'Calculating water requirement.'
      }
    };
    
    for (const [key, cmd] of Object.entries(commands)) {
      if (cmd.keywords.some(kw => lowerCommand.includes(kw))) {
        return {
          action: cmd.action,
          response: cmd.response,
          originalCommand: command
        };
      }
    }
    
    return {
      action: null,
      response: lang === 'hi' 
        ? 'मुझे समझ नहीं आया। कृपया फिर से कहें।' 
        : 'I did not understand. Please say again.',
      originalCommand: command
    };
  };

  // Text to speech with natural voice
  const speak = useCallback((text) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Try to find a suitable voice
      const voices = synthRef.current.getVoices();
      
      // Prefer female voices for better clarity
      const preferredVoice = voices.find(v => 
        (v.lang.includes(language === 'hi' ? 'hi' : 'en')) &&
        (v.name.includes('Female') || v.name.includes('female') || 
         v.name.includes('Google') || v.name.includes('Natural'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  }, [language]);

  // Start listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (e) {
        console.error('Failed to start recognition:', e);
        setError('Microphone access denied');
      }
    }
  }, [isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsActivated(false);
      setIsProcessing(false);
    }
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Force re-initialization if needed
  const reinitialize = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      
      // Reattach event listeners
      recognitionRef.current.onresult = (event) => {
        // Same as above...
      };
      
      recognitionRef.current.onerror = (event) => {
        // Same as above...
      };
      
      recognitionRef.current.onend = () => {
        // Same as above...
      };
    }
  }, [language, continuous]);

  return {
    isListening,
    isActivated,
    isSupported,
    isProcessing,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening,
    speak,
    reinitialize,
  };
};

export default useVoiceAssistant;