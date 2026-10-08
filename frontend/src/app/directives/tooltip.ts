import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class Tooltip {
  @Input('appTooltip') tooltipText = '';
  private tooltipElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;

    this.tooltipElement = this.renderer.createElement('div');
    const text = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, text);

    const classes = [
      'absolute', 'z-50', 'px-2.5', 'py-1', 'text-xs', 'font-medium',
      'text-slate-200', 'bg-slate-900', 'border', 'border-slate-700',
      'rounded-md', 'shadow-xl', 'whitespace-nowrap', 'pointer-events-none'
    ];
    classes.forEach(c => this.renderer.addClass(this.tooltipElement!, c));

    this.renderer.appendChild(document.body, this.tooltipElement);

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement!.getBoundingClientRect();

    const top = hostRect.top - tooltipRect.height - 8 + window.scrollY;
    const left = hostRect.left + (hostRect.width / 2) - (tooltipRect.width / 2) + window.scrollX;

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  @HostListener('mouseleave')
  @HostListener('click')
  hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  ngOnDestroy() {
    this.hideTooltip();
  }
}
