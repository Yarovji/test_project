import {
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { InputTypesEnum } from '../../enums/input-types.enum';
import { ValidatorsConst } from '../../constants/validators.const';
import { FormInputComponent } from '../../shared/form-input/form-input.component';
import { EmailValidatorDirective } from '../../directives/email-validator.directive';
import { UserModel } from '../../models/user.model';
import { CommonButtonComponent } from '../../shared/common-button/common-button.component';

@Component({
  selector: 'app-add-or-edit-user',
  standalone: true,
  imports: [
    FormInputComponent,
    ReactiveFormsModule,
    EmailValidatorDirective,
    CommonButtonComponent,
  ],
  templateUrl: './add-or-edit-user.component.html',
  styleUrl: './add-or-edit-user.component.scss',
})
export class AddOrEditUserComponent implements OnInit {
  @Output() public close = new EventEmitter<void>();
  @Output() public deleteUser = new EventEmitter<void>();
  @Output() public editUser = new EventEmitter<UserModel>();
  @Output() public addNewUser = new EventEmitter<UserModel>();
  public users = input.required<UserModel[]>();
  public selectedUser = input.required<UserModel | null>();
  public createNewUser = input.required<boolean>();
  public inputTypesEnum = InputTypesEnum;
  public form: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  constructor() {
    effect(() => {
      const selectedUser = this.selectedUser();
      this.form.reset(
        selectedUser
          ? {
              ...selectedUser,
              repeatPassword: selectedUser?.password,
            }
          : null,
      );
      this.cd.detectChanges();
    });
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public saveEdit(): void {
    if (this.form.valid) {
      this.editUser.emit(this.form.value);
    }
  }

  public createUser(): void {
    if (this.form.valid) {
      this.addNewUser.emit(this.form.value);
    } else {
      Object.keys(this.form.controls).forEach((key) =>
        this.form.controls[key].markAsDirty(),
      );
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      username: [
        this.selectedUser()?.username,
        [Validators.required, this.userNameAlreadyExists],
      ],
      first_name: [this.selectedUser()?.first_name, [Validators.required]],
      last_name: [this.selectedUser()?.last_name, [Validators.required]],
      email: [this.selectedUser()?.email, [Validators.required]],
      user_type: [this.selectedUser()?.user_type, [Validators.required]],
      password: [
        this.selectedUser()?.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(ValidatorsConst.password),
          this.passwordSameAsRepeatPassword,
        ],
      ],
      repeatPassword: [
        this.selectedUser()?.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(ValidatorsConst.password),
          this.repeatPasswordSameAsPassword,
        ],
      ],
    });
  }

  private userNameAlreadyExists = (
    control: FormGroup,
  ): ValidationErrors | null => {
    return control.value !== this.selectedUser()?.username &&
      this.users().find((item) => item.username === control.value)
      ? { userNameAlreadyExists: true }
      : null;
  };

  private repeatPasswordSameAsPassword = (
    control: FormGroup,
  ): ValidationErrors | null => {
    return !this.form?.get('password')?.value ||
      !control.value ||
      this.form?.get('password')?.value === control.value
      ? null
      : { notSamePasswords: true };
  };

  private passwordSameAsRepeatPassword = (
    control: FormGroup,
  ): ValidationErrors | null => {
    return !this.form?.get('repeatPassword')?.value ||
      !control.value ||
      this.form?.get('repeatPassword')?.value === control.value
      ? null
      : { notSamePasswords: true };
  };
}
