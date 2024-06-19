import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { Model, Task } from '../home.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, MatRadioModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  data = inject<Model>(MAT_DIALOG_DATA);

  submitTxt = 'Save';
  readonly title = new FormControl('', [Validators.required]);
  readonly description = new FormControl('', [Validators.required]);
  readonly priority = new FormControl('low', [Validators.required]);

  deadline: Date;

  titleError: boolean = false;
  descriptionError: boolean = false;
  deadlineError: boolean = false;

  ngOnInit() {
    if (this.data.edit && this.data.id !== undefined) {
      this.submitTxt = 'Edit';
      let task = this.data.array[this.data.id - 1];
      this.title.setValue(task.title ?? '');
      this.description.setValue(task.description ?? '');
      if (this.data.edit) {
        this.deadline = new Date(task.deadline);
      }
      else {
        this.deadline = new Date();
      }
      this.priority.setValue(task.priority ?? 'low');
    }
  }

  constructor(private _snackBar: MatSnackBar) {
  }

  updateErrorMessage() {
    if (this.title.hasError('required')) {
      this.titleError = true;
    } else {
      this.titleError = false;
    }

    if (this.description.hasError('required')) {
      this.descriptionError = true;
    } else {
      this.descriptionError = false;
    }

    if (this.deadline) {
      this.deadlineError = false;
    } else {
      this.deadlineError = true;
    }
  }
  cancel() {
    this.dialogRef.close();
  }
  submit() {
    this.updateErrorMessage();
    let message = '';
    if (!this.titleError && !this.deadlineError && !this.descriptionError) {
      let task: Task = { id: this.data.id ?? this.data.array.length + 1, title: this.title.value?.toString(), description: this.description.value?.toString(), deadline: this.deadline, priority: this.priority.value?.toString(), isCompleted: false };
      if (this.data.edit && this.data.id !== undefined) {
        this.data.array.splice(this.data.id - 1, 1);
        this.data.array.splice(this.data.id - 1, 0, task);
        message = 'Task Updated Successfully!';
      } else {
        this.data.array.push(task);
        message = 'Task Added Successfully!';
      }
      this.dialogRef.close();
    } else {
      this.updateErrorMessage();
      message = 'Invalid input!, Please try again';
    }
    this._snackBar.open(message, 'Close');
  }
}
