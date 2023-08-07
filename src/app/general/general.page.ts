import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {
  images: any[] = [];
  constructor(
    private hola:AngularFirestore
  ) { 
    this.hola
      .collection<any>('')
      .valueChanges({ idField: 'id' })
      .subscribe((data) => {
        this.images = data;
      });
  }

  ngOnInit() {
  }

}
