import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CodeAndDescription } from '../coin-converter.interfaces';

@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.css']
})
export class InputAutocompleteComponent {
  @Input() inputName!: string;
  @Input() placeholder!: string;
  @Input() coins!: CodeAndDescription[];

  @Input() form!: string;
  @Output() formChange = new EventEmitter<string>();


  changeInputValue() {
    this.formChange.emit(this.form);
  }
}
