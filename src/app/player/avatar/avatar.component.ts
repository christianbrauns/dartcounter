import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'ad-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements AfterViewInit {

  public croppedImage: string = '';
  @ViewChild(ImageCropperComponent, { static: true })
  private imageCropper: ImageCropperComponent;

  constructor(private readonly storage: AngularFireStorage) {
  }

  public cropperReady(): void {
    // cropper ready
  }

  public deleteAvatar(): void {
    // this.userNetService.deleteAvatar().subscribe((value: boolean) => {
    //   if (value) {
    //     this.auth.avatarImageSrc.next('');
    //     this.toastr.success('Das Bild wurde gelöscht.');
    //   } else {
    //     this.toastr.error('Es ist ein Fehler aufgetreten.');
    //   }
    // });
  }

  public fileChangeEvent(event: any): void {
    if (event === null) {
      this.croppedImage = '';
    } else if (event && event.target && event.target.files && event.target.files.length > 0) {
      // this.spinner.show();
    }
    this.imageCropper.imageChangedEvent = event;
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public imageLoaded(): void {
    // this.spinner.hide();
    // show cropper
  }

  public loadImageFailed(): void {
    // this.spinner.hide();
    // show message
  }

  public ngAfterViewInit(): void {
    this.imageCropper.maintainAspectRatio = true;
    this.imageCropper.aspectRatio = 1;
    this.imageCropper.cropperMinWidth = 100;
    this.imageCropper.resizeToWidth = 400;
    this.imageCropper.roundCropper = true;
    this.imageCropper.imageQuality = 60;
    this.imageCropper.format = 'jpeg';
    this.imageCropper.onlyScaleDown = true;

    // this.imageCropper.imageChangedEvent(() => {});
  }

  public rotateLeft(): void {
    // this.spinner.show();
    this.imageCropper.rotateLeft();
  }

  public rotateRight(): void {
    // this.spinner.show();
    this.imageCropper.rotateRight();
  }

  public upload(): void {
    console.log(this.croppedImage.substring(23));
    this.storage.ref('/avatars').child('dsnfksadf')
      .putString(this.croppedImage.substring(23), 'base64', { contentType: 'image/jpg' });
    // this.spinner.show();
    // this.userNetService
    //   .uploadAvatar(this.croppedImage)
    //   .pipe(finalize(() => this.spinner.hide()))
    //   .subscribe((value: boolean) => {
    //     if (value) {
    //       this.toastr.success('Das Bild wurde geändert');
    //       this.auth.avatarImageSrc.next(this.croppedImage);
    //       this.fileChangeEvent(null);
    //       this.croppedImage = '';
    //     } else {
    //       this.toastr.error('Es ist ein Fehler aufgetreten.');
    //     }
    //   });
  }
}
