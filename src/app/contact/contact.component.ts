import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  animations: [
    trigger('fadeInFadeOut', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden <=> visible', animate('1s ease'))
    ]),
  ]
})
export class ContactComponent {
  public isVisible: boolean = false;
  public isMobile: boolean = window.innerWidth < 768;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.ngZone.run(() => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(this.elementRef.nativeElement);
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  public getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
