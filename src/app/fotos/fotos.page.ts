import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface ImageInfo {
  user: {
    name: string;
  };
  url: string;
}

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage {
  images: string[] = [];

  constructor(
    private storage: AngularFireStorage,
    private sanitizer: DomSanitizer
  ) {
    this.storage.storage
      .ref()
      .listAll()
      .then((result) => {
        result.items.forEach((item) => {
          item.getDownloadURL().then((url) => {
            this.images.push(url);
          });
        });
      });
  }

  // Update the shareImage method to accept a string argument
  shareImage(imageUrl: string) {
    // Use the imageUrl argument to create the text for sharing on WhatsApp
    const text = `Mira esta imagen compartida en la aplicación foto_noticias_andacho ${imageUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    // To avoid CORS issues on some devices, we can use the sanitize method to create a safe URL
    const safeWhatsappUrl: SafeUrl = (
      whatsappUrl
    );

    // Open the link in a new tab or window
    window.open(safeWhatsappUrl.toString(), '_system');
    console.log(safeWhatsappUrl);
  }

}
