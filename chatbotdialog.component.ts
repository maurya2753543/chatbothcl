import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {  Input, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Message } from '../models/message';

@Component({
  selector: 'app-chatbotdialog',
  templateUrl: './chatbotdialog.component.html',
  styleUrls: ['./chatbotdialog.component.scss']
})
export class ChatbotdialogComponent implements OnInit {
  user : any;
  public message!: Message;
  public messages!: Message[];

  // Code for Scrolling
  // Code for Scrolling

  @ViewChild('chatlist', { read: ElementRef })
  chatList!: ElementRef;
  @ViewChildren(ChatbotdialogComponent, { read: ElementRef })
  chatItems!: QueryList<ChatbotdialogComponent>;

  ngOnInit(): void {
  }
  

}
