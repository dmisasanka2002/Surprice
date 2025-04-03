import React, { useState, useEffect, useRef } from "react";

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
  const [sparklesPosition, setSparklesPosition] = useState([]);
  const [showSparkles, setShowSparkles] = useState(false);
  const [butterflyPositions, setButterflyPositions] = useState([]);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const heartParticlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [audio] = useState(new Audio("/Surprice/romantic_music.mp3"));
  const [hoverImageIndex, setHoverImageIndex] = useState(null);

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

  const finalMessage =
    "You are the poetry in my soul, the rhythm in my heart, and the meaning in my life. Every day with you is a gift I cherish more than words can express. I love you beyond the boundaries of time and space, beyond the depths of the oceans, and beyond the infinite stars in the sky. You are my everything.";

  // Generate butterfly positions
  useEffect(() => {
    if (stage === 2) {
      const newPositions = Array.from({ length: 8 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        direction: Math.random() > 0.5 ? 1 : -1,
      }));
      setButterflyPositions(newPositions);
    }
  }, [stage]);

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
      heartParticlesRef.current = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        speedX: Math.random() * 2 - 1,
        speedY: -Math.random() * 2 - 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.05 - 0.025,
        hue: Math.random() * 60 + 330, // Pink to red hues
        opacity: Math.random() * 0.7 + 0.3,
        glowing: Math.random() > 0.7, // Some hearts will glow
        glowIntensity: 0,
        glowDirection: 1,
      }));

      const drawHeart = (x, y, size, rotation, hue, opacity, glowing, glowIntensity) => {
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
        
        // Add glowing effect for some hearts
        if (glowing) {
          ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${0.5 + glowIntensity * 0.5})`;
          ctx.shadowBlur = 15 + glowIntensity * 10;
        } else {
          ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;
          ctx.shadowBlur = 15;
        }
        
        ctx.fillStyle = `hsla(${hue}, 100%, ${70 + glowIntensity * 10}%, ${opacity})`;
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

          // Update glow intensity for glowing hearts
          if (heart.glowing) {
            heart.glowIntensity += 0.02 * heart.glowDirection;
            if (heart.glowIntensity > 1) {
              heart.glowDirection = -1;
            } else if (heart.glowIntensity < 0) {
              heart.glowDirection = 1;
            }
          }

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
            heart.opacity,
            heart.glowing,
            heart.glowIntensity
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
      const handleMouseMove = (e) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          setCursorPosition({ x, y });
          
          // Generate sparkles occasionally when mouse moves
          if (Math.random() > 0.85) {
            setSparklesPosition(prev => [
              ...prev.slice(-15), // Keep only the last 15 sparkles
              {
                x,
                y,
                size: Math.random() * 10 + 5,
                opacity: 1,
                color: Math.random() > 0.5 ? "pink" : "purple"
              }
            ]);
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [stage]);

  // Fade out sparkles
  useEffect(() => {
    if (sparklesPosition.length > 0) {
      const timer = setTimeout(() => {
        setSparklesPosition(prev => 
          prev.map(spark => ({
            ...spark,
            opacity: spark.opacity > 0 ? spark.opacity - 0.1 : 0
          })).filter(spark => spark.opacity > 0)
        );
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [sparklesPosition]);

  // Show sparkles effect
  useEffect(() => {
    if (stage === 2) {
      const interval = setInterval(() => {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 500);
      }, 3000);
      
      return () => clearInterval(interval);
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
      audio.play();
      const currentText = scenes[activeScene].poem;
      let index = 0;

      const typeText = () => {
        if (index < currentText.length) {
          setTypedText((prev) => prev + currentText.charAt(index));
          index++;
          setTimeout(typeText, 50);
        } else {
          setTimeout(() => {
            if (!revealedHearts.includes(activeScene)) {
              setRevealedHearts((prev) => [...prev, activeScene]);
            }
            if (activeScene < scenes.length - 1) {
              goToScene(activeScene + 1);
            } else if (!showFinalMessage) {
              setTimeout(() => {
                setShowFinalMessage(true);
              }, 1000);
            }
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
        setShowFinalMessage(true);
      }, 1000);
    }
  }, [revealedHearts]);

  // Start the experience
  const startJourney = () => {
    setStage(1);
    // audio.play();
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
    <div className="relative w-full h-screen overflow-hidden font-sans bg-gradient-to-b from-black via-purple-900/20 to-black">
      {/* Canvas for animated hearts background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: stage >= 2 ? "block" : "none", zIndex: 0 }}
      />

      {/* Sparkles that follow cursor */}
      {sparklesPosition.map((spark, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            background: spark.color === "pink" ? 
              "radial-gradient(circle, rgba(255,105,180,0.8) 0%, rgba(255,105,180,0) 70%)" : 
              "radial-gradient(circle, rgba(147,112,219,0.8) 0%, rgba(147,112,219,0) 70%)",
            borderRadius: "50%",
            opacity: spark.opacity,
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        />
      ))}

      {/* Decorative butterflies */}
      {stage === 2 && butterflyPositions.map((butterfly, i) => (
        <div
          key={i}
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${butterfly.x}%`,
            top: `${butterfly.y}%`,
            transform: `scale(${butterfly.size}) ${butterfly.direction > 0 ? '' : 'scaleX(-1)'}`,
            animation: `butterflyFly ${butterfly.speed}s infinite alternate ease-in-out`,
            animationDelay: `${butterfly.delay}s`,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 100 100">
            <path
              d="M50,30 C60,0 90,10 50,50 C10,10 40,0 50,30 Z"
              fill="url(#butterfly-gradient)"
              className="animate-flutter"
            />
            <defs>
              <linearGradient id="butterfly-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#9370db" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Periodic sparkle effect across entire screen */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                background: Math.random() > 0.5 ?
                  "radial-gradient(circle, rgba(255,192,203,0.9) 0%, rgba(255,192,203,0) 70%)" :
                  "radial-gradient(circle, rgba(216,191,216,0.9) 0%, rgba(216,191,216,0) 70%)",
                borderRadius: "50%",
                animationDuration: `${Math.random() * 2 + 0.5}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Intro Stage */}
      {stage === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 150 + 50}px`,
                  height: `${Math.random() * 150 + 50}px`,
                  background: "radial-gradient(circle, rgba(255,105,180,0.4) 0%, rgba(255,105,180,0) 70%)",
                  borderRadius: "50%",
                  filter: "blur(8px)",
                  animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out alternate`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
          
          {/* Pulsing heart animation */}
          <div className="relative mb-8 z-10">
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

          <p className="text-pink-200 text-xl mb-8 max-w-md text-center relative">
            I've created something special just for you, to celebrate our love
            story.
            <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-md -z-10 animate-pulse"></span>
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
            <span className="absolute inset-0 rounded-full bg-pink-500/30 blur group-hover:animate-pulse"></span>
          </button>
        </div>
      )}

      {/* Loading Animation */}
      {stage === 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md flex flex-col items-center">
            <div className="w-full h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 relative"
                style={{ width: `${animationProgress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>

            <div className="text-white text-xl font-medium mb-8">
              Loading our memories...
              <span className="inline-block animate-bounce">.</span>
              <span className="inline-block animate-bounce animation-delay-200">.</span>
              <span className="inline-block animate-bounce animation-delay-400">.</span>
            </div>

            <div className="flex justify-center space-x-4">
              {["❤️", "✨", "💕", "✨", "❤️"].map((emoji, i) => (
                <div
                  key={i}
                  className="text-2xl animate-bounce relative"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {emoji}
                  <span className="absolute inset-0 bg-pink-500/20 rounded-full filter blur-md animate-pulse"></span>
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
            {/* Animated wave dividers with enhanced color and effect */}
            <div className="absolute top-0 left-0 w-full h-16 overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="filter drop-shadow-md"
              >
                <path
                  d={generateWavePath(animationProgress)}
                  fill="rgba(255,100,200,0.2)"
                  className="translate-y-1/2"
                />
                <path
                  d={generateWavePath(animationProgress + 25)}
                  fill="rgba(147,112,219,0.15)"
                  className="translate-y-1/3"
                />
              </svg>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden transform rotate-180">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="filter drop-shadow-md"
              >
                <path
                  d={generateWavePath(animationProgress + 50)}
                  fill="rgba(200,100,255,0.2)"
                  className="translate-y-1/2"
                />
                <path
                  d={generateWavePath(animationProgress + 75)}
                  fill="rgba(255,182,193,0.15)"
                  className="translate-y-1/3"
                />
              </svg>
            </div>

            {/* Scene Content */}
            <div className="w-full max-w-4xl relative z-10">
              {!showFinalMessage ? (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Photo with interactive effects */}
                  <div className="w-full md:w-1/2 relative">
                    <div 
                      className="relative overflow-hidden rounded-lg shadow-2xl transform hover:-rotate-2 transition-all duration-700"
                      onMouseEnter={() => setHoverImageIndex(activeScene)}
                      onMouseLeave={() => setHoverImageIndex(null)}
                    >
                      <img
                        src={scenes[activeScene].image}
                        alt={scenes[activeScene].title}
                        className="w-full h-64 md:h-96 object-cover transform hover:scale-110 transition-transform duration-3000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="absolute bottom-0 left-0 w-full p-4">
                          <h2 className="text-2xl font-bold text-white mb-2 filter drop-shadow-lg">
                            {scenes[activeScene].title}
                          </h2>
                        </div>
                      </div>

                      {/* Enhanced hover effects */}
                      {hoverImageIndex === activeScene && (
                        <>
                          {/* Glowing border */}
                          <div className="absolute inset-0 border-2 border-pink-500/50 rounded-lg animate-pulse" />
                          
                          {/* Interactive particle effect on hover */}
                          <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none">
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-3 h-3 rounded-full bg-pink-400 filter blur-sm"
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
                          
                          {/* Corner decorations */}
                          <div className="absolute top-2 left-2 w-10 h-10">
                            <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                              <path 
                                d="M0,0 L50,0 C20,0 0,20 0,50 Z" 
                                fill="rgba(255,182,193,0.7)" 
                              />
                            </svg>
                          </div>
                          <div className="absolute top-2 right-2 w-10 h-10">
                            <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                              <path 
                                d="M100,0 L50,0 C80,0 100,20 100,50 Z" 
                                fill="rgba(147,112,219,0.7)" 
                              />
                            </svg>
                          </div>
                          <div className="absolute bottom-2 left-2 w-10 h-10">
                            <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                              <path 
                                d="M0,100 L50,100 C20,100 0,80 0,50 Z" 
                                fill="rgba(147,112,219,0.7)" 
                              />
                            </svg>
                          </div>
                          <div className="absolute bottom-2 right-2 w-10 h-10">
                            <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                              <path 
                                d="M100,100 L50,100 C80,100 100,80 100,50 Z" 
                                fill="rgba(255,182,193,0.7)" 
                              />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Poem Content with enhanced styling */}
                  <div className="w-full md:w-1/2">
                    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-pink-500/30 shadow-xl shadow-xl relative overflow-hidden">
                      <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 blur-xl animate-pulse"></div>
                      <div className="relative z-10">
                        <div className="text-pink-100 font-serif whitespace-pre-line text-lg leading-relaxed min-h-[200px]">
                          {typedText}
                          <span className="animate-blink">|</span>
                        </div>

                        {/* Revealed heart for completed scenes */}
                        {revealedHearts.includes(activeScene) && (
                          <div className="absolute -right-4 -bottom-4 transform rotate-12">
                            <div className="text-4xl animate-float">❤️</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-black/60 backdrop-blur-xl rounded-xl p-8 border border-pink-500/30 shadow-2xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl"></div>
                  
                  <div className="relative">
                    <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                      From My Heart to Yours
                    </h2>
                    
                    <p className="text-pink-100 font-serif text-xl leading-relaxed text-center mb-8">
                      {finalMessage}
                    </p>
                    
                    <div className="flex justify-center items-center">
                      <div className="text-6xl animate-float">❤️</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {!showFinalMessage && (
                <div className="mt-8 flex justify-center space-x-4">
                  {scenes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToScene(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeScene === index
                          ? "bg-pink-500 transform scale-125"
                          : "bg-pink-300/50 hover:bg-pink-400/70"
                      }`}
                      aria-label={`Go to scene ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes floatUpAndFade {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes flutter {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes butterflyFly {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(10px) translateX(10px) rotate(5deg); }
          66% { transform: translateY(-5px) translateX(15px) rotate(-5deg); }
          100% { transform: translateY(5px) translateX(5px) rotate(10deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-beat {
          animation: beat 1.5s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 0.8s step-end infinite;
        }
        
        .animate-ripple {
          animation: ripple 1.5s ease-out infinite;
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }
        
        .animate-flutter {
          animation: flutter 0.5s ease-in-out infinite alternate;
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