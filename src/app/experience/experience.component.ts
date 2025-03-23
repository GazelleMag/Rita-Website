import { Component, ElementRef, ChangeDetectorRef, NgZone, ViewChildren, QueryList, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  animations: [
    trigger('fadeInFadeOut', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden <=> visible', animate('1s ease'))
    ]),
    trigger('timelineRetract', [
      state('extended', style({})),
      state('retracted', style({})),
      transition('extended <=> retracted', animate('500ms ease'))
    ]),
    trigger('detailsFadeIn', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('400ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  public isVisible: boolean = false;
  public isMobile: boolean = window.innerWidth < 768;
  private resizeTimeout: any = null;
  public timelineExperiences = [
    {
      startYear: '2012',
      startMonth: 'June',
      endYear: '2020',
      endMonth: 'September',
      title: 'Customer Support',
      location: 'AG Têxtil | Lepe, Spain',
      description: `
      Managed inventory and logistics, ensuring product availability and accurate orderfulfillment.<br>
      Led digital marketing efforts, updating the company website and social media to enhance outreach.
      `
    },
    {
      startYear: '2021',
      startMonth: 'March',
      endYear: '2021',
      endMonth: 'December',
      title: 'Community Pharmacist',
      location: 'Farmácia Silvério & Farmácia de Gualtar (Pharmacies) | Braga, Portugal',
      description: `
      Conducted medication therapy reviews to optimize patient treatment plans and ensure drug safety.<br>
      Provided scientific education on vaccines, addressing patient concerns regarding efficacy and safety, educating patients on public health policies, including COVID-19 guidelines.
      `
    },
    {
      startYear: '2022',
      startMonth: 'March',
      endYear: '2023',
      endMonth: 'December',
      title: 'Assistant Chief of the Medication Dispensing',
      location: 'Logistics Department (OF-D) at Portuguese Navy | Almada, Portugal',
      description: `
      Assessed operational medical needs and analyzed supply chain logistics.<br>
      Provided training on pharmaceutical logistics to medical staff and interns.
      `
    },
    {
      startYear: '2022',
      startMonth: 'November',
      endYear: '2024',
      endMonth: 'January',
      title: 'Community Pharmacist',
      location: 'Farmácia Louro (Pharmacy) | Almada, Portugal',
      description: `
      Provided scientific education on medication use, safety, and adherence to patients.<br>
      Engaged in pharmacovigilance by monitoring adverse drug reactions and patient feedback.
      `
    },
    {
      startYear: '2023',
      startMonth: 'December',
      endYear: '2024',
      endMonth: 'December',
      title: 'Head of the Medication Dispensing Service',
      location: 'Health Logistics Department (OF-1 Ensign) at Portuguese Navy | Lisbon, Portugal',
      description: `
      Managed pharmaceutical supply chain, ensuring efficient medication distribution for operational and clinical settings.<br>
      Collaborated with medical teams to ensure proper drug selection and availability for overseas missions.<br>
      Participated in strategic discussions regarding medical logistics optimization and treatment guidelines.
      `
    },
    {
      startYear: '2023',
      startMonth: 'October',
      endYear: 'Present',
      endMonth: '',
      title: 'Member of the NFM Group',
      location: 'Ordem dos Farmacêuticos | Lisbon, Portugal',
      description: `
      Act as the Pharmaceutical Representative for the Portuguese Navy within the Military Pharmacy Group, ensuring alignment with operational healthcare needs.<br>
      Organize and contribute to congresses, training programs, and workshops on key pharmaceutical and medical topics.<br>
      Develop and deliver scientific content on operational health, medical emergencies, disaster response, and critical drug reserves management.<br>
      Collaborate with military healthcare professionals to enhance medical readiness and pharmaceutical logistics in high-stakes environments.
      `
    },
    {
      startYear: '2024',
      startMonth: 'December',
      endYear: 'Present',
      endMonth: '',
      title: 'Head of Confirmation Testing Service',
      location: 'Military Toxicology Unit (OF-1 Ensign) at Portuguese Navy | Lisbon, Portugal',
      description: `
      Perform advanced toxicological analyses using cutting-edge laboratory techniques (GC-MS) to confirm the presence of controlled substances, ensuring forensic-level accuracy.<br>
      Investigate potential false positives, environmental contamination, and metabolic variations to guarantee the integrity of test results.<br>
      Present findings to military healthcare professionals and leadership, aiding in informed decision-making.<br>
      Deliver briefings and technical presentations to leadership, ensuring an understanding of trends in substance use, operational risks, and necessary interventions.
      `
    }
  ];
  public selectedExperience: any = null;
  @ViewChildren('nodeElement') nodes!: QueryList<ElementRef>;
  public isTimelineRetracted: boolean = false;

  constructor(private elementRef: ElementRef, private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.ngZone.run(() => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) {
            setTimeout(() => this.updateTimelineCentralLine(), 100);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(this.elementRef.nativeElement);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateTimelineCentralLine();
      this.cdr.detectChanges();
    }, 100);
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  selectExperience(experience: any) {
    if (this.selectedExperience === experience) {
      return;
    }
    this.selectedExperience = experience;
    this.isTimelineRetracted = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.updateTimelineCentralLine();
    }, 0);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.checkScreenSize();
    this.resizeTimeout = setTimeout(() => {
      this.updateTimelineCentralLine();
      this.cdr.detectChanges();
    }, 150);
  }

  private updateTimelineCentralLine(): void {
    const timelineWrapper = this.elementRef.nativeElement.querySelector('.timeline-wrapper');
    const nodes = this.elementRef.nativeElement.querySelectorAll('.timeline-node');
    const timelineLine = this.elementRef.nativeElement.querySelector('.timeline-central-line');
    if (!timelineWrapper || !nodes.length || !timelineLine) {
      return;
    }
    // Get the first and last node elements
    const firstNodeDot = nodes[0].querySelector('.node');
    const lastNodeDot = nodes[nodes.length - 1].querySelector('.node');
    if (!firstNodeDot || !lastNodeDot) {
      return;
    }
    // Get the positions relative to the wrapper
    const wrapperRect = timelineWrapper.getBoundingClientRect();
    const firstDotRect = firstNodeDot.getBoundingClientRect();
    const lastDotRect = lastNodeDot.getBoundingClientRect();
    // Calculate the exact center of the node dot
    // For horizontal position: left edge of dot + half of dot width
    const nodeDotCenter = firstDotRect.left + (firstDotRect.width / 2);
    // Calculate line position relative to wrapper
    // Subtract wrapper's left position to get relative position
    const lineLeftPosition = nodeDotCenter - wrapperRect.left;
    // Set line position - subtract half of line width (1px) for perfect centering
    timelineLine.style.left = `${lineLeftPosition - 1}px`;
    if (this.isTimelineRetracted) {
      // When retracted, the line should only connect the nodes
      // For first dot: top position is top edge of dot + half of dot height
      const firstDotCenter = firstDotRect.top + (firstDotRect.height / 2);
      const lastDotCenter = lastDotRect.top + (lastDotRect.height / 2);
      // Calculate top position relative to wrapper
      const lineTopPosition = firstDotCenter - wrapperRect.top;
      // Calculate height as distance between centers of first and last dots
      const lineHeight = lastDotCenter - firstDotCenter;
      timelineLine.style.top = `${lineTopPosition}px`;
      timelineLine.style.height = `${lineHeight}px`;
    } else {
      // When extended, the line should span the full height of the wrapper
      timelineLine.style.top = '0';
      timelineLine.style.height = '100%';
    }
  }
}
