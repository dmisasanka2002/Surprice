import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Component for the animated last message
const AnimatedLastMessage = ({ message }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const words = message.split(' ');
  
  // Colors for the words - feel free to adjust these
  const wordColors = [
    "text-blue-500", "text-purple-500", "text-pink-500", 
    "text-rose-500", "text-amber-500", "text-emerald-500"
  ];
  
  useEffect(() => {
    let wordTimer;
    
    if (currentWordIndex < words.length) {
      // Show each word for 2.5 seconds (including animation time)
      wordTimer = setTimeout(() => {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
      }, 2500);
    } else if (currentWordIndex === words.length && !showFullMessage) {
      // When all words have been shown individually, show the full message
      wordTimer = setTimeout(() => {
        setShowFullMessage(true);
      }, 1000);
    }
    
    return () => {
      if (wordTimer) clearTimeout(wordTimer);
    };
  }, [currentWordIndex, words.length, showFullMessage]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {/* Individual word animations */}
      {!showFullMessage && (
        <AnimatePresence mode="wait">
          {currentWordIndex < words.length && (
            <motion.div
              key={currentWordIndex}
              className={`text-6xl md:text-7xl font-bold ${wordColors[currentWordIndex % wordColors.length]}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0.8, 1.1, 1, 0.9],
                y: [20, 0, 0, -20]
              }}
              transition={{ 
                duration: 2.3,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut"
              }}
            >
              {words[currentWordIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Full message animation */}
      {showFullMessage && (
        <motion.div 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};




const UltraRomanticExperience = () => {
  // State management
  const [stage, setStage] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [mouseEntered, setMouseEntered] = useState(false);
  const [revealedHearts, setRevealedHearts] = useState([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [finalMessageIndex, setFinalMessageIndex] = useState(0);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const heartParticlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [audio] = useState(new Audio("/Surprice/romantic_music.mp3"));

  useEffect(() => {
    audio.loop = true;
  }, [audio]);

  const scenes = [
    {
      image: "/Surprice/image.jpg",
      title: "The First Time",
      poem: "In that moment when our eyes first met,\nTime stood still, and I'll never forget.\nThe universe aligned just for us,\nIn that magical moment, I began to trust.",
    },
    {
      image: "/Surprice/image2.jpg",
      title: "Our Journey",
      poem: "Through valleys and peaks, together we've grown,\nIn laughter and tears, a love we've shown.\nEvery challenge faced has only proved,\nHow deeply and truly my heart has moved.",
    },
    {
      image: "/Surprice/image3.jpg",
      title: "Perfect Moments",
      poem: "Little whispers and midnight talks,\nHolding hands during our evening walks.\nThese perfect moments with you each day,\nGive my life meaning in every way.",
    },
    {
      image: "/Surprice/image2.jpg",
      title: "Dreams Together",
      poem: "Dreams once lone now intertwined,\nA future together, lovingly designed.\nWith you by my side, I've come to see,\nThe beautiful life that's meant to be.",
    },
    {
      image: "/Surprice/image.jpg",
      title: "Forever Yours",
      poem: "My heart is yours, now and always,\nFor all our nights and all our days.\nIn your love I've found my home,\nWith you, I'll never be alone.",
    },
  ];

  const finalMessages = [
    "You are the poetry in my soul, the rhythm in my heart, and the meaning in my life. Every day with you is a gift I cherish more than words can express. I love you beyond the boundaries of time and space, beyond the depths of the oceans, and beyond the infinite stars in the sky. You are my everything.",
    "I Love You ",
  ];

  // Setup canvas and animation loop
  useEffect(() => {
    if (stage === 2 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Initialize heart particles
      heartParticlesRef.current = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        speedX: Math.random() * 2 - 1,
        speedY: -Math.random() * 2 - 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.05 - 0.025,
        hue: Math.random() * 60 + 330, // Pink to red hues
        opacity: Math.random() * 0.7 + 0.3,
      }));

      const drawHeart = (x, y, size, rotation, hue, opacity) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(size / 30, size / 30);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10, -10, -10, -20, 0, -20);
        ctx.bezierCurveTo(10, -20, 10, -10, 0, 0);
        ctx.bezierCurveTo(10, -10, 20, -10, 20, 0);
        ctx.bezierCurveTo(20, 10, 10, 20, 0, 10);
        ctx.bezierCurveTo(-10, 20, -20, 10, -20, 0);
        ctx.bezierCurveTo(-20, -10, -10, -10, 0, 0);
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
      };

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update particles
        heartParticlesRef.current.forEach((heart) => {
          heart.x += heart.speedX;
          heart.y += heart.speedY;
          heart.rotation += heart.rotationSpeed;

          // Reset position if out of bounds
          if (heart.y < -heart.size) {
            heart.y = canvas.height + heart.size;
            heart.x = Math.random() * canvas.width;
          }

          drawHeart(
            heart.x,
            heart.y,
            heart.size,
            heart.rotation,
            heart.hue,
            heart.opacity
          );
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameRef.current);
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [stage]);

  // Mouse tracking for interactive elements
  useEffect(() => {
    if (stage === 2) {
      audio.play();
      const handleMouseMove = (e) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setCursorPosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [stage]);

  // Intro animation progress
  useEffect(() => {
    let timeout;
    if (stage === 1) {
      const increment = 1;
      const totalFrames = 100;
      let frame = 0;

      const updateProgress = () => {
        frame += increment;
        setAnimationProgress(frame);

        if (frame < totalFrames) {
          timeout = setTimeout(updateProgress, 30);
        } else {
          setStage(2);
        }
      };

      updateProgress();
    }

    return () => clearTimeout(timeout);
  }, [stage]);

  // Text typing effect
  useEffect(() => {
    if (stage === 2) {
      // audio.play();
      const currentText = scenes[activeScene].poem;
      let index = 0;

      const typeText = () => {
        if (index < currentText.length) {
          setTypedText((prev) => prev + currentText.charAt(index - 1));
          index++;
          setTimeout(typeText, 50);
        } else {
          setTimeout(() => {
            if (!revealedHearts.includes(activeScene)) {
              setRevealedHearts((prev) => [...prev, activeScene]);
            }
            goToScene(activeScene + 1);
          }, 2000);
        }
      };

      setTypedText("");
      index = 0;
      typeText();
    }
  }, [activeScene, stage]);

  // Show final message when all scenes are viewed
  useEffect(() => {
    if (revealedHearts.length === scenes.length) {
      setTimeout(() => {
        {
          setShowFinalMessage(true);
          // setStage(3);
        }
      }, 1000);
    }
  }, [revealedHearts]);

  useEffect(() => {
    // This effect handles cycling through the final messages
    let messageTimer;

    if (showFinalMessage && finalMessageIndex < finalMessages.length - 1) {
      messageTimer = setTimeout(() => {
        setFinalMessageIndex((prevIndex) => prevIndex + 1);
      }, 5000);
    }

    // Clean up the timer if component unmounts or dependencies change
    return () => {
      if (messageTimer) clearTimeout(messageTimer);
    };
  }, [showFinalMessage, finalMessageIndex, finalMessages.length]);

  // Navigate between scenes
  const goToFinalMessage = (index) => {
    if (index >= 0 && index < finalMessages.length) {
      setFinalMessageIndex(index);
    }
  };

  // Start the experience
  const startJourney = () => {
    setStage(1);
  };

  // Navigate between scenes
  const goToScene = (index) => {
    if (index >= 0 && index < scenes.length) {
      setActiveScene(index);
    }
  };

  // Generate path points for SVG wave animation
  const generateWavePath = (progress) => {
    const amplitude = 20;
    const frequency = 0.02;
    let path = "M0,100 ";

    for (let i = 0; i <= 100; i++) {
      const y =
        100 -
        amplitude * Math.sin((i + progress * 2) * frequency * Math.PI * 2);
      path += `L${i},${y} `;
    }

    path += "L100,100 L0,100 Z";
    return path;
  };

  // Create interactive halo effect around cursor
  const getHaloGradient = () => {
    return `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, 
      rgba(255, 200, 255, 0.6) 0%, 
      rgba(255, 150, 200, 0.4) 20%, 
      rgba(255, 100, 150, 0.2) 40%, 
      rgba(255, 50, 100, 0.1) 60%, 
      rgba(0, 0, 0, 0) 80%)`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-black">
      {/* Canvas for animated hearts background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: stage >= 2 ? "block" : "none", zIndex: 0 }}
      />

      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-purple-900/30 to-pink-900/30 z-0"></div>

      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Intro Stage */}
      {stage === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Pulsing heart animation */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-500 rounded-full animate-ping opacity-30 animation-delay-200"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-500 rounded-full animate-ping opacity-40 animation-delay-400"></div>
            <svg className="relative w-40 h-40" viewBox="0 0 100 100">
              <path
                d="M50,30 C60,10 90,10 90,40 C90,65 60,80 50,90 C40,80 10,65 10,40 C10,10 40,10 50,30 Z"
                fill="url(#heartGradient)"
                className="filter drop-shadow-lg animate-beat"
              />
              <defs>
                <linearGradient
                  id="heartGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="50%" stopColor="#cc0066" />
                  <stop offset="100%" stopColor="#990099" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400 mb-6 text-center animate-shimmer">
            A Journey of Our Love
          </h1>

          <p className="text-pink-200 text-xl mb-8 max-w-md text-center">
            I've created something special just for you, to celebrate our love
            story.
          </p>

          <button
            onClick={startJourney}
            className="px-8 py-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full text-white font-semibold text-lg relative overflow-hidden group"
          >
            <span className="relative z-10">Begin</span>
            <span className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 group-hover:opacity-90 opacity-0 transition-opacity duration-300"></span>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute w-12 h-12 bg-white rounded-full animate-ripple"
                  style={{ animationDelay: `${i * 200}ms` }}
                ></span>
              ))}
            </span>
          </button>
        </div>
      )}

      {/* Loading Animation */}
      {stage === 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md flex flex-col items-center">
            <div className="w-full h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
                style={{ width: `${animationProgress}%` }}
              ></div>
            </div>

            <div className="text-white text-xl font-medium mb-8">
              Loading our memories...
            </div>

            <div className="flex justify-center space-x-4">
              {["❤️", "✨", "💕", "✨", "❤️"].map((emoji, i) => (
                <div
                  key={i}
                  className="text-2xl animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Experience */}
      {stage === 2 && (
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
          onMouseEnter={() => setMouseEntered(true)}
          onMouseLeave={() => setMouseEntered(false)}
        >
          <div
            className="w-full max-w-5xl h-full max-h-screen p-8 relative flex flex-col items-center justify-center"
            style={{
              background: mouseEntered ? getHaloGradient() : "transparent",
              transition: "background 0.5s ease",
            }}
          >
            {/* Animated wave dividers */}
            <div className="absolute top-0 left-0 w-full h-16 overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d={generateWavePath(animationProgress)}
                  fill="rgba(255,100,200,0.1)"
                  className="translate-y-1/2"
                />
              </svg>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden transform rotate-180">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d={generateWavePath(animationProgress + 50)}
                  fill="rgba(200,100,255,0.1)"
                  className="translate-y-1/2"
                />
              </svg>
            </div>

            {/* Scene Content */}
            <div className="w-full max-w-4xl relative z-10">
              {!showFinalMessage ? (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Photo with interactive effects */}
                  <div className="w-full md:w-1/2 relative">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={scenes[activeScene].image}
                        alt={scenes[activeScene].title}
                        className="w-full h-64 md:h-96 object-cover transform hover:scale-110 transition-transform duration-3000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="absolute bottom-0 left-0 w-full p-4">
                          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-2 animate-shimmer">
                            {scenes[activeScene].title}
                          </h2>
                        </div>
                      </div>

                      {/* Interactive particle effect on hover */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 rounded-full bg-pink-400"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animation: `floatUpAndFade ${
                                Math.random() * 3 + 2
                              }s ease-out infinite`,
                              animationDelay: `${Math.random() * 2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Poem Content */}
                  <div className="w-full md:w-1/2">
                    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-pink-500/20 shadow-lg shadow-pink-500/10">
                      <div className="h-64 flex flex-col">
                        <div className="mb-auto">
                          <div className="text-pink-200 whitespace-pre-line text-lg poem-text">
                            {typedText}
                          </div>
                        </div>

                        {/* Navigation buttons */}
                        <div className="mt-6 flex justify-between items-center">
                          <div className="flex space-x-2">
                            {scenes.map((_, index) => (
                              <div
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  activeScene === index
                                    ? "bg-pink-500 scale-125"
                                    : revealedHearts.includes(index)
                                    ? "bg-pink-400/50"
                                    : "bg-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="relative bg-black/30 backdrop-blur-md rounded-lg p-8 border border-pink-500/30 overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute text-pink-500 text-4xl"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            animation: `pulse ${
                              Math.random() * 4 + 2
                            }s infinite alternate`,
                          }}
                        >
                          ❤️
                        </div>
                      ))}
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                        My Heart Is Yours
                      </h2>

                      {/* <p className="text-white text-lg leading-relaxed text-center mb-8">
                        {showFinalMessage && finalMessages[finalMessageIndex]}
                      </p> */}

                      {showFinalMessage &&
                        (finalMessageIndex === finalMessages.length - 1 ? (
                          <div className="w-full flex justify-center items-center py-8">
                            <AnimatedLastMessage
                              message={finalMessages[finalMessageIndex]}
                            />
                          </div>
                        ) : (
                          <div className="text-white leading-relaxed text-lg md:text-2xl text-center px-4">
                            {finalMessages[finalMessageIndex]}
                          </div>
                        ))}

                      <div className="flex justify-center mt-10">
                        <div className="text-center animate-float">
                          <p className="text-pink-200 text-xl mb-2">
                            Forever Yours,
                          </p>
                          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                            Ishan
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global CSS animations */}
      <style jsx="true">{`
        @keyframes beat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes floatUpAndFade {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 0.7;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-beat {
          animation: beat 1.5s ease-in-out infinite;
        }

        .animate-ripple {
          animation: ripple 2s cubic-bezier(0, 0.5, 0.5, 1) forwards;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s forwards;
        }

        .poem-text {
          text-shadow: 0 0 10px rgba(255, 100, 200, 0.5);
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default UltraRomanticExperience;
