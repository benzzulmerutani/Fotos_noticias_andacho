import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions } from '@ionic/angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  

  constructor(private router: Router,
    alertController: AlertController
    ){}

  ngOnInit() {
  }
  cerrar(){
    this.router.navigate(['/login']);
  }
  
  
}
