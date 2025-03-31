import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
  animations: [
    trigger('slideInLeft', [
      state('hidden', style({ transform: 'translateX(-50%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('hidden <=> visible', animate('0.5s ease-out'))
    ]),
    trigger('slideInRight', [
      state('hidden', style({ transform: 'translateX(50%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('hidden <=> visible', animate('0.5s ease-out'))
    ]),
    trigger('heartbeat', [
      state('start', style({ opacity: 1 })),
      state('end', style({ opacity: 0.6 })),
      transition('start => end', animate('0.5s ease-in-out')),
      transition('end => start', animate('0.5s ease-in-out'))
    ]),
    trigger('fadeInFadeOut', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden <=> visible', animate('1s ease'))
    ])
  ]
})
export class AboutMeComponent {
  public isVisible: boolean = false;
  public isMobile: boolean = window.innerWidth < 768;

  public heartbeatState: 'start' | 'end' = 'start';
  private heartbeatInterval: any = null;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.ngZone.run(() => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) {
            this.startHeartbeatLoop();
          } else {
            this.stopHeartbeatLoop();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(this.elementRef.nativeElement);
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  private startHeartbeatLoop(): void {
    if (!this.heartbeatInterval) {
      this.heartbeatInterval = setInterval(() => {
        this.toggleHeartbeatState();
      }, 550);
    }
  }

  private stopHeartbeatLoop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private toggleHeartbeatState(): void {
    this.heartbeatState = this.heartbeatState === 'start' ? 'end' : 'start';
  }
}
