import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCamera,
  FiCloud,
  FiDroplet,
  FiTrendingUp,
  FiDollarSign,
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiPlay,
  FiBook,
  FiHelpCircle,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiSearch,
  FiHome,
  FiStar,
  FiDownload,
  FiShare2,
  FiSettings
} from 'react-icons/fi';
import {
  GiPlantSeed,
  GiWheat,
  GiPlantRoots,
  GiFarmTractor
} from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

const GuidePage = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function for multi-language text
  const getText = (en, hi, gu) => {
    switch (language) {
      case 'hi':
        return hi;
      case 'gu':
        return gu;
      default:
        return en;
    }
  };

  // Guide Sections
  const sections = [
    {
      id: 'getting-started',
      icon: FiPlay,
      title: getText('Getting Started', 'शुरुआत करें', 'શરૂઆત કરો'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'features',
      icon: FiStar,
      title: getText('Features Guide', 'सुविधाएं गाइड', 'સુવિધાઓ માર્ગદર્શિકા'),
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'tips',
      icon: FiCheckCircle,
      title: getText('Tips & Tricks', 'टिप्स और ट्रिक्स', 'ટિપ્સ અને ટ્રિક્સ'),
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'faq',
      icon: FiHelpCircle,
      title: getText('FAQs', 'अक्सर पूछे जाने वाले प्रश्न', 'વારંવાર પૂછાતા પ્રશ્નો'),
      color: 'from-purple-500 to-violet-600'
    },
   
  ];

  // Getting Started Steps
  const gettingStartedSteps = [
    {
      step: 1,
      icon: FiHome,
      title: getText('Open Dashboard', 'डैशबोर्ड खोलें', 'ડેશબોર્ડ ખોલો'),
      desc: getText(
        'Start by visiting the dashboard where all features are available',
        'डैशबोर्ड पर जाकर शुरू करें जहां सभी सुविधाएं उपलब्ध हैं',
        'ડેશબોર્ડની મુલાકાત લઈને શરૂ કરો જ્યાં બધી સુવિધાઓ ઉપલબ્ધ છે'
      )
    },
    {
      step: 2,
      icon: FiSettings,
      title: getText('Set Your Location', 'अपना स्थान सेट करें', 'તમારું સ્થાન સેટ કરો'),
      desc: getText(
        'Enable location for accurate weather and regional recommendations',
        'सटीक मौसम और क्षेत्रीय अनुशंसाओं के लिए स्थान सक्षम करें',
        'સચોટ હવામાન અને પ્રાદેશિક ભલામણો માટે સ્થાન સક્ષમ કરો'
      )
    },
    {
      step: 3,
      icon: FiCamera,
      title: getText('Capture or Upload', 'कैप्चर या अपलोड करें', 'કેપ્ચર અથવા અપલોડ કરો'),
      desc: getText(
        'Take photos of plants/soil or upload existing images',
        'पौधों/मिट्टी की फोटो लें या मौजूदा छवियां अपलोड करें',
        'છોડ/માટીના ફોટા લો અથવા હાલની છબીઓ અપલોડ કરો'
      )
    },
    {
      step: 4,
      icon: FiCheckCircle,
      title: getText('Get AI Results', 'AI परिणाम प्राप्त करें', 'AI પરિણામો મેળવો'),
      desc: getText(
        'Receive instant AI-powered analysis and recommendations',
        'तुरंत AI-संचालित विश्लेषण और अनुशंसाएं प्राप्त करें',
        'તાત્કાલિક AI-સંચાલિત વિશ્લેષણ અને ભલામણો પ્રાપ્ત કરો'
      )
    }
  ];

  // Feature Guides
  const featureGuides = [
    {
      id: 'plant-disease',
      icon: GiPlantSeed,
      title: getText('Plant Disease Detection', 'पौधे की बीमारी पहचान', 'છોડના રોગની ઓળખ'),
      color: 'from-green-500 to-emerald-600',
      path: '/plant-disease',
      steps: [
        getText(
          'Click on "Plant Disease" from dashboard',
          'डैशबोर्ड से "पौधे की बीमारी" पर क्लिक करें',
          'ડેશબોર્ડમાંથી "છોડનો રોગ" પર ક્લિક કરો'
        ),
        getText(
          'Take a clear photo of the affected plant leaf',
          'प्रभावित पौधे की पत्ती की स्पष्ट फोटो लें',
          'અસરગ્રસ્ત છોડના પાનનો સ્પષ્ટ ફોટો લો'
        ),
        getText(
          'Wait for AI to analyze the image',
          'AI द्वारा छवि का विश्लेषण करने की प्रतीक्षा करें',
          'AI દ્વારા છબીનું વિશ્લેષણ થવાની રાહ જુઓ'
        ),
        getText(
          'View disease name, cause, and treatment',
          'रोग का नाम, कारण और उपचार देखें',
          'રોગનું નામ, કારણ અને સારવાર જુઓ'
        )
      ],
      tips: [
        getText(
          'Ensure good lighting when taking photos',
          'फोटो लेते समय अच्छी रोशनी सुनिश्चित करें',
          'ફોટો લેતી વખતે સારી લાઇટિંગ સુનિશ્ચિત કરો'
        ),
        getText(
          'Focus on the affected area of the leaf',
          'पत्ती के प्रभावित क्षेत्र पर ध्यान दें',
          'પાનના અસરગ્રસ્ત વિસ્તાર પર ધ્યાન આપો'
        ),
        getText(
          'Take multiple photos for better accuracy',
          'बेहतर सटीकता के लिए कई फोटो लें',
          'વધુ સારી ચોકસાઈ માટે બહુવિધ ફોટા લો'
        )
      ]
    },
    {
      id: 'crop-recommend',
      icon: GiWheat,
      title: getText('Crop Recommendation', 'फसल अनुशंसा', 'પાક ભલામણ'),
      color: 'from-amber-500 to-orange-600',
      path: '/crop-recommend',
      steps: [
        getText(
          'Navigate to "Crop Recommendation"',
          '"फसल अनुशंसा" पर जाएं',
          '"પાક ભલામણ" પર જાઓ'
        ),
        getText(
          'Enter soil parameters (N, P, K, pH)',
          'मिट्टी के पैरामीटर (N, P, K, pH) दर्ज करें',
          'માટીના પરિમાણો (N, P, K, pH) દાખલ કરો'
        ),
        getText(
          'Add weather data or use auto-detect',
          'मौसम डेटा जोड़ें या ऑटो-डिटेक्ट का उपयोग करें',
          'હવામાન ડેટા ઉમેરો અથવા ઓટો-ડિટેક્ટનો ઉપયોગ કરો'
        ),
        getText(
          'Get personalized crop suggestions',
          'व्यक्तिगत फसल सुझाव प्राप्त करें',
          'વ્યક્તિગત પાક સૂચનો મેળવો'
        )
      ],
      tips: [
        getText(
          'Get soil tested for accurate values',
          'सटीक मूल्यों के लिए मिट्टी का परीक्षण करवाएं',
          'સચોટ મૂલ્યો માટે માટીનું પરીક્ષણ કરાવો'
        ),
        getText(
          'Consider seasonal variations',
          'मौसमी बदलावों पर विचार करें',
          'મોસમી ભિન્નતાઓને ધ્યાનમાં લો'
        )
      ]
    },
    {
      id: 'soil-analysis',
      icon: GiPlantRoots,
      title: getText('Soil Analysis', 'मिट्टी विश्लेषण', 'માટી વિશ્લેષણ'),
      color: 'from-amber-600 to-yellow-600',
      path: '/soil-type',
      steps: [
        getText(
          'Go to "Soil Type" or "Soil Health"',
          '"मिट्टी का प्रकार" या "मिट्टी स्वास्थ्य" पर जाएं',
          '"માટીનો પ્રકાર" અથવા "માટી સ્વાસ્થ્ય" પર જાઓ'
        ),
        getText(
          'Upload a clear image of your soil',
          'अपनी मिट्टी की स्पष्ट छवि अपलोड करें',
          'તમારી માટીની સ્પષ્ટ છબી અપલોડ કરો'
        ),
        getText(
          'AI identifies soil type automatically',
          'AI स्वचालित रूप से मिट्टी के प्रकार की पहचान करता है',
          'AI આપોઆપ માટીનો પ્રકાર ઓળખે છે'
        ),
        getText(
          'Get recommendations for soil improvement',
          'मिट्टी सुधार के लिए अनुशंसाएं प्राप्त करें',
          'માટી સુધારણા માટે ભલામણો મેળવો'
        )
      ],
      tips: [
        getText(
          'Take soil sample from 6 inches depth',
          '6 इंच गहराई से मिट्टी का नमूना लें',
          '6 ઇંચ ઊંડાઈમાંથી માટીનો નમૂનો લો'
        ),
        getText(
          'Ensure soil is dry when photographing',
          'फोटो लेते समय मिट्टी सूखी हो सुनिश्चित करें',
          'ફોટો લેતી વખતે માટી સૂકી હોવી જોઈએ'
        )
      ]
    },
    {
      id: 'weather-risk',
      icon: FiCloud,
      title: getText('Weather & Risk Analysis', 'मौसम और जोखिम विश्लेषण', 'હવામાન અને જોખમ વિશ્લેષણ'),
      color: 'from-blue-500 to-cyan-600',
      path: '/flood-risk',
      steps: [
        getText(
          'Select weather feature (Flood/Storm/Rainfall)',
          'मौसम सुविधा चुनें (बाढ़/तूफान/वर्षा)',
          'હવામાન સુવિધા પસંદ કરો (પૂર/તોફાન/વરસાદ)'
        ),
        getText(
          'Allow location access or enter manually',
          'स्थान पहुंच की अनुमति दें या मैन्युअल रूप से दर्ज करें',
          'સ્થાન ઍક્સેસની મંજૂરી આપો અથવા મેન્યુઅલી દાખલ કરો'
        ),
        getText(
          'View risk predictions and forecasts',
          'जोखिम भविष्यवाणी और पूर्वानुमान देखें',
          'જોખમ આગાહી અને અનુમાન જુઓ'
        ),
        getText(
          'Get safety recommendations',
          'सुरक्षा अनुशंसाएं प्राप्त करें',
          'સલામતી ભલામણો મેળવો'
        )
      ],
      tips: [
        getText(
          'Check weather daily during monsoon',
          'मानसून के दौरान दैनिक मौसम जांचें',
          'ચોમાસા દરમિયાન દરરોજ હવામાન તપાસો'
        ),
        getText(
          'Plan farming activities based on forecasts',
          'पूर्वानुमान के आधार पर खेती की गतिविधियों की योजना बनाएं',
          'અનુમાનના આધારે ખેતી પ્રવૃત્તિઓનું આયોજન કરો'
        )
      ]
    },
    {
      id: 'yield-price',
      icon: FiTrendingUp,
      title: getText('Yield & Price Prediction', 'उपज और मूल्य भविष्यवाणी', 'ઉપજ અને કિંમત આગાહી'),
      color: 'from-purple-500 to-violet-600',
      path: '/yield-predict',
      steps: [
        getText(
          'Go to "Yield Prediction" or "Price Prediction"',
          '"उपज भविष्यवाणी" या "मूल्य भविष्यवाणी" पर जाएं',
          '"ઉપજ આગાહી" અથવા "કિંમત આગાહી" પર જાઓ'
        ),
        getText(
          'Select your crop and region',
          'अपनी फसल और क्षेत्र चुनें',
          'તમારો પાક અને પ્રદેશ પસંદ કરો'
        ),
        getText(
          'Enter land area and other details',
          'भूमि क्षेत्र और अन्य विवरण दर्ज करें',
          'જમીન વિસ્તાર અને અન્ય વિગતો દાખલ કરો'
        ),
        getText(
          'Get yield estimate and market price forecast',
          'उपज अनुमान और बाजार मूल्य पूर्वानुमान प्राप्त करें',
          'ઉપજ અંદાજ અને બજાર કિંમત અનુમાન મેળવો'
        )
      ],
      tips: [
        getText(
          'Use historical data for better predictions',
          'बेहतर भविष्यवाणी के लिए ऐतिहासिक डेटा का उपयोग करें',
          'વધુ સારી આગાહી માટે ઐતિહાસિક ડેટાનો ઉપયોગ કરો'
        ),
        getText(
          'Consider market trends when planning',
          'योजना बनाते समय बाजार रुझानों पर विचार करें',
          'આયોજન કરતી વખતે બજારના વલણોને ધ્યાનમાં લો'
        )
      ]
    }
  ];

  // FAQs
  const faqs = [
    {
      q: getText(
        'Is DhartiSetu free to use?',
        'क्या DhartiSetu मुफ्त है?',
        'શું DhartiSetu મફત છે?'
      ),
      a: getText(
        'Yes, DhartiSetu is completely free for all farmers. All AI features are available without any charges.',
        'हां, DhartiSetu सभी किसानों के लिए पूरी तरह से मुफ्त है। सभी AI सुविधाएं बिना किसी शुल्क के उपलब्ध हैं।',
        'હા, DhartiSetu બધા ખેડૂતો માટે સંપૂર્ણપણે મફત છે. બધી AI સુવિધાઓ કોઈપણ ચાર્જ વિના ઉપલબ્ધ છે.'
      )
    },
    {
      q: getText(
        'How accurate is the plant disease detection?',
        'पौधे की बीमारी पहचान कितनी सटीक है?',
        'છોડના રોગની ઓળખ કેટલી સચોટ છે?'
      ),
      a: getText(
        'Our AI model has 90%+ accuracy for common plant diseases. For best results, ensure good image quality and lighting.',
        'हमारे AI मॉडल की सामान्य पौधों की बीमारियों के लिए 90%+ सटीकता है। सर्वोत्तम परिणामों के लिए, अच्छी छवि गुणवत्ता और प्रकाश सुनिश्चित करें।',
        'અમારા AI મોડેલની સામાન્ય છોડના રોગો માટે 90%+ ચોકસાઈ છે. શ્રેષ્ઠ પરિણામો માટે, સારી છબી ગુણવત્તા અને લાઇટિંગ સુનિશ્ચિત કરો.'
      )
    },
    {
      q: getText(
        'Does it work offline?',
        'क्या यह ऑफ़लाइन काम करता है?',
        'શું તે ઑફલાઇન કામ કરે છે?'
      ),
      a: getText(
        'Currently, DhartiSetu requires an internet connection for AI analysis. We are working on offline features for the future.',
        'वर्तमान में, AI विश्लेषण के लिए DhartiSetu को इंटरनेट कनेक्शन की आवश्यकता है। हम भविष्य के लिए ऑफ़लाइन सुविधाओं पर काम कर रहे हैं।',
        'હાલમાં, AI વિશ્લેષણ માટે DhartiSetu ને ઇન્ટરનેટ કનેક્શનની જરૂર છે. અમે ભવિષ્ય માટે ઑફલાઇન સુવિધાઓ પર કામ કરી રહ્યા છીએ.'
      )
    },
    {
      q: getText(
        'Which crops are supported?',
        'कौन सी फसलें समर्थित हैं?',
        'કયા પાકો સમર્થિત છે?'
      ),
      a: getText(
        'We support 50+ crops including Rice, Wheat, Cotton, Sugarcane, Tomato, Potato, and many more. Check the crop recommendation section for the full list.',
        'हम 50+ फसलों का समर्थन करते हैं जिसमें धान, गेहूं, कपास, गन्ना, टमाटर, आलू और कई अन्य शामिल हैं। पूरी सूची के लिए फसल अनुशंसा अनुभाग देखें।',
        'અમે 50+ પાકોને સમર્થન આપીએ છીએ જેમાં ચોખા, ઘઉં, કપાસ, શેરડી, ટામેટા, બટાકા અને ઘણા વધુનો સમાવેશ થાય છે. સંપૂર્ણ સૂચિ માટે પાક ભલામણ વિભાગ તપાસો.'
      )
    },
    {
      q: getText(
        'How to change language?',
        'भाषा कैसे बदलें?',
        'ભાષા કેવી રીતે બદલવી?'
      ),
      a: getText(
        'Click on the language selector in the navigation bar at the top. You can choose between English, Hindi, and Gujarati.',
        'शीर्ष पर नेविगेशन बार में भाषा चयनकर्ता पर क्लिक करें। आप अंग्रेजी, हिंदी और गुजराती के बीच चुन सकते हैं।',
        'ટોચ પર નેવિગેશન બારમાં ભાષા પસંદગીકાર પર ક્લિક કરો. તમે અંગ્રેજી, હિન્દી અને ગુજરાતી વચ્ચે પસંદ કરી શકો છો.'
      )
    },
    {
      q: getText(
        'Can I save my results?',
        'क्या मैं अपने परिणाम सहेज सकता हूं?',
        'શું હું મારા પરિણામો સાચવી શકું?'
      ),
      a: getText(
        'Yes, you can download or share your analysis results. Look for the download/share buttons on the results page.',
        'हां, आप अपने विश्लेषण परिणाम डाउनलोड या साझा कर सकते हैं। परिणाम पृष्ठ पर डाउनलोड/शेयर बटन देखें।',
        'હા, તમે તમારા વિશ્લેષણ પરિણામો ડાઉનલોડ અથવા શેર કરી શકો છો. પરિણામો પૃષ્ઠ પર ડાઉનલોડ/શેર બટન જુઓ.'
      )
    },
    {
      q: getText(
        'How is my data protected?',
        'मेरा डेटा कैसे सुरक्षित है?',
        'મારો ડેટા કેવી રીતે સુરક્ષિત છે?'
      ),
      a: getText(
        'Your data is encrypted and securely stored. We do not share your personal information with third parties.',
        'आपका डेटा एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत है। हम आपकी व्यक्तिगत जानकारी तीसरे पक्ष के साथ साझा नहीं करते हैं।',
        'તમારો ડેટા એન્ક્રિપ્ટેડ અને સુરક્ષિત રીતે સંગ્રહિત છે. અમે તમારી વ્યક્તિગત માહિતી તૃતીય પક્ષો સાથે શેર કરતા નથી.'
      )
    },
    {
      q: getText(
        'What should I do if I get wrong results?',
        'अगर मुझे गलत परिणाम मिलें तो क्या करूं?',
        'જો મને ખોટા પરિણામો મળે તો શું કરવું?'
      ),
      a: getText(
        'Try taking a clearer photo with better lighting. If the issue persists, contact our support team for assistance.',
        'बेहतर प्रकाश के साथ स्पष्ट फोटो लेने का प्रयास करें। यदि समस्या बनी रहती है, तो सहायता के लिए हमारी सहायता टीम से संपर्क करें।',
        'વધુ સારી લાઇટિંગ સાથે સ્પષ્ટ ફોટો લેવાનો પ્રયાસ કરો. જો સમસ્યા ચાલુ રહે, તો સહાય માટે અમારી સપોર્ટ ટીમનો સંપર્ક કરો.'
      )
    }
  ];

  // Tips
  const tips = [
    {
      icon: FiCamera,
      title: getText('Photo Quality', 'फोटो गुणवत्ता', 'ફોટો ગુણવત્તા'),
      tips: [
        getText('Use natural daylight for best results', 'सर्वोत्तम परिणामों के लिए प्राकृतिक दिन के उजाले का उपयोग करें', 'શ્રેષ્ઠ પરિણામો માટે કુદરતી દિવસના પ્રકાશનો ઉપયોગ કરો'),
        getText('Avoid shadows on the subject', 'विषय पर छाया से बचें', 'વિષય પર પડછાયા ટાળો'),
        getText('Keep camera steady and focused', 'कैमरा स्थिर और केंद्रित रखें', 'કેમેરા સ્થિર અને કેન્દ્રિત રાખો'),
        getText('Fill the frame with the leaf/soil', 'पत्ते/मिट्टी से फ्रेम भरें', 'પાન/માટીથી ફ્રેમ ભરો')
      ]
    },
    {
      icon: GiPlantSeed,
      title: getText('Disease Detection', 'रोग पहचान', 'રોગ શોધ'),
      tips: [
        getText('Photograph the most affected area', 'सबसे प्रभावित क्षेत्र की तस्वीर लें', 'સૌથી વધુ અસરગ્રસ્ત વિસ્તારનો ફોટો લો'),
        getText('Include both healthy and diseased parts', 'स्वस्थ और रोगग्रस्त दोनों भागों को शामिल करें', 'સ્વસ્થ અને રોગગ્રસ્ત બંને ભાગોનો સમાવેશ કરો'),
        getText('Check plants early morning', 'सुबह जल्दी पौधों की जांच करें', 'વહેલી સવારે છોડ તપાસો'),
        getText('Regular weekly scanning prevents losses', 'नियमित साप्ताहिक स्कैनिंग नुकसान रोकती है', 'નિયમિત સાપ્તાહિક સ્કેનિંગ નુકસાન અટકાવે છે')
      ]
    },
    {
      icon: FiCloud,
      title: getText('Weather Planning', 'मौसम योजना', 'હવામાન આયોજન'),
      tips: [
        getText('Check forecasts before irrigation', 'सिंचाई से पहले पूर्वानुमान जांचें', 'સિંચાઈ પહેલાં અનુમાન તપાસો'),
        getText('Plan pesticide spraying on dry days', 'सूखे दिनों में कीटनाशक छिड़काव की योजना बनाएं', 'સૂકા દિવસોમાં જંતુનાશક છંટકાવનું આયોજન કરો'),
        getText('Monitor flood risks during monsoon', 'मानसून के दौरान बाढ़ जोखिम की निगरानी करें', 'ચોમાસા દરમિયાન પૂરના જોખમોનું નિરીક્ષણ કરો'),
        getText('Protect crops before storms', 'तूफान से पहले फसलों की रक्षा करें', 'તોફાન પહેલાં પાકનું રક્ષણ કરો')
      ]
    },
    {
      icon: FiTrendingUp,
      title: getText('Market Planning', 'बाजार योजना', 'બજાર આયોજન'),
      tips: [
        getText('Check price trends before harvesting', 'कटाई से पहले मूल्य रुझान जांचें', 'લણણી પહેલાં કિંમતના વલણો તપાસો'),
        getText('Store produce if prices are low', 'कम कीमत होने पर उपज का भंडारण करें', 'કિંમત ઓછી હોય તો ઉપજનો સંગ્રહ કરો'),
        getText('Plan crops based on demand', 'मांग के आधार पर फसलों की योजना बनाएं', 'માંગના આધારે પાકનું આયોજન કરો'),
        getText('Diversify crops for stable income', 'स्थिर आय के लिए फसलों में विविधता लाएं', 'સ્થિર આવક માટે પાકમાં વિવિધતા લાવો')
      ]
    }
  ];

  // Support contacts
  const supportOptions = [
    {
      icon: FiPhone,
      title: getText('Helpline', 'हेल्पलाइन', 'હેલ્પલાઈન'),
      value: '1800-XXX-XXXX',
      desc: getText('Toll-free, 24/7', 'टोल-फ्री, 24/7', 'ટોલ-ફ્રી, 24/7'),
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FiMail,
      title: getText('Email', 'ईमेल', 'ઈમેલ'),
      value: 'support@dhartisetu.com',
      desc: getText('Response within 24 hours', '24 घंटे के भीतर जवाब', '24 કલાકની અંદર જવાબ'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiMessageCircle,
      title: getText('WhatsApp', 'व्हाट्सएप', 'વોટ્સએપ'),
      value: '+91 XXXXX XXXXX',
      desc: getText('Quick support', 'त्वरित सहायता', 'ઝડપી સહાય'),
      color: 'bg-emerald-100 text-emerald-600'
    }
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gettingStartedSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FiCamera, label: getText('Scan Plant', 'पौधा स्कैन करें', 'છોડ સ્કેન કરો'), path: '/plant-disease' },
                { icon: GiWheat, label: getText('Crop Advice', 'फसल सलाह', 'પાક સલાહ'), path: '/crop-recommend' },
                { icon: FiCloud, label: getText('Weather', 'मौसम', 'હવામાન'), path: '/flood-risk' },
                { icon: FiTrendingUp, label: getText('Yield', 'उपज', 'ઉપજ'), path: '/yield-predict' }
              ].map((item, idx) => (
                <Link key={idx} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary-200 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            {featureGuides.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Feature Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                      </div>

                      {/* Steps */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-semibold text-gray-700">
                          {getText('How to Use:', 'कैसे उपयोग करें:', 'કેવી રીતે ઉપયોગ કરવો:')}
                        </h4>
                        {feature.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-xs flex-shrink-0">
                              {sIdx + 1}
                            </span>
                            <span className="text-gray-600 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="lg:w-80 bg-amber-50 rounded-xl p-4">
                      <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <FiInfo className="w-4 h-4" />
                        {getText('Pro Tips', 'प्रो टिप्स', 'પ્રો ટિપ્સ')}
                      </h4>
                      <ul className="space-y-2">
                        {feature.tips.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2 text-sm text-amber-700">
                            <FiCheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Try Now Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link to={feature.path}>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={FiArrowRight}
                        iconPosition="right"
                      >
                        {getText('Try Now', 'अभी आज़माएं', 'હવે અજમાવો')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'tips':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{category.title}</h3>
                </div>

                <ul className="space-y-3">
                  {category.tips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-3">
                      <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={getText('Search FAQs...', 'प्रश्न खोजें...', 'પ્રશ્નો શોધો...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-800">{faq.q}</span>
                    {openFaq === idx ? (
                      <FiChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-0">
                          <div className="bg-primary-50 rounded-lg p-4 text-gray-700 text-sm">
                            {faq.a}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <FiHelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {getText('No FAQs found', 'कोई प्रश्न नहीं मिला', 'કોઈ પ્રશ્નો મળ્યા નથી')}
                </p>
              </div>
            )}
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportOptions.map((option, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
                >
                  <div className={`w-14 h-14 ${option.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <option.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{option.title}</h3>
                  <p className="text-primary-600 font-medium mb-1">{option.value}</p>
                  <p className="text-sm text-gray-500">{option.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Feedback Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {getText('Send Feedback', 'प्रतिक्रिया भेजें', 'પ્રતિસાદ મોકલો')}
              </h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getText('Your Name', 'आपका नाम', 'તમારું નામ')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder={getText('Enter your name', 'अपना नाम दर्ज करें', 'તમારું નામ દાખલ કરો')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getText('Email / Phone', 'ईमेल / फोन', 'ઈમેલ / ફોન')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder={getText('Enter email or phone', 'ईमेल या फोन दर्ज करें', 'ઈમેલ અથવા ફોન દાખલ કરો')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getText('Message', 'संदेश', 'સંદેશ')}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    placeholder={getText('Write your message...', 'अपना संदेश लिखें...', 'તમારો સંદેશ લખો...')}
                  />
                </div>
                
                <Button
                  variant="primary"
                  size="md"
                  icon={FiArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto"
                >
                  {getText('Send Message', 'संदेश भेजें', 'સંદેશ મોકલો')}
                </Button>
              </form>
            </div>

            {/* App Info */}
            <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">DhartiSetu</h3>
                  <p className="text-sm text-gray-600">
                    {getText('Version 1.0.0', 'संस्करण 1.0.0', 'સંસ્કરણ 1.0.0')}
                  </p>
                </div>
                <div className="flex gap-3">
                 
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FiBook className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {getText('Help & Guide', 'मदद और गाइड', 'મદદ અને માર્ગદર્શિકા')}
              </h1>
              <p className="text-gray-600 text-sm">
                {getText(
                  'Learn how to use DhartiSetu effectively',
                  'DhartiSetu का प्रभावी ढंग से उपयोग करना सीखें',
                  'DhartiSetu નો અસરકારક રીતે ઉપયોગ કરવાનું શીખો'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeSection === section.id
                        ? `bg-gradient-to-br ${section.color} text-white`
                        : 'bg-gray-100'
                    }`}>
                      <section.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Action */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link to="/dashboard">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={FiArrowRight}
                    iconPosition="right"
                    className="w-full"
                  >
                    {getText('Go to Dashboard', 'डैशबोर्ड पर जाएं', 'ડેશબોર્ડ પર જાઓ')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;