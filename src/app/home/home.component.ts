import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDivider } from '@angular/material/divider';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatCheckboxModule, MatDialogModule, MatDivider, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  TASK_DATA: Task[] = [];
  displayedColumns: string[] = ['id', 'title', 'description', 'deadline', 'priority', 'isCompleted', 'Actions'];
  dataSource = new MatTableDataSource<Task>(this.TASK_DATA);
  constructor(private _snackBar: MatSnackBar) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  readonly dialog = inject(MatDialog);

  ngOnInit() {
    let DATA = sessionStorage.getItem('task_data') ?? '';
    if (DATA !== '') {
      JSON.parse(DATA).forEach((element: any) => {
        let task: Task = element;
        this.TASK_DATA.push(task);
      });
    }
  }

  ngOnDestroy() {
    sessionStorage.setItem('task_data', this.TASK_DATA.toString());
  }

  openDialog(isEdit: boolean, tId: number | undefined) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: { array: this.TASK_DATA, edit: isEdit, id: tId }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource<Task>(this.TASK_DATA);
      this.ngAfterViewInit();
    });
  }

  del(id: number) {
    this.TASK_DATA.splice(id - 1, 1);
    this.ngAfterViewInit();
    this._snackBar.open('Task Deleted Successfully!', 'Close');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface Task {
  id: number,
  title: string | undefined,
  description: string | undefined,
  deadline: Date,
  priority: string | undefined,
  isCompleted: boolean | undefined
}

export interface Model {
  array: Task[],
  id: number | undefined,
  edit: boolean
}