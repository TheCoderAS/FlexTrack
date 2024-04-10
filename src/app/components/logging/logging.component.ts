import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logging',
  standalone: true,
  imports: [],
  templateUrl: './logging.component.html',
  styleUrl: './logging.component.scss'
})
export class LoggingComponent implements OnInit {
  logType:string='';
  constructor(private route:ActivatedRoute){}

  ngOnInit(): void {
      this.route.params.subscribe(params=>{
        this.logType=params['log_type'];
      })
  }
}
