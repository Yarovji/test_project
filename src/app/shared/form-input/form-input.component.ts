import {
  Component,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NgControl,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';

import { InputTypesEnum } from '../../enums/input-types.enum';

type ControlValueType = string | Pick<any, 'value' | 'title'>;
@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  public label = input<string>('');
  public placeholder = input<string>('');
  public type = input<InputTypesEnum>(InputTypesEnum.Text);
  public errorsMessages = input<ValidationErrors>();
  public inputType: WritableSignal<InputTypesEnum | null> = signal(null);

  public get value(): ControlValueType {
    return this.controlValue;
  }

  public set value(value: ControlValueType) {
    if (value !== this.controlValue) {
      this.controlValue = value;
      if (typeof value === 'string') {
        this.onChange(value);
      }
    }
  }

  public get hasControlError(): boolean | null {
    return this.control
      ? (this.control().invalid && this.control().dirty) ||
          (this.control().root?.errors && this.control().dirty)
      : false;
  }

  public get errorKeys(): string[] {
    return Object.keys(this.control()?.errors || {});
  }

  public control: WritableSignal<UntypedFormControl>;
  public onTouch: () => void;
  private onChange: (val: string) => void;
  private controlValue: ControlValueType = '';

  constructor(public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  public ngOnInit(): void {
    this.control = signal(this.ngControl.control as UntypedFormControl);
    this.setInputType(this.type());
  }

  public writeValue(value: ControlValueType): void {
    this.controlValue = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  private setInputType(type: InputTypesEnum): void {
    this.inputType.set(
      type === InputTypesEnum.Password
        ? InputTypesEnum.Password
        : InputTypesEnum.Text,
    );
  }
}
