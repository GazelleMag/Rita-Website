import { Component, HostListener } from '@angular/core';
import { ContactComponent } from './contact/contact.component';
import { AboutMeComponent } from "./about-me/about-me.component";
import { ExperienceComponent } from "./experience/experience.component";

@Component({
  selector: 'app-root',
  imports: [
    ContactComponent,
    AboutMeComponent,
    ExperienceComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private currentSectionIndex: number = 0;
  private sections: HTMLElement[] = [];
  private resizeTimeout: any = null;
  private touchStartY: number = 0;
  private touchEndY: number = 0;
  private minSwipeDistance: number = 50;
  private isScrolling: boolean = false;

  ngAfterViewInit(): void {
    this.sections = Array.from(document.querySelectorAll('.section'));
    this.adjustSectionHeights();

    setTimeout(() => {
      this.smoothScroll();
    }, 100);
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY > 0) {
      this.scrollToNext();
    } else {
      this.scrollToPrevious();
    }

    setTimeout(() => {
      this.isScrolling = false;
    }, 400);
  }

  // scroll for mobile
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (this.isScrolling) {
      return;
    }
    this.touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = this.touchStartY - this.touchEndY;
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      this.isScrolling = true;

      if (swipeDistance > 0) {
        this.scrollToNext();
      } else {
        this.scrollToPrevious();
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, 400);
    }
  }

  private scrollToNext(): void {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
      this.smoothScroll();
    } else {
      this.isScrolling = false;
    }
  }

  private scrollToPrevious(): void {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.smoothScroll();
    } else {
      this.isScrolling = false;
    }
  }

  private smoothScroll(): void {
    this.sections[this.currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.adjustSectionHeights();
      this.smoothScroll();
    }, 150);
  }

  private adjustSectionHeights(): void {
    const viewportHeight = document.documentElement.clientHeight;
    this.sections.forEach(section => {
      section.style.height = `${viewportHeight}px`
      section.style.maxHeight = `${viewportHeight}px`;
    });
    document.body.offsetHeight;
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 50);
  }
}
