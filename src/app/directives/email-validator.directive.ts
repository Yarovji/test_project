import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

import { ValidatorsConst } from '../constants/validators.const';

@Directive({
  selector: '[appEmailValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class EmailValidatorDirective implements Validator {
  validate(control: FormControl) {
    if (!control.value) {
      return null;
    }
    const valid = ValidatorsConst.email.test(control.value);
    return valid ? null : { invalidEmail: true };
  }
}
