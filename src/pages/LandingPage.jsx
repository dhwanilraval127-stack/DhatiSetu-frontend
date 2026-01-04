import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, FiCheck, FiCamera, FiCloud, 
  FiTrendingUp, FiShield
} from 'react-icons/fi';
import { 
  GiPlantSeed, GiWheat, GiFarmTractor,
  GiPlantRoots 
} from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import Button from '../components/common/Button';

const LandingPage = () => {
  const { t, language } = useLanguage();
  const { detectLocation, location } = useLocation();

  useEffect(() => {
    if (!location) {
      detectLocation();
    }
  }, [location, detectLocation]);

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

  const features = [
    {
      icon: GiPlantSeed,
      title: getText(
        'Plant Disease Detection',
        'पौधों की बीमारी पहचान',
        'છોડના રોગની ઓળખ'
      ),
      desc: getText(
        'Upload plant images to detect diseases instantly using AI',
        'AI का उपयोग करके तुरंत बीमारियों का पता लगाने के लिए पौधों की छवियां अपलोड करें',
        'AI નો ઉપયોગ કરીને તરત જ રોગો શોધવા માટે છોડની છબીઓ અપલોડ કરો'
      ),
      color: 'from-green-500 to-emerald-600',
      link: '/plant-disease'
    },
    {
      icon: GiWheat,
      title: getText(
        'Crop Recommendation',
        'फसल सिफारिश',
        'પાક ભલામણ'
      ),
      desc: getText(
        'Get personalized crop suggestions based on your soil and climate',
        'अपनी मिट्टी और जलवायु के आधार पर व्यक्तिगत फसल सुझाव प्राप्त करें',
        'તમારી માટી અને આબોહવાના આધારે વ્યક્તિગત પાક સૂચનો મેળવો'
      ),
      color: 'from-amber-500 to-orange-600',
      link: '/crop-recommend'
    },
    {
      icon: FiCloud,
      title: getText(
        'Weather & Risk Analysis',
        'मौसम और जोखिम विश्लेषण',
        'હવામાન અને જોખમ વિશ્લેષણ'
      ),
      desc: getText(
        'Flood, storm, and rainfall predictions for your region',
        'आपके क्षेत्र के लिए बाढ़, तूफान और वर्षा की भविष्यवाणी',
        'તમારા પ્રદેશ માટે પૂર, તોફાન અને વરસાદની આગાહી'
      ),
      color: 'from-blue-500 to-cyan-600',
      link: '/flood-risk'
    },
    {
      icon: FiTrendingUp,
      title: getText(
        'Yield & Profit Prediction',
        'उपज और लाभ भविष्यवाणी',
        'ઉપજ અને નફાની આગાહી'
      ),
      desc: getText(
        'Estimate your expected yield and profit before planting',
        'बुवाई से पहले अपनी अपेक्षित उपज और लाभ का अनुमान लगाएं',
        'વાવણી પહેલાં તમારી અપેક્ષિત ઉપજ અને નફાનો અંદાજ લગાવો'
      ),
      color: 'from-purple-500 to-violet-600',
      link: '/yield-predict'
    },
    {
      icon: GiPlantRoots,
      title: getText(
        'Soil Analysis',
        'मिट्टी विश्लेषण',
        'માટી વિશ્લેષણ'
      ),
      desc: getText(
        'Detect soil type and assess soil health from images or data',
        'छवियों या डेटा से मिट्टी के प्रकार का पता लगाएं और मिट्टी के स्वास्थ्य का आकलन करें',
        'છબીઓ અથવા ડેટામાંથી માટીનો પ્રકાર શોધો અને માટીના સ્વાસ્થ્યનું મૂલ્યાંકન કરો'
      ),
      color: 'from-amber-600 to-yellow-600',
      link: '/soil-type'
    },
  ];

  const stats = [
    { 
      value: '15+', 
      label: getText('AI Models', 'AI मॉडल', 'AI મોડેલ')
    },
    { 
      value: '50+', 
      label: getText('Crops Supported', 'समर्थित फसलें', 'સમર્થિત પાકો')
    },
    { 
      value: '36', 
      label: getText('States Covered', 'राज्य कवर', 'રાજ્યો આવરી લીધા')
    },
    { 
      value: '24/7', 
      label: getText('Availability', 'उपलब्धता', 'ઉપલબ્ધતા')
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: getText('Enter Data', 'डेटा दर्ज करें', 'ડેટા દાખલ કરો'),
      desc: getText(
        'Upload image or fill the form',
        'छवि अपलोड करें या फॉर्म भरें',
        'છબી અપલોડ કરો અથવા ફોર્મ ભરો'
      ),
      icon: FiCamera
    },
    {
      step: '2',
      title: getText('AI Analysis', 'AI विश्लेषण', 'AI વિશ્લેષણ'),
      desc: getText(
        'Our AI models analyze your data',
        'हमारे AI मॉडल डेटा का विश्लेषण करते हैं',
        'અમારા AI મોડેલ તમારા ડેટાનું વિશ્લેષણ કરે છે'
      ),
      icon: GiPlantRoots
    },
    {
      step: '3',
      title: getText('Get Results', 'परिणाम प्राप्त करें', 'પરિણામો મેળવો'),
      desc: getText(
        'Receive detailed insights and advice',
        'विस्तृत सुझाव और सलाह प्राप्त करें',
        'વિગતવાર આંતરદૃષ્ટિ અને સલાહ મેળવો'
      ),
      icon: FiCheck
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-green-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm mb-6">
                <FiShield className="w-4 h-4 mr-2" />
                {getText(
                  'AI Technology for Farmers',
                  'किसानों के लिए AI तकनीक',
                  'ખેડૂતો માટે AI ટેકનોલોજી'
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {getText(
                  'Smart Farming with AI',
                  'AI के साथ स्मार्ट खेती',
                  'AI સાથે સ્માર્ટ ખેતી'
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                {getText(
                  'Empowering farmers with AI-powered insights for better crop management, disease detection, and yield prediction.',
                  'बेहतर फसल प्रबंधन, रोग पहचान और उपज भविष्यवाणी के लिए AI-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना।',
                  'વધુ સારા પાક વ્યવસ્થાપન, રોગ શોધ અને ઉપજ આગાહી માટે AI-સંચાલિત આંતરદૃષ્ટિ સાથે ખેડૂતોને સશક્ત બનાવવું.'
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    icon={FiArrowRight}
                    iconPosition="right"
                    className="bg-white text-primary-700 border-white hover:bg-gray-100 w-full sm:w-auto"
                  >
                    {getText('Get Started', 'शुरू करें', 'શરૂ કરો')}
                  </Button>
                </Link>
                
                <Link to="/plant-disease">
                  <Button 
                    variant="outline" 
                    size="lg"
                    icon={FiCamera}
                    className="border-white/50 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    {getText(
                      'Plant Disease Detection',
                      'पौधों की बीमारी पहचान',
                      'છોડના રોગની ઓળખ'
                    )}
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-yellow-400/30 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-400/30 rounded-full blur-xl" />
                
                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { 
                        icon: GiPlantSeed, 
                        label: getText('Disease Detection', 'रोग पहचान', 'રોગ શોધ')
                      },
                      { 
                        icon: GiWheat, 
                        label: getText('Crop Advice', 'फसल सुझाव', 'પાક સલાહ')
                      },
                      { 
                        icon: FiCloud, 
                        label: getText('Weather', 'मौसम', 'હવામાન')
                      },
                      { 
                        icon: GiFarmTractor, 
                        label: getText('Yield', 'उपज', 'ઉપજ')
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="bg-white/10 rounded-2xl p-4 text-center"
                      >
                        <item.icon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#f8faf8" 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-6 bg-white rounded-2xl shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {getText(
                'Why Choose DhartiSetu?',
                'DhartiSetu क्यों चुनें?',
                'DhartiSetu શા માટે પસંદ કરો?'
              )}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {getText(
                'Agricultural solutions powered by cutting-edge AI technology',
                'अत्याधुनिक AI तकनीक से संचालित कृषि समाधान',
                'અત્યાધુનિક AI ટેકનોલોજી દ્વારા સંચાલિત કૃષિ ઉકેલો'
              )}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
              >
                <Link to={feature.link}>
                  <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-primary-200">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {feature.desc}
                    </p>
                    
                    <div className="flex items-center text-primary-600 font-medium">
                      <span>
                        {getText('Get Started', 'शुरू करें', 'શરૂ કરો')}
                      </span>
                      <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {getText('How It Works?', 'कैसे काम करता है?', 'તે કેવી રીતે કામ કરે છે?')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-green-700 rounded-3xl p-8 md:p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {getText(
                'Start Using DhartiSetu Today',
                'आज ही DhartiSetu का उपयोग शुरू करें',
                'આજે જ DhartiSetu નો ઉપયોગ શરૂ કરો'
              )}
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              {getText(
                'Improve your farming with the power of AI. Use for free.',
                'AI की शक्ति से अपनी खेती को बेहतर बनाएं। मुफ्त में उपयोग करें।',
                'AI ની શક્તિથી તમારી ખેતીમાં સુધારો કરો. મફતમાં ઉપયોગ કરો.'
              )}
            </p>
            <Link to="/dashboard">
           <Button
  size="lg"
  icon={FiArrowRight}
  iconPosition="right"
  className="
    bg-green-700
    text-white
    px-10
    py-4
    rounded-full
    text-lg
    font-semibold
    shadow-xl
    flex
    items-center
    justify-center
    gap-3
    transition-none
  "
>
  {getText('Get Started', 'शुरू करें', 'શરૂ કરો')}
</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;