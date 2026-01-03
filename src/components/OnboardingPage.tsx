import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  Moon, 
  Sun, 
  BookOpen, 
  Trophy, 
  Bell, 
  Heart,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Star
} from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    icon: BookOpen,
    title: "Dzikir Pagi & Petang",
    description: "Baca dzikir pagi dan petang dengan mudah. Dilengkapi dengan teks Arab, latin, dan terjemahan lengkap.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10"
  },
  {
    id: 2,
    icon: Trophy,
    title: "Gamifikasi & Achievement",
    description: "Dapatkan XP dan achievement saat membaca dzikir. Tantang diri sendiri untuk konsisten setiap hari!",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10"
  },
  {
    id: 3,
    icon: Bell,
    title: "Pengingat Otomatis",
    description: "Atur pengingat untuk dzikir pagi dan petang. Tidak akan lupa lagi untuk berdzikir setiap hari.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10"
  },
  {
    id: 4,
    icon: Heart,
    title: "Lacak Progres Harian",
    description: "Lihat streak dan statistik harian. Pantau perkembangan spiritual Anda dengan mudah.",
    color: "from-rose-500 to-red-500",
    bgColor: "bg-rose-500/10"
  },
  {
    id: 5,
    icon: Sparkles,
    title: "Siap Memulai?",
    description: "Mari mulai perjalanan spiritual Anda. Berdzikir setiap hari untuk hati yang tenang dan damai.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10"
  }
];

// Floating particles component
const FloatingStars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        }}
      >
        <Star 
          className="text-primary/20" 
          size={8 + Math.random() * 12} 
          fill="currentColor"
        />
      </div>
    ))}
  </div>
);

// Moon and sun illustration
const CelestialIllustration = ({ slideIndex }: { slideIndex: number }) => {
  const isMorning = slideIndex % 2 === 0;
  
  return (
    <div className="absolute top-8 right-8 opacity-20">
      {isMorning ? (
        <Sun className="w-24 h-24 text-amber-400 animate-pulse" />
      ) : (
        <Moon className="w-20 h-20 text-indigo-400 animate-pulse" />
      )}
    </div>
  );
};

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const isLastSlide = selectedIndex === slides.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <FloatingStars />
      <CelestialIllustration slideIndex={selectedIndex} />
      
      {/* Decorative circles */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative z-10">
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <Button 
            variant="ghost" 
            onClick={onComplete}
            className="text-muted-foreground hover:text-foreground"
          >
            Lewati
          </Button>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <div 
                  key={slide.id} 
                  className="flex-[0_0_100%] min-w-0 px-2"
                >
                  <Card className="p-8 text-center border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                    {/* Icon container */}
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${slide.bgColor} flex items-center justify-center animate-scale-in`}>
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl font-bold mb-4 text-foreground animate-fade-in">
                      {slide.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                      {slide.description}
                    </p>

                    {/* Features list for last slide */}
                    {index === slides.length - 1 && (
                      <div className="mt-6 space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                          <span>100% Gratis</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                          <span>Offline Support</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                          <span>Sinkronisasi Cloud</span>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {isLastSlide ? (
            <Button 
              onClick={onComplete}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg animate-shimmer"
            >
              Mulai Sekarang
              <Sparkles className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
