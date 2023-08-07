import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import { Post } from '../models/post.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa AngularFireStorage
import { finalize } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
interface ImageInfo {
  name: string;
  url: string;}
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {
  @ViewChild('imageInput', { static: false }) imageInput!: ElementRef<HTMLInputElement>;
  post = {} as Post;
  images: ImageInfo[] = [];
  selectedImageUrl: string | null = null;
  selectedImageFile: File | null = null; // Variable para almacenar el archivo de imagen seleccionado

  constructor(private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private afStorage:AngularFireStorage,
    private toastController: ToastController,
    private modalController: ModalController,
    ) { }
  ngOnInit() { }
  async createPost(post: Post){
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Espere un momento por favor..."
      });
      await loader.present();
      try {
        await this.firestore.collection("posts").add(post);                    
      } catch (e:any) {
        e.message = "Mensaje de error en post";
        let errorMessage = e.message || e.getLocalizedMessage();
        
        this.showToast(errorMessage);     
      }
      await loader.dismiss();
      this.navCtrl.navigateRoot("home");
    }
  }
  formValidation() {
    if (!this.post.title) {
      this.showToast("Ingrese un titulo");
      return false;
    }
    if (!this.post.details) {
      this.showToast("Ingrese una descripción");
      return false;
    }
    return true;
  }

  //Foto de camara 
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      // Convert the base64-encoded image data to a Blob
      if (image.dataUrl) {
        const blob = this.dataURLToBlob(image.dataUrl);
      
      

      // Upload the image to Firebase Storage

      const filePath = `${""}_${new Date().getTime()}.jpg`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, blob);

      // Handle the upload progress and result
      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const url = await fileRef.getDownloadURL().toPromise();
            // The image has been uploaded successfully
            // You can now save the image URL to your database or display it in your app
          } catch (error) {
            // Handle upload error
          }
        })
      ).subscribe();}
    } catch (error) {
      // Handle error
    }
  }

  dataURLToBlob(dataURL: string) {
    const binary = atob(dataURL.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }


  // Foto de camara

  loadImages() {
    const storageRef = this.afStorage.storage.ref();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // Only proceed with fetching images if a user is logged in
        const userId = user.uid;
        const userName = user.displayName || 'Usuario Anónimo';
        const correo = user.email;
        console.log(user.email);

        storageRef.listAll().then((res) => {
          this.images = []; // Clear the existing images array before fetching new ones
          for (let i = res.items.length - 1; i >= 0; i--) {
            const itemRef = res.items[i];

            itemRef.getDownloadURL().then((url) => {
              const imageInfo: ImageInfo = {
                name: itemRef.name,
                url: url,
              };
              this.images.unshift(imageInfo);
            });
          }
        });
      } else {
        // If the user is not logged in, clear the images array
        this.images = [];
      }
    });
  }

  // Método para manejar el evento de selección de archivo de imagen
  async onImageSelected(event: any) {
    const file = event.target.files[0];
    this.selectedImageFile = file;
    await this.uploadImage();
  }

  // Método para subir la imagen seleccionada a Firebase Storage
  async uploadImage() {
    if (this.selectedImageFile) {


      const filePath = `${""}_${this.selectedImageFile.name}`;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, this.selectedImageFile);

      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const url = await fileRef.getDownloadURL().toPromise();
            this.selectedImageUrl = url;
      
            const imageInfo: ImageInfo = {
              name: this.selectedImageFile!.name,
              url: url,
            };this.images.unshift(imageInfo);
      
            // Clear the file input by resetting its value to an empty string
            this.imageInput.nativeElement.value = '';
      
            // Hide the loading modal
      
            // Show a success toast
            this.showToast('Imagen enviada con éxito');
      
            // Reload the page after the modal is dismissed and the user confirms
      
            // Muestra una notificación push en el dispositivo del usuario
           
          } catch (error) {
            console.error(error);
            // Hide the loading modal
      
            // Show an error toast
            this.showToast('Error al subir la imagen', 'danger');
          }
        })
      ).subscribe();
    }
  }

  


  // Define the showToast method to show toasts
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000
    });
    await toast.present();
  }


}
