import {Component, Input, ViewChild, ElementRef, Renderer2} from '@angular/core';

import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';


@Component({
  selector: 'accordion',
  templateUrl: 'accordion.component.html',
  animations: [

    trigger('ngIfAnimation', [
      transition('void => *', [
        style({transform: 'translateX(100%)'}),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({transform: 'translateX(100%)'}))
      ])
    ])

  ]
})
export class AccordionComponent {

  @Input('expanded') expanded = false;

  constructor() {

  }

  toggle(){
    this.expanded = !this.expanded;
  }
}
