import { useRef } from "react";
import "./App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import StartPage from "./pages/start/StartPage";
import BookingPage from "./pages/booking/BookingPage";
import ConfirmationPage from "./pages/confirmation/ConfirmationPage";
import Menu from "./components/menu/Menu";
import DotPager from "./components/dotpager/DotPager";
import { useBooking } from "./store/booking";

type Step = 0 | 1 | 2;

export default function App() {
  const swiperRef = useRef<SwiperType | null>(null);
  const step      = useBooking(s => s.step);
  const setStep   = useBooking(s => s.setStep);

  const onSwiper = (s: SwiperType) => { swiperRef.current = s; };
  const onSlideChange = (s: SwiperType) => setStep(s.activeIndex as Step);

  const goTo = (index: number) => {
    setStep(index as Step);
    swiperRef.current?.slideTo(index);
  };

  /*eslint-disable*/
  return (
    <main className="app">
      <Menu onNavigate={(i) => goTo(i)} />
      <Swiper
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        allowTouchMove
        touchStartPreventDefault={false}
        threshold={8}
        resistanceRatio={0.65}
        spaceBetween={16}
        slidesPerView={1}
        className="swiper-root"
        noSwiping
        noSwipingClass="swiper-no-swiping"
      >
        <SwiperSlide><StartPage onNext={() => goTo(1)} /></SwiperSlide>
        <SwiperSlide><BookingPage onConfirm={() => goTo(2)} /></SwiperSlide>
        <SwiperSlide>
            <ConfirmationPage
              {...({ onGoStart: () => goTo(0), onGoBooking: () => goTo(1) } as any)}
            />
        </SwiperSlide>
      </Swiper>
      <DotPager current={step} total={3} onGo={goTo} />
    </main>
  );
}
