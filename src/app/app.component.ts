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

  ngAfterViewInit(): void {
    this.sections = Array.from(document.querySelectorAll('.section'));
    this.adjustSectionHeights();
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY > 0) {
      this.scrollToNext();
    } else {
      this.scrollToPrevious();
    }
  }

  private scrollToNext(): void {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
      this.smoothScroll();
    }
  }

  private scrollToPrevious(): void {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.smoothScroll();
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
    const viewportHeight = window.innerHeight;
    this.sections.forEach(section => {
      section.style.height = `${viewportHeight}px`;
    });
  }
}
