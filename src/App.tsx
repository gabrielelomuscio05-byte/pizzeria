import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { createPortal } from 'react-dom';
import { MargheritaDetail } from './components/MargheritaDetail';

const IMAGES = [
  { src: 'https://mmzamvefll2c56uy.public.blob.vercel-storage.com/pizza.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

const PIZZA_DEL_MESE = [
  {
    name: 'Margherita',
    description: 'Pomodoro San Marzano DOP, mozzarella di bufala campana DOP, olio EVO, basilico.'
  },
  {
    name: 'Orto Verde',
    description: 'Crema di zucchine novelle, provola affumicata, basilico fresco del nostro orto, pinoli toscani tostati e scaglie sottili di Pecorino Romano.'
  },
  {
    name: 'Fichi e Culatta',
    description: 'Fior di latte di Agerola, fichi neri caramellati, culatta marchigiana, stracciatella di bufala fresca e un filo di miele biologico al tartufo nero.'
  },
  {
    name: 'Marino Azzurro',
    description: 'Filetti freschi di alici di Cetara marinate, pomodorini gialli del Cilento, capperi selvatici di Salina, olive taggiasche denocciolate e origano del Vesuvio.'
  }
];

const INGREDIENTS_DATA = [
  // Margherita (represented by Margherita pizza.png image as per user description)
  [
    { name: 'Pomodoro', src: '/pomodori.jpg', style: { top: '18%', left: '8%' }, mobileStyle: { top: '14%', left: '6%' }, animation: 'animate-float-slow' },
    { name: 'Mozzarella', src: '/mozzarella.jpg', style: { top: '56%', left: '10%' }, mobileStyle: { top: '30%', left: '5%' }, animation: 'animate-float-medium' },
    { name: 'Basilico', src: '/basilico.jpg', style: { top: '28%', right: '10%' }, mobileStyle: { top: '22%', right: '6%' }, animation: 'animate-float-fast' },
  ],
  // Orto Verde
  [
    { name: 'Zucchine', src: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=300&q=80', style: { top: '20%', left: '6%' }, mobileStyle: { top: '14%', left: '6%' }, animation: 'animate-float-medium' },
    { name: 'Provola', src: 'https://images.unsplash.com/photo-1589881133595-a3c085cb1493?auto=format&fit=crop&w=300&q=80', style: { top: '54%', left: '12%' }, mobileStyle: { top: '30%', left: '5%' }, animation: 'animate-float-fast' },
    { name: 'Pinoli', src: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=300&q=80', style: { top: '26%', right: '12%' }, mobileStyle: { top: '22%', right: '6%' }, animation: 'animate-float-slow' },
  ],
  // Fichi e Culatta
  [
    { name: 'Fichi', src: 'https://images.unsplash.com/photo-1501924497965-7927789c95fd?auto=format&fit=crop&w=300&q=80', style: { top: '16%', left: '10%' }, mobileStyle: { top: '14%', left: '6%' }, animation: 'animate-float-fast' },
    { name: 'Culatta', src: 'https://images.unsplash.com/photo-1620921556328-1a9300dce76d?auto=format&fit=crop&w=300&q=80', style: { top: '58%', left: '8%' }, mobileStyle: { top: '30%', left: '5%' }, animation: 'animate-float-slow' },
    { name: 'Miele', src: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80', style: { top: '30%', right: '8%' }, mobileStyle: { top: '22%', right: '6%' }, animation: 'animate-float-medium' },
  ],
  // Marino Azzurro
  [
    { name: 'Alici', src: 'https://images.unsplash.com/photo-1615141982883-c7ad0e690050?auto=format&fit=crop&w=300&q=80', style: { top: '22%', left: '12%' }, mobileStyle: { top: '14%', left: '6%' }, animation: 'animate-float-slow' },
    { name: 'Pomodorini', src: 'https://images.unsplash.com/photo-1561131248-c52d886568c7?auto=format&fit=crop&w=300&q=80', style: { top: '52%', left: '6%' }, mobileStyle: { top: '30%', left: '5%' }, animation: 'animate-float-medium' },
    { name: 'Capperi', src: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=300&q=80', style: { top: '24%', right: '14%' }, mobileStyle: { top: '22%', right: '6%' }, animation: 'animate-float-fast' },
  ]
];

const MENU_DATA: Record<string, Array<{ name: string; price: string; description: string; image: string }>> = {
  antipasti: [
    {
      name: 'Tagliere Virgo',
      price: '€ 14,00',
      description: 'Selezione di salumi nostrani, formaggi freschi locali, verdure grigliate e focaccia calda al rosmarino.',
      image: 'https://images.unsplash.com/photo-1538332576228-eb5b43a6985a?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Bruschetta Vesuvio',
      price: '€ 6,00',
      description: 'Pane di grano duro tostato, pomodorini del piennolo, aglio, basilico e olio extravergine.',
      image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Fiori di Zucca Ripieni',
      price: '€ 8,00',
      description: 'Pastellati e ripieni di ricotta vaccina, provola affumicata e alici.',
      image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80'
    }
  ],
  primi: [
    {
      name: 'Paccheri allo Scarpariello',
      price: '€ 12,00',
      description: 'Paccheri artigianali con pomodorini freschi, pecorino romano DOP, parmigiano reggiano e basilico.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Gnocchi alla Sorrentina',
      price: '€ 11,00',
      description: 'Gnocchi di patate fatti in casa, salsa di pomodoro biologico, fiordilatte filante e basilico.',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80'
    }
  ],
  secondi: [
    {
      name: 'Tagliata Rustica',
      price: '€ 18,00',
      description: 'Tagliata di manzo con rucola selvatica, scaglie di parmigiano reggiano 24 mesi e glassa di aceto balsamico.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Parmigiana della Nonna',
      price: '€ 10,00',
      description: 'Melanzane fritte, salsa di pomodoro, provola affumicata e parmigiano, cotta in forno a legna.',
      image: 'https://images.unsplash.com/photo-1621510456681-23a23cfb5f57?auto=format&fit=crop&w=600&q=80'
    }
  ],
  pizze: [
    {
      name: 'Margherita',
      price: '€ 9,00',
      description: 'Pomodoro San Marzano DOP, mozzarella di bufala campana DOP, olio EVO, basilico.',
      image: '/card_margherita.jpeg'
    },
    {
      name: 'Pistacchio e Mortadella',
      price: '€ 12,00',
      description: 'Fiordilatte, mortadella IGP, stracciatella fresca e pesto di pistacchio di Bronte.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Diavola Calabra',
      price: '€ 10,50',
      description: 'Pomodoro, fiordilatte, salame piccante calabrese, nduja di Spilinga.',
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Virgo Speciale',
      price: '€ 14,00',
      description: 'Fiordilatte, porcini freschi, speck del Tirolo croccante e tartufo nero estivo.',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80'
    }
  ],
  dolci: [
    {
      name: 'Tiramisù al Caffè',
      price: '€ 6,00',
      description: 'Crema al mascarpone artigianale, savoiardi inzuppati nel caffè espresso napoletano.',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Caprese Calda',
      price: '€ 7,00',
      description: 'Torta caprese alle mandorle e cioccolato servita tiepida con gelato alla vaniglia.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'
    }
  ],
  vini: [
    {
      name: 'Taurasi DOCG (Rosso)',
      price: 'Calice € 6,50 / Bottiglia € 28,00',
      description: 'Vino rosso strutturato campano, note di frutti rosso rubino e spezie intense.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Falanghina del Sannio (Bianco)',
      price: 'Calice € 5,00 / Bottiglia € 20,00',
      description: 'Vino bianco fresco, profumo floreale intenso e sentori agrumati e di mela verde.',
      image: 'https://images.unsplash.com/photo-1569919653159-e92433e35d6f?auto=format&fit=crop&w=600&q=80'
    }
  ],
  bevande: [
    {
      name: 'Birra Artigianale Virgo (0.33L)',
      price: '€ 5,50',
      description: 'Bionda ad alta fermentazione, non filtrata e non pastorizzata, prodotta localmente.',
      image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Acqua Minerale (0.75L)',
      price: '€ 3,00',
      description: 'Acqua Panna naturale o San Pellegrino frizzante servita fredda.',
      image: 'https://images.unsplash.com/photo-1608885898957-a599fb1b468e?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Bibite Classiche (0.33L)',
      price: '€ 3,00',
      description: 'Coca Cola, Fanta, Sprite in vetro.',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80'
    }
  ]
};

const renderProtectedText = (text: string) => {
  if (!text.toLowerCase().includes('virgo')) return text;
  
  const parts = text.split(/(virgo)/i);
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === 'virgo' ? (
          <span key={i} translate="no" className="notranslate">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
};

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const [currentPage, setCurrentPage] = useState<'home' | 'introduzione' | 'menu' | 'chi-siamo' | 'prenota' | 'margherita'>('home');
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('pizze');

  // Synchronize hash with currentPage state (covers browser Back/Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const parts = hash.split('-');
      const page = parts[0];
      const category = parts[1];

      const validPages = ['home', 'introduzione', 'menu', 'chi-siamo', 'prenota', 'margherita'];
      if (validPages.includes(page)) {
        setCurrentPage(page as any);
        if (page === 'menu' && category) {
          setActiveMenuCategory(category);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial page based on hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sync currentPage state to hash (covers in-app nav clicks)
  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '') || 'home';
    if (currentHash !== currentPage) {
      window.location.hash = currentPage === 'home' ? '' : currentPage;
    }
  }, [currentPage]);

  // Drag and drop state for ingredients
  const [draggedOffsets, setDraggedOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [activeDrag, setActiveDrag] = useState<{ id: string; startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);

  const handleStart = (id: string, clientX: number, clientY: number) => {
    const current = draggedOffsets[id] || { x: 0, y: 0 };
    setActiveDrag({
      id,
      startX: clientX,
      startY: clientY,
      offsetX: current.x,
      offsetY: current.y,
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!activeDrag) return;
    const dx = clientX - activeDrag.startX;
    const dy = clientY - activeDrag.startY;
    setDraggedOffsets((prev) => ({
      ...prev,
      [activeDrag.id]: {
        x: activeDrag.offsetX + dx,
        y: activeDrag.offsetY + dy,
      },
    }));
  };

  const handleEnd = () => {
    if (activeDrag) {
      const id = activeDrag.id;
      setDraggedOffsets((prev) => ({
        ...prev,
        [id]: { x: 0, y: 0 },
      }));
    }
    setActiveDrag(null);
  };

  useEffect(() => {
    if (!activeDrag) return;

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        // Prevent page scroll while dragging
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseUp = () => {
      handleEnd();
    };

    const onTouchEnd = () => {
      handleEnd();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [activeDrag]);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

  // Update document title for SEO based on currentPage
  useEffect(() => {
    const titles = {
      home: 'Pizzeria Virgo | Pizza Napoletana Contemporanea',
      introduzione: "L'Arte della Pizza | Pizzeria Virgo",
      menu: 'Il Nostro Menu | Pizzeria Virgo',
      'chi-siamo': 'Chi Siamo | Pizzeria Virgo',
      prenota: 'Prenota un Tavolo | Pizzeria Virgo',
      margherita: 'Margherita Classica | Pizzeria Virgo',
    };
    document.title = titles[currentPage] || 'Pizzeria Virgo';
  }, [currentPage]);

  // Reset scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Update isMobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Navigate carousel next/prev
  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    setActiveIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % 4;
      } else {
        return (prev + 3) % 4;
      }
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Derive roles from activeIndex
  const getRole = (index: number) => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  // Per-role styles
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : '0',
        };
      case 'left':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        };
      case 'back':
      default:
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        };
    }
  };

  const itemCommonStyle = {
    position: 'absolute' as const,
    aspectRatio: '0.6 / 1',
    transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform, filter, opacity, left, bottom, height',
  };

  // Sub-views
  const IntroduzioneView = () => (
    <div className="max-w-6xl mx-auto w-full py-12 animate-fade-in px-6 flex flex-col gap-16 min-h-[70vh]">
      {/* Upper Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column: Text */}
        <div className="lg:w-1/2 flex flex-col items-start text-left">
          <p className="text-[#C5A059] text-xs sm:text-sm uppercase tracking-[0.25em] font-medium mb-4">
            La Nostra Filosofia
          </p>
          <h2 className="font-anton text-[#F5F2EB] text-5xl sm:text-7xl uppercase mb-6 tracking-tight leading-none">
            L'Arte della Pizza a <span translate="no" className="notranslate">Virgo</span>
          </h2>
          <div className="w-20 h-1 rounded-full mb-8" style={{ backgroundColor: '#C5A059' }} />
          <p className="text-[#F5F2EB] text-lg sm:text-xl leading-relaxed opacity-90 mb-10 font-light">
            Uniamo l'innovazione del design 3D alla sacralità della tradizione gastronomica italiana. A <span translate="no" className="notranslate">Virgo</span>, ogni pizza è una scultura di sapori bilanciati, realizzata con un impasto a lievitazione naturale di 48 ore e cotta nel nostro forno a legna.
          </p>
          <button
            onClick={() => {
              setCurrentPage('menu');
              setActiveMenuCategory('pizze');
            }}
            className="px-8 py-4 rounded-full font-bold uppercase bg-[#F5F2EB] text-[#1C1C1C] hover:bg-[#9E2A2B] hover:text-[#F5F2EB] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg border-2 border-black"
          >
            Scopri il Menu
          </button>
        </div>

        {/* Right Column: Pizza Photo */}
        <div className="lg:w-1/2 w-full flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-[#F5F2EB]/15 shadow-2xl group bg-[#111111]">
            <img
              src="/arte_pizza.png"
              alt="L'Arte della Pizza Virgo"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Decorative glassmorphic ring */}
            <div className="absolute inset-0 border-[12px] border-[#F5F2EB]/5 pointer-events-none rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Lower Section: Three Artistic Tenets to fill space */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#F5F2EB]/10">
        <div className="bg-[#F5F2EB]/5 border border-[#F5F2EB]/10 backdrop-blur-md rounded-3xl p-8 hover:bg-[#F5F2EB]/10 hover:border-[#C5A059]/30 transition-all duration-300 text-left flex flex-col gap-4">
          <span className="font-anton text-3xl text-[#C5A059]">01</span>
          <h3 className="font-anton text-xl text-[#F5F2EB] uppercase tracking-wide">Il Disegno</h3>
          <p className="text-[#F5F2EB]/75 text-sm leading-relaxed font-light">
            Ogni pizza nasce come un bozzetto di forme e colori. Studiamo la disposizione degli ingredienti per creare contrasti cromatici e strutturali che esaltino l'esperienza sensoriale prima ancora del primo morso.
          </p>
        </div>

        <div className="bg-[#F5F2EB]/5 border border-[#F5F2EB]/10 backdrop-blur-md rounded-3xl p-8 hover:bg-[#F5F2EB]/10 hover:border-[#C5A059]/30 transition-all duration-300 text-left flex flex-col gap-4">
          <span className="font-anton text-3xl text-[#C5A059]">02</span>
          <h3 className="font-anton text-xl text-[#F5F2EB] uppercase tracking-wide">La Tela</h3>
          <p className="text-[#F5F2EB]/75 text-sm leading-relaxed font-light">
            La nostra tela è un impasto a lievitazione naturale di 48 ore. Una miscela esclusiva di farine macinate a pietra di tipo 1 che garantisce una base soffice, estremamente alveolata e incredibilmente digeribile.
          </p>
        </div>

        <div className="bg-[#F5F2EB]/5 border border-[#F5F2EB]/10 backdrop-blur-md rounded-3xl p-8 hover:bg-[#F5F2EB]/10 hover:border-[#C5A059]/30 transition-all duration-300 text-left flex flex-col gap-4">
          <span className="font-anton text-3xl text-[#C5A059]">03</span>
          <h3 className="font-anton text-xl text-[#F5F2EB] uppercase tracking-wide">La Tavolozza</h3>
          <p className="text-[#F5F2EB]/75 text-sm leading-relaxed font-light">
            Selezioniamo ingredienti stagionali d'eccellenza, curando ogni abbinamento come un pigmento prezioso. Pomodori San Marzano DOP, latticini freschi e oli monovarietali sono i nostri colori d'elezione.
          </p>
        </div>
      </div>
    </div>
  );

  const MenuView = () => {
    const categories = [
      { id: 'antipasti', label: 'Antipasti' },
      { id: 'primi', label: 'Primi' },
      { id: 'secondi', label: 'Secondi' },
      { id: 'pizze', label: 'Pizze' },
      { id: 'dolci', label: 'Dolci' },
      { id: 'vini', label: 'Vini' },
      { id: 'bevande', label: 'Bevande' },
    ];

    return (
      <div className="max-w-6xl mx-auto w-full py-12 animate-fade-in px-6">
        <div className="text-center mb-10">
          <p className="text-[#C5A059] text-xs sm:text-sm uppercase tracking-[0.25em] font-medium mb-3">
            Autenticità & Ricerca
          </p>
          <h2 className="font-anton text-[#F5F2EB] text-4xl sm:text-6xl uppercase tracking-tight">
            Il Nostro Menu
          </h2>
        </div>

        {/* Underline tabs — horizontal scroll on mobile */}
        <div className="flex overflow-x-auto justify-start md:justify-center hide-scrollbar border-b border-white/10 mb-10 gap-0 -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveMenuCategory(cat.id)}
              className={`px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold uppercase whitespace-nowrap transition-all duration-200 cursor-pointer border-b-2 -mb-[1px] shrink-0 ${
                activeMenuCategory === cat.id
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#F5F2EB]/50 hover:text-[#F5F2EB] hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu items grid with stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MENU_DATA[activeMenuCategory]?.map((item, idx) => (
            <div
              key={`${activeMenuCategory}-${idx}`}
              onClick={() => {
                if (item.name === 'Margherita') {
                  setCurrentPage('margherita');
                }
              }}
              className="animate-slide-up bg-[#181818] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#C5A059]/30 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none group shadow-md"
              style={{ animationDelay: `${idx * 55}ms` }}
            >
              {/* Product Image */}
              <div className="w-full aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
                {item.name === 'Margherita' && (
                  <span className="absolute top-3 right-3 bg-[#C5A059] text-[#1C1C1C] text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-md">
                    Bestseller
                  </span>
                )}
                {item.name === 'Virgo Speciale' && (
                  <span className="absolute top-3 right-3 bg-[#9E2A2B] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-md">
                    Chef's pick
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-5 flex flex-col justify-center flex-grow text-left">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-[#F5F2EB] text-base sm:text-lg leading-tight group-hover:text-[#C5A059] transition-colors duration-200">
                    {renderProtectedText(item.name)}
                  </h3>
                  <span className="text-[#C5A059] font-anton text-sm sm:text-base whitespace-nowrap shrink-0 mt-0.5">
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ChiSiamoView = () => (
    <div className="max-w-4xl mx-auto w-full py-12 animate-fade-in px-6">
      <div className="text-center mb-12">
        <p className="text-[#C5A059] text-xs sm:text-sm uppercase tracking-[0.25em] font-medium mb-3">
          L'unione di due mondi
        </p>
        <h2 className="font-anton text-[#F5F2EB] text-4xl sm:text-6xl uppercase tracking-tight">
          Chi Siamo
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#F5F2EB]/90 leading-relaxed text-base md:text-lg text-left">
        <div className="bg-[#F5F2EB]/5 border border-[#F5F2EB]/10 backdrop-blur-md rounded-2xl p-6 sm:p-8">
          <h3 className="font-anton text-xl uppercase text-[#F5F2EB] mb-2">
            La Filosofia <span translate="no" className="notranslate">Virgo</span>
          </h3>
          <div className="w-12 h-[2px] bg-[#C5A059] mb-4" />
          <p className="mb-4">
            Nata dall'idea di fondere l'arte digitale e la cucina tradicional, <span translate="no" className="notranslate">Virgo</span> non è solo una pizzeria, ma un laboratorio gastronomico e visivo. Crediamo che la pizza sia un'opera d'arte tridimensionale, dove ogni ingrediente rappresenta un colore e un volume nello spazio del piatto.
          </p>
          <p>
            I nostri designer collaborano con i nostri pizzaioli per studiare geometrie di gusto e presentazioni che lasciano il segno, garantendo al contempo la massima digeribilità.
          </p>
        </div>

        <div className="bg-[#F5F2EB]/5 border border-[#F5F2EB]/10 backdrop-blur-md rounded-2xl p-6 sm:p-8">
          <h3 className="font-anton text-xl uppercase text-[#F5F2EB] mb-2">
            Ingredienti & Lievitazione
          </h3>
          <div className="w-12 h-[2px] bg-[#C5A059] mb-4" />
          <p className="mb-4">
            Il cuore del nostro successo risiede nella semplicità degli ingredienti primari. Utilizziamo farine macinate a pietra di tipo 1, idratazione all'80% e una lievitazione naturale a temperatura controllata per un minimo di 48 ore.
          </p>
          <p>
            Selezioniamo solo materie prime tutelate: Pomodoro San Marzano DOP dell'Agro Sarnese-Nocerino, Mozzarella di Bufala Campana DOP, Olio EVO spremuto a freddo e presidi Slow Food locali. Cotti rigorosamente in forno a legna a 450°C.
          </p>
        </div>
      </div>
    </div>
  );

  const PrenotaView = () => (
    <div className="max-w-2xl mx-auto w-full py-12 animate-fade-in px-6 text-[#F5F2EB] text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <p className="text-[#C5A059] text-xs sm:text-sm uppercase tracking-[0.25em] font-medium mb-3">
          Semplice & Veloce
        </p>
        <h2 className="font-anton text-[#F5F2EB] text-4xl sm:text-6xl uppercase tracking-tight">
          Prenota un Tavolo
        </h2>
      </div>

      <div className="bg-[#F5F2EB]/5 border border-[#F5F2EB]/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 w-full flex flex-col items-center gap-6 shadow-2xl">
        <p className="text-[#F5F2EB]/95 text-lg leading-relaxed mb-4 max-w-md">
          Per riservare il tuo tavolo da <strong className="text-[#C5A059] notranslate" translate="no">Virgo</strong>, contattaci direttamente tramite chiamata telefonica o inviaci un messaggio su WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {/* Phone Call */}
          <a
            href="tel:+390123456789"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase text-[#F5F2EB] border-2 border-[#F5F2EB]/20 hover:border-[#9E2A2B] hover:bg-[#9E2A2B] hover:text-[#F5F2EB] hover:scale-105 active:scale-95 transition-all cursor-pointer bg-[#F5F2EB]/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.25} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.622c0-1.173.945-2.118 2.118-2.118h3.042a1.875 1.875 0 011.858 1.554l.583 2.871a1.875 1.875 0 01-.739 1.986l-2.062 1.444A11.962 11.962 0 008.25 15.75l1.444-2.062a1.875 1.875 0 011.986-.739l2.872.583a1.875 1.875 0 011.554 1.858v3.042c0 1.173-.945 2.118-2.118 2.118L12 21.75c-5.228 0-9.75-4.522-9.75-9.75V6.622z" />
            </svg>
            <span>Chiamaci</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/390123456789?text=Ciao%20Pizzeria%20Virgo,%20vorrei%20prenotare%20un%20tavolo..."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase bg-[#C5A059] text-[#1C1C1C] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-[#1C1C1C]">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.016 14.12 1.01 11.999 1.01c-5.444 0-9.866 4.372-9.87 9.802 0 1.714.452 3.39 1.311 4.869L2.34 21.68l6.307-1.637zM17.7 14.537c-.313-.156-1.85-.905-2.138-1.01-.288-.106-.498-.156-.708.156-.21.312-.813 1.01-.996 1.218-.183.208-.366.234-.679.078-2.614-1.3-4.3-4.6-4.665-5.228-.313-.538.313-.498.898-1.547.078-.156.039-.286-.02-.39-.058-.105-.498-1.202-.682-1.644-.18-.432-.378-.372-.519-.379-.134-.007-.288-.008-.442-.008-.154 0-.404.058-.616.286-.211.228-.808.78-8.08.78.78-1.282.888-2.176 1.327-2.585c.44-.408.847-.514 1.155-.67.308-.156.616-.234.808-.078.192.156 1.727.818 1.881.922.154.104.25.156.404.286.154.13.077.208-.077.364s-.847.935-1.04 1.143c-.192.208-.385.234-.697.078-.312-.156-1.32-.486-2.515-1.55-1.094-.976-1.833-2.182-2.048-2.548-.216-.364-.023-.562.157-.74.162-.162.36-.42.54-.63.18-.21.24-.36.36-.598.12-.24.06-.45-.03-.65-.09-.2-.81-1.95-1.11-2.68z" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* Carousel mapping */}
            <div className="absolute inset-0" style={{ zIndex: 3 }}>
              {IMAGES.map((img, index) => {
                const role = getRole(index);
                const style = getRoleStyle(role);
                return (
                  <div
                    key={img.src}
                    style={{
                      ...itemCommonStyle,
                      ...style,
                    }}
                  >
                    <img
                      src={img.src}
                      alt={`Figurine ${index + 1}`}
                      className="w-full h-full object-contain select-none"
                      style={{ objectPosition: 'bottom center' }}
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>

            {/* Scattered Ingredients */}
            <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 25 }}>
              {INGREDIENTS_DATA[activeIndex]?.map((ing, ingIdx) => {
                const key = `${activeIndex}-${ingIdx}`;
                const offset = draggedOffsets[key] || { x: 0, y: 0 };
                return (
                  <div
                    key={key}
                    className={`absolute flex flex-col items-center gap-2 ${ing.animation}`}
                    style={{
                      ...ing.style,
                      ...(isMobile && ing.mobileStyle ? ing.mobileStyle : {}),
                    }}
                  >
                    {/* Draggable Inner Container */}
                    <div
                      onMouseDown={(e) => handleStart(key, e.clientX, e.clientY)}
                      onTouchStart={(e) => {
                        if (e.touches.length > 0) {
                          handleStart(key, e.touches[0].clientX, e.touches[0].clientY);
                        }
                      }}
                      className="flex flex-col items-center gap-2 pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                      style={{
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                        transition: activeDrag?.id === key ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                        willChange: 'transform',
                      }}
                    >
                      {/* Ingredient Circle */}
                      <div className="w-12 h-12 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-2 border-white/25 bg-white/10 backdrop-blur-md shadow-xl flex items-center justify-center p-1 hover:border-[#C5A059]/50 hover:scale-105 active:scale-95 transition-all duration-300">
                        <img
                          src={ing.src}
                          alt={ing.name}
                          className="w-full h-full object-cover rounded-full select-none pointer-events-none"
                          draggable={false}
                        />
                      </div>
                      {/* Ingredient Label */}
                      <span className="text-white text-[9px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider bg-black/45 backdrop-blur-sm px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full border border-white/15 shadow-sm select-none pointer-events-none">
                        {ing.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom-left Pizza del Mese panel */}
            <div
              className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 max-w-[320px] flex flex-col items-start text-left"
              style={{ zIndex: 60 }}
            >
              <p
                className="font-bold uppercase text-white mb-1 text-xs sm:text-sm opacity-75 tracking-wider"
                style={{ letterSpacing: '0.05em' }}
              >
                Pizza del mese
              </p>
              <p
                className="font-anton uppercase text-white mb-2 sm:mb-3 text-2xl sm:text-4xl leading-none"
                style={{ letterSpacing: '-0.02em' }}
              >
                {PIZZA_DEL_MESE[activeIndex].name}
              </p>
              <p
                className="hidden sm:block text-xs sm:text-sm text-white/80 mb-4 sm:mb-5 max-w-[280px]"
                style={{ lineHeight: 1.6 }}
              >
                {PIZZA_DEL_MESE[activeIndex].description}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('prev')}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-black flex items-center justify-center text-black bg-[#F5F2EB] hover:scale-108 hover:bg-[#F5F2EB]/80 active:scale-95 cursor-pointer focus:outline-none shadow-md"
                  style={{ transition: 'transform 150ms, background-color 150ms' }}
                  aria-label="Previous figurine"
                >
                  <ArrowLeft size={26} strokeWidth={2.25} />
                </button>
                <button
                  onClick={() => navigate('next')}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-black flex items-center justify-center text-black bg-[#F5F2EB] hover:scale-108 hover:bg-[#F5F2EB]/80 active:scale-95 cursor-pointer focus:outline-none shadow-md"
                  style={{ transition: 'transform 150ms, background-color 150ms' }}
                  aria-label="Next figurine"
                >
                  <ArrowRight size={26} strokeWidth={2.25} />
                </button>
                {/* Dot progress indicators */}
                <div className="flex items-center gap-1.5 ml-1">
                  {IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (isAnimating) return;
                        setIsAnimating(true);
                        setActiveIndex(i);
                        setTimeout(() => setIsAnimating(false), 650);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/65'
                      }`}
                      aria-label={`Vai alla pizza ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom-right link "SCOPRI IL MENU" */}
            <button
              onClick={() => setCurrentPage('introduzione')}
              className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 flex items-center gap-2 sm:gap-4 text-white uppercase no-underline transition-opacity duration-200 opacity-95 hover:opacity-100 cursor-pointer"
              style={{
                zIndex: 60,
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(20px, 4vw, 56px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              <span>SCOPRI DI PIÙ</span>
              <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
            </button>
          </>
        );
      case 'introduzione':
        return <IntroduzioneView />;
      case 'menu':
        return <MenuView />;
      case 'chi-siamo':
        return <ChiSiamoView />;
      case 'prenota':
        return <PrenotaView />;
      case 'margherita':
        return <MargheritaDetail onBack={() => setCurrentPage('menu')} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        backgroundColor: currentPage === 'home' ? IMAGES[activeIndex].bg : '#1C1C1C',
        fontFamily: "'Inter', sans-serif",
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={`relative w-full flex flex-col ${
        currentPage === 'home' ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      }`}
    >
      {/* 1. Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-40 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeFractalNoise type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* 2. Giant ghost text "Le Più richieste" on home page, "Virgo" on others */}
      <div
        className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none uppercase transition-all duration-500 ease-in-out text-center px-4"
        style={{
          zIndex: 2,
          top: currentPage === 'home' ? '12%' : '18%',
          fontFamily: "'Anton', sans-serif",
          fontSize: currentPage === 'home' ? 'clamp(40px, 11vw, 150px)' : 'clamp(90px, 28vw, 380px)',
          fontWeight: 900,
          color: currentPage === 'home' ? '#ffffff' : '#F5F2EB',
          opacity: currentPage === 'home' ? 0.9 : 0.04,
          lineHeight: 1,
          letterSpacing: '-0.01em',
          whiteSpace: currentPage === 'home' ? 'normal' : 'nowrap',
        }}
      >
        {currentPage === 'home' ? 'Le Più richieste' : <span translate="no" className="notranslate">Virgo</span>}
      </div>

      {/* Header (Navbar) */}
      <Header />

      {/* Content wrapper */}
      <div
        className={`relative w-full ${
          currentPage === 'home' 
            ? 'flex-1 overflow-hidden' 
            : currentPage === 'margherita'
              ? 'pt-16 pb-0'
              : 'overflow-y-auto pt-24 pb-16'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// NEW HEADER NAVIGATION BAR COMPONENTS & UTILITIES
// -------------------------------------------------------------

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

type LinkItem = {
  title: string;
  href: string;
  icon: any;
  description?: string;
};

const PizzaIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 11h.01M11 15h.01M16 16h.01" />
    <path d="M20 20c-.5-3.5-2.5-6.5-5.5-8.5C11.5 9.5 8.5 8.5 5 8" />
    <path d="M5 8c-.5 0-.8.4-.7.9l3.5 12c.1.4.5.7.9.7h10.5c.5 0 .9-.4.8-.9z" />
    <circle cx="10" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="16" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="0.8" fill="currentColor" />
  </svg>
);

const AntipastiIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12h3" />
    <rect x="6" y="7" width="15" height="10" rx="2" />
    <path d="M9 10a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 0 0-3H9z" />
    <path d="M15 10a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 0 0-3h-2z" />
    <circle cx="13" cy="12" r="1" fill="currentColor" />
  </svg>
);

const PastaIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 13h18c0 4-4 7-9 7s-9-3-9-7z" />
    <path d="M2 13h20" />
    <path d="M7 10c1.5-2 2-2 3.5 0s2-2 3.5 0" />
    <path d="M5 11c1-1.5 2-1.5 3 0s2-1.5 3 0s2-1.5 3 0" />
    <path d="M9 8c1-1.5 1.5-1.5 2.5 0" />
    <path d="M16 4v5M14 4h4M14 6h4M16 9c.5.5.5 1.5 0 2l-1 1" />
  </svg>
);

const SecondiIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 18h18" />
    <path d="M5 18a1 1 0 0 0-1 1v1h16v-1a1 1 0 0 0-1-1H5z" />
    <path d="M4 15c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
    <path d="M12 4v3" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
  </svg>
);

const DolciIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 20h18" />
    <path d="M21 16l-9-9-9 4v5h18v-4z" />
    <path d="M3 13.5h18" />
    <path d="M12 7V3" />
    <path d="M11.5 2.5s.5-1.5 1-1.5 1 1.5 1 1.5-1.5.5-2 0z" />
  </svg>
);

const BevandeViniIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 22V8c0-1.5 1-2.5 1.5-3.5V2h3v2.5c.5 1 1.5 2 1.5 3.5v14H8z" />
    <path d="M8 11h6" />
    <path d="M17 14c0 2 1.5 3.5 3 3.5V11h-3v3z" />
    <path d="M18.5 17.5v3" />
    <path d="M17 21h3" />
  </svg>
);

const productLinks: LinkItem[] = [
  {
    title: 'Pizze',
    href: '#menu-pizze',
    description: 'Le nostre specialità cotte nel forno a legna',
    icon: PizzaIcon,
  },
  {
    title: 'Antipasti',
    href: '#menu-antipasti',
    description: 'Salumi, formaggi e sfiziosità calde',
    icon: AntipastiIcon,
  },
  {
    title: 'Primi Piatti',
    href: '#menu-primi',
    description: 'Pasta fresca della tradizione campana',
    icon: PastaIcon,
  },
  {
    title: 'Secondi',
    href: '#menu-secondi',
    description: 'Carni selezionate e parmigiana al forno',
    icon: SecondiIcon,
  },
  {
    title: 'Dolci',
    href: '#menu-dolci',
    description: 'Tiramisù e specialità della casa',
    icon: DolciIcon,
  },
  {
    title: 'Bevande & Vini',
    href: '#menu-vini',
    description: 'Birre artigianali e vini campani DOCG',
    icon: BevandeViniIcon,
  },
];





export function Header() {
  const [open, setOpen] = useState(false);
  const [activePage, setActivePage] = useState(() =>
    typeof window !== 'undefined' ? (window.location.hash.replace('#', '') || 'home') : 'home'
  );
  const scrolled = useScroll(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handler = () => setActivePage(window.location.hash.replace('#', '') || 'home');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const handleLogoDoubleClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 800);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? 'bg-[#1C1C1C]/95 border-[#C5A059]/25 shadow-lg'
          : 'bg-[#1C1C1C]/75 border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <a
          ref={logoRef}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '';
            setOpen(false);
          }}
          onDoubleClick={handleLogoDoubleClick}
          translate="no"
          className={`notranslate font-anton text-2xl uppercase tracking-wider text-[#C5A059] hover:opacity-80 transition-opacity select-none p-2 ${
            isSpinning ? 'animate-spin-3d' : ''
          }`}
        >
          Virgo
        </a>
        
        <div className="hidden items-center gap-4 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Menu</NavigationMenuTrigger>
                <NavigationMenuContent className="p-1 pr-1.5 bg-[#1C1C1C] border border-[#C5A059]/30 rounded-xl shadow-2xl">
                  <ul className="grid w-[500px] grid-cols-2 gap-2 p-2">
                    {productLinks.map((item, i) => (
                      <li key={i}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 border-t border-white/10 mt-1 text-left">
                    <p className="text-white/60 text-xs">
                      Hai una richiesta speciale?{' '}
                      <a href="#prenota" className="text-[#C5A059] font-medium hover:underline">
                        Contattaci
                      </a>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <button
            onClick={() => window.location.hash = 'chi-siamo'}
            className={`relative group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer ${
              activePage === 'chi-siamo' ? 'text-[#C5A059]' : 'text-[#F5F2EB] hover:text-[#C5A059]'
            }`}
          >
            Chi Siamo
            <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-[#C5A059] rounded-full transition-transform origin-left duration-200 ${
              activePage === 'chi-siamo' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </button>
          
          <Button onClick={() => window.location.hash = 'prenota'}>
            Prenota un Tavolo
          </Button>
        </div>
        
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden border-2 border-black bg-white/10"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5 text-[#C5A059]" duration={300} />
        </Button>
      </nav>
      
      <MobileMenu open={open} className="flex flex-col justify-between gap-6 overflow-y-auto">
        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-4">
            <span className="text-xs uppercase font-bold text-[#C5A059] tracking-widest text-left">Menu</span>
            <div className="grid grid-cols-1 gap-1">
              {productLinks.map((link) => (
                <ListItem key={link.title} {...link} onClick={() => setOpen(false)} />
              ))}
            </div>
          </div>
        </NavigationMenu>
        
        <div className="flex flex-col gap-2 mt-4 pb-6">
          <Button variant="outline" className="w-full bg-transparent border-2 border-black" onClick={() => { setOpen(false); window.location.hash = 'chi-siamo'; }}>
            Chi Siamo
          </Button>
          <Button className="w-full border-2 border-black" onClick={() => { setOpen(false); window.location.hash = 'prenota'; }}>
            Prenota un Tavolo
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<'div'> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div
      id="mobile-menu"
      className="fixed top-16 right-0 bottom-0 left-0 z-[80] flex flex-col overflow-hidden border-t border-[#C5A059]/25 bg-[#1C1C1C]/95 backdrop-blur-lg md:hidden"
    >
      <div
        data-slot={open ? 'open' : 'closed'}
        className="size-full p-6 flex flex-col justify-between overflow-y-auto"
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  onClick,
  ...props
}: any) {
  return (
    <NavigationMenuLink
      className={`w-full flex flex-row gap-x-3 hover:bg-white/5 rounded-lg p-2.5 transition-colors text-left`}
      onClick={onClick}
      {...props}
      asChild
    >
      <a href={href}>
        <div className="bg-white/5 flex aspect-square size-10 items-center justify-center rounded-md border border-white/10 shadow-sm">
          <Icon className="text-[#C5A059] size-5" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-semibold text-sm text-[#F5F2EB]">{title}</span>
          {description && <span className="text-white/60 text-[11px] leading-snug mt-0.5">{description}</span>}
        </div>
      </a>
    </NavigationMenuLink>
  );
}



export default App;
