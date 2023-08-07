// register.page.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = {} as User;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async register(user: User) {
    const validationMessage = this.formValidation();

    if (validationMessage) {
      this.showToast(validationMessage);
      return;
    }

    let loader = await this.loadingCtrl.create({
      message: "Espere un momento por favor..."
    });
    await loader.present();

    try {
      await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(data => {
        console.log(data);
        this.navCtrl.navigateRoot("/login");
        this.showToast("¡Registro exitoso!");
      });
    } catch (e: any) {
      e.message = "Error al realizar el registro";
      let errorMessage = e.message || e.getLocalizedMessage();
      this.showToast(errorMessage);
    }

    await loader.dismiss();
  }

  formValidation() {
    let validationMessage = '';

    if (!this.user.email) {
      validationMessage += "Ingrese un correo. ";
    }

    if (!this.user.password) {
      validationMessage += "Ingrese una contraseña. ";
    }

    if (this.user.password.length < 6) {
      validationMessage += "La contraseña debe tener al menos 6 caracteres. ";
    }

    if (this.user.password !== this.user.confirmPassword) {
      validationMessage += "Las contraseñas no coinciden. ";
    }

    return validationMessage.trim();
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 5000 // Aumenta la duración del mensaje a 5 segundos
    }).then(toastData => toastData.present());
  }
}
