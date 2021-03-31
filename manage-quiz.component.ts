import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef,AfterContentChecked} from '@angular/core'
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-manage-quiz',
  templateUrl: './manage-quiz.component.html',
  styleUrls: ['./manage-quiz.component.scss']
})
export class ManageQuizComponent implements OnInit, AfterContentChecked {

  @ViewChild('tabGroup', { static: false }) private tabGroup: MatTabGroup;
  
  constructor( private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterContentChecked() : void {
    this.changeDetector.detectChanges();
  }

}
