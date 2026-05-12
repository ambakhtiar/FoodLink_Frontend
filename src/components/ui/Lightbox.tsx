"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";

interface LightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "ArrowRight") onNext();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose, onPrev, onNext]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
                onClick={onClose}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}

                {/* Prev */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Image */}
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative max-w-5xl max-h-[90vh] w-full h-full mx-16"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                </motion.div>

                {/* Next */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    // Navigate to image i — caller must handle via index
                                    const diff = i - currentIndex;
                                    if (diff > 0) for (let j = 0; j < diff; j++) onNext();
                                    else for (let j = 0; j < -diff; j++) onPrev();
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    i === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// ── Hook for lightbox state ───────────────────────────────────────────────────
import { useState } from "react";

export function useLightbox(images: string[]) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openAt = (i: number) => setLightboxIndex(i);
    const close = () => setLightboxIndex(null);
    const prev = () => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
    const next = () => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length));

    const lightboxProps =
        lightboxIndex !== null
            ? { images, currentIndex: lightboxIndex, onClose: close, onPrev: prev, onNext: next }
            : null;

    return { openAt, lightboxProps };
}
