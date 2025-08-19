import Lazyload from "@/assets/publish/src/script/ui/Lazyload";
import { Slider, Carousel } from "@/assets/publish/src/script/ui/sliders";

export function carouselUpdate(elementSelector: ElementSelector, data: CarouselData = {}, onCatch?: (ui: Carousel) => void): Carousel[] {
    return Carousel.update(elementSelector, data, onCatch);
}

export function carouselReload(element: ElementSelector): void {
    Carousel.reload(element)
}

export function carouselResize(elementSelector: ElementSelector, time?: number): void {
    Carousel.resize(elementSelector, time);
}

export function sliderUpdate(element: ElementSelector,  data: SliderData = {}, onCatch?: (ui: Slider) => void): Slider[] {
    return Slider.update(element, data, onCatch)
}

export function sliderReload(element: ElementSelector): void {
    Slider.reload(element)
}

export function lazyloadUpdate(element: ElementSelector): void {
    Lazyload.update(element)
}
