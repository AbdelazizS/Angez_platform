import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Play, ArrowRight, CheckCircle, Shield, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";

export default function VideoSection() {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const benefits = [
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      text: t('video.benefits.secure')
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      text: t('video.benefits.community')
    },
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      text: t('video.benefits.opportunities')
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      text: t('video.benefits.guarantee')
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-background to-primary/5 rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-8 items-center"
        >
          {/* Video Player with Custom Controls */}
          <div className="lg:w-1/2 w-full relative group">
            <video
              ref={videoRef}
              controls={isPlaying}
              className="w-full aspect-video rounded-xl bg-black"
              preload="metadata"
              onClick={handlePlay}
            >
              <source src="/video.mp4" type="video/mp4" />
              {t('video.notSupported')}
            </video>
            
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={handlePlay}
                  className="w-20 h-20 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  aria-label={t('video.cta.watch')}
                >
                  <Play className="w-8 h-8 text-primary fill-primary" />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="lg:w-1/2 w-full space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              {t('video.title')}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('video.description')}
            </p>
            
            {/* Benefits List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5">{benefit.icon}</span>
                  <span className="text-foreground">{benefit.text}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={handlePlay}
              >
                {t('video.cta.watch')}
                <Play className="ms-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                asChild
              >
                <Link href="/register">
                  {t('video.cta.join')}
                  <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}