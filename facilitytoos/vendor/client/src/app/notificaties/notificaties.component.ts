import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Report, Status } from '../models/Report';
import { ArchiveService } from '../services/archive.service';
import { UpVoteService } from '../services/upvote/up-vote.service';
import { cpus } from 'os';



@Component({
  selector: 'app-notificaties',
  templateUrl: './notificaties.component.html',
  styleUrls: ['./notificaties.component.css']
})
export class NotificatiesComponent implements OnInit {

  constructor( private archiveService: ArchiveService, private upvoteService: UpVoteService) { }
  newInnerHeight;
  newInnerWidth ;
  @ViewChild('tabGroup', { static: true }) tabGroup;
  @ViewChild('tabGroup2', { static: true }) tabGroup2;
  isSubLoaded:Boolean;
  notifList = [];
  UserID = localStorage.getItem('UserID');

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
    console.log(this.newInnerWidth);
  }


  ngOnInit() {
    this.newInnerWidth = window.innerWidth;
    this.getSubscribedReports();
  }


  getSubscribedReports(){
    this.archiveService.getSubscribedReports().subscribe((res) => {
      if(res !== null && res.length > 0) {
        res.forEach(element => {
          if(element.status == Status.FINISHED || element.status == Status.DISCARDED){
            this.notifList.push(element);
          }
        }
          )
        this.isSubLoaded = true;
      } else {
        this.isSubLoaded = false;
      }
    });

    
  }

  removeNotification(report){
  this.notifList = this.notifList.filter(item => item != report);
  this.archiveService.removeUserVote(report, this.UserID);
  }
}

