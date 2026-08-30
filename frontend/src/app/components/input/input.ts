import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class InputComponent {
  @Input() value: string = '';

  //emite o novo valor para o "pai"
  @Output() valueChange = new EventEmitter<string>();

  @Input() hasError: boolean = false;

  onTyping(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
