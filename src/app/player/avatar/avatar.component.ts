import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { finalize } from 'rxjs/operators';

import { PlayerService } from '../../services/player.service';
import { SplashScreenService } from '../../services/splash-screen.service';

@Component({
  selector: 'ad-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements AfterViewInit {
  public croppedImage: string = '';
  @ViewChild(ImageCropperComponent, { static: true }) private imageCropper: ImageCropperComponent;

  constructor(
    private readonly storage: AngularFireStorage,
    private readonly splash: SplashScreenService,
    private readonly route: ActivatedRoute,
    private readonly playerService: PlayerService,
    private readonly router: Router
  ) {}

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
      this.splash.show();
    }
    this.imageCropper.imageChangedEvent = event;
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  public imageLoaded(): void {
    this.splash.hide();
  }

  public loadImageFailed(): void {
    this.splash.hide();
  }

  public ngAfterViewInit(): void {
    this.imageCropper.maintainAspectRatio = true;
    this.imageCropper.aspectRatio = 1;
    this.imageCropper.cropperMinWidth = 50;
    this.imageCropper.resizeToWidth = 200;
    this.imageCropper.roundCropper = true;
    this.imageCropper.imageQuality = 60;
    this.imageCropper.format = 'jpeg';
    this.imageCropper.onlyScaleDown = true;
  }

  public rotateLeft(): void {
    this.splash.show().onDone(() => this.imageCropper.rotateLeft());
  }

  public rotateRight(): void {
    this.splash.show().onDone(() => this.imageCropper.rotateRight());
  }

  public upload(): void {
    this.splash.show();
    const regExp: RegExp = /data:image\/([a-zA-Z]*);base64,/g;
    const b64: string = this.croppedImage.substring(regExp.exec(this.croppedImage)[0].length);

    const playerId: string = this.route.snapshot.paramMap.get('id');
    // from(
    const fileRef: AngularFireStorageReference = this.storage.ref('/avatar').child(`${playerId}.jpg`);
    const task: AngularFireUploadTask = fileRef.putString(b64, 'base64', { contentType: 'image/jpg' });
    // .then((a: { downloadURL: any; }) => console.log(a.downloadURL));

    task
      .snapshotChanges()
      .pipe(
        finalize(() =>
          fileRef.getDownloadURL().subscribe((value) =>
            this.playerService
              .updatePhoto(playerId, value)
              .pipe(
                finalize(() => {
                  this.splash.hide();
                  this.router.navigate(['player']);
                })
              )
              .subscribe()
          )
        )
      )
      .subscribe();

    // ).pipe(
    // finalize(() => this.splash.hide()),
    // tap(x => x.)
    // ).subscribe();
  }
}
