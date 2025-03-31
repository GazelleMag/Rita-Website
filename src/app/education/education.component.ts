import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
  animations: [
    trigger('fadeInFadeOut', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden <=> visible', animate('1s ease'))
    ])
  ]
})
export class EducationComponent {
  public isVisible: boolean = false;
  public isMobile: boolean = window.innerWidth < 768;
  public activeSections: Set<string> = new Set();
  public educationSections = [
    {
      title: 'Specialization in Clinical Research & Project Management',
      startYear: 2024,
      startMonth: 'November',
      endYear: 2025,
      endMonth: 'January',
      location: 'Invictus Sciences'
    },
    {
      title: 'Specialization in Emergency and Disaster Intervention',
      startYear: 2023,
      startMonth: 'March',
      endYear: 2023,
      endMonth: 'July',
      location: 'University of Coimbra'
    },
    {
      title: 'Basic Officer Training Course',
      startYear: 2022,
      startMonth: 'January',
      endYear: 2022,
      endMonth: 'March',
      location: 'Portuguese Naval School'
    },
    {
      title: 'Master Degree in Pharmaceutical Sciences',
      startYear: 2014,
      startMonth: 'September',
      endYear: 2021,
      endMonth: 'January',
      location: 'University of Beira Interior'
    }
  ];
  public certificationSections = [
    {
      title: 'Fundamentals of Good Clinical Practice: Prep and Personnel',
      startYear: 2024,
      startMonth: 'October',
      endYear: 2024,
      endMonth: 'November',
      location: 'Novartis'
    },
    {
      title: 'Targets, Assays & Screening',
      startYear: 2024,
      startMonth: 'September',
      endYear: 2024,
      endMonth: 'October',
      location: 'Novartis'
    },
    {
      title: 'Business English Part 1, 2, 3',
      startYear: 2024,
      startMonth: 'September',
      endYear: 2024,
      endMonth: 'September',
      location: 'Santander Open Academy'
    },
    {
      title: 'Leadership Course',
      startYear: 2022,
      startMonth: 'October',
      endYear: 2022,
      endMonth: 'November',
      location: 'Marine Corps Portuguese School'
    }
  ]

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
    if (this.isMobile) {
      this.activeSections.clear();
    }
  }

  public toggleSection(index: number, type: 'education' | 'certification'): void {
    const key = `${type}-${index}`
    if (this.isMobile) {
      this.activeSections.clear();
      this.activeSections.add(key);
    }
    else {
      if (this.activeSections.has(key)) {
        this.activeSections.delete(key);
      } else {
        this.activeSections.add(key);
      }
    }
  }
}
