"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, Laptop, MessageCircle, Mail, X, Plus } from "lucide-react";

export type Category = { id: string; name: string; };
export type Banner = { id: string; title: string; subtitle: string; imageUrl: string; };
export type Product = { id: string; name: string; description: string; price: number; type: string; categoryId: string | null; duration: number | null; stock: number; imageUrl: string | null; };

interface HomeClientProps { products: Product[]; categories: Category[]; banners: Banner[]; }

export default function HomeClient({ products, categories, banners }: HomeClientProps) {
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Evitar scroll cuando el modal está abierto
  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  const dynamicFilters = useMemo(() => [
    { id: 'ALL', label: 'Todo el compendio' }, 
    ...categories.map(cat => ({ id: cat.id, label: cat.name }))
  ], [categories]);
  
  const filteredProducts = useMemo(() => 
    products.filter(product => activeFilter === 'ALL' || product.categoryId === activeFilter || product.type === activeFilter)
  , [products, activeFilter]);

  const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || null });
  };

  return (
    <div className="w-full relative">
      
      {/* 1. HERO BANNERS (Opcional, si tienes banners en la BD) */}
      {banners.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 mt-8">
          <div className="relative w-full h-[40vh] sm:h-[60vh] rounded-[2rem] overflow-hidden shadow-sm">
            <Image src={banners[0].imageUrl} alt={banners[0].title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 sm:p-16 text-white">
              <h2 className="font-playfair text-4xl sm:text-6xl mb-2">{banners[0].title}</h2>
              <p className="text-sm uppercase tracking-[0.2em]">{banners[0].subtitle}</p>
            </div>
          </div>
        </section>
      )}

      {/* 2. TESTIMONIOS (Diseño exacto a la imagen) */}
      <section id="testimonios" className="w-full max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-5xl md:text-6xl text-foreground mb-4">
          Testimonios <br/><span className="text-gold italic font-light">de corazón 🤍</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base mb-12">
          Cada testimonio es una historia de transformación y un recordatorio de que sanar es posible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-50 hover:shadow-lg transition-mystic flex flex-col h-full">
              <div className="flex text-gold mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="mr-1" />)}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                "Hola Johana, buenos días. Quiero agradecerte de corazón tu limpieza, hace muchos meses que no sentía esta tranquilidad... Estoy tan feliz, no siento odio, solo tranquilidad."
              </p>
              <div className="text-center text-purple-300">❦</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TERAPIAS */}
      <section id="terapias" className="w-full bg-white py-20 border-y border-purple-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl text-foreground mb-2">Acompaño tu proceso</h2>
          <h3 className="font-playfair text-3xl text-gold italic mb-10">de transformación</h3>
          
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 mt-12">
            {['Radiestesia', 'Péndulo Hebreo', 'Cruz de Ankh', 'Esencias de Bach'].map((therapy) => (
              <div key={therapy} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-lavender flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-white transition-mystic text-2xl shadow-sm">
                  ✨
                </div>
                <span className="text-sm font-medium text-gray-700">{therapy}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOUTIQUE (Conexión a tu Base de Datos) */}
      <section id="boutique" className="w-full max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl text-foreground mb-2">Boutique Holística</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto mt-4"></div>
        </div>

        {/* Filtros de la BD */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {dynamicFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-mystic ${
                activeFilter === filter.id 
                  ? 'bg-foreground text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gold hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <article 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-mystic cursor-pointer flex flex-col"
            >
              <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 mb-4">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 768px) 100vw, 25vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">✨</div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 text-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {product.type === 'SERVICE' ? 'Terapia' : 'Producto'}
                </span>
              </div>
              
              <h3 className="font-playfair text-xl text-foreground mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="font-playfair text-xl font-medium">{formatPrice(product.price)}</span>
                <button 
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={product.stock === 0}
                  className="bg-lavender text-foreground p-3 rounded-full hover:bg-gold hover:text-white transition-mystic disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. CONTACTO */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-20 text-center">
        <h2 className="font-playfair text-4xl text-foreground mb-2">Estoy aquí para ti</h2>
        <h3 className="font-playfair text-2xl text-gold italic mb-10">Agenda tu sesión</h3>
        
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-purple-50 flex flex-col md:flex-row justify-around items-center gap-8">
          <div className="flex flex-col items-center">
            <Laptop className="text-gold mb-3" size={32} strokeWidth={1.5} />
            <span className="font-medium text-foreground">Modalidad</span>
            <span className="text-sm text-gray-500">Online / Presencial</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="text-gold mb-3" size={32} strokeWidth={1.5} />
            <span className="font-medium text-foreground">WhatsApp</span>
            <span className="text-sm text-gray-500">+56 9 XXXX XXXX</span>
          </div>
          <div className="flex flex-col items-center">
            <Mail className="text-gold mb-3" size={32} strokeWidth={1.5} />
            <span className="font-medium text-foreground">Email</span>
            <span className="text-sm text-gray-500">contacto@liberacion.cl</span>
          </div>
        </div>
      </section>

      {/* 6. MODAL DE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-gray-500 hover:text-black">
              <X size={20} />
            </button>
            <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto md:h-[500px] bg-gray-50">
              {selectedProduct.imageUrl && <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-cover" />}
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <h2 className="font-playfair text-3xl md:text-4xl text-foreground mb-4">{selectedProduct.name}</h2>
              <div className="w-12 h-[1px] bg-gold mb-6"></div>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{selectedProduct.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                <span className="font-playfair text-3xl text-foreground">{formatPrice(selectedProduct.price)}</span>
                <button 
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  disabled={selectedProduct.stock === 0}
                  className="bg-foreground text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-gold transition-mystic"
                >
                  {selectedProduct.stock === 0 ? 'Agotado' : 'Adquirir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}