import { inject, Injectable } from '@angular/core';
import { MessagesService } from './messages.service';
import nls from '../framework/resources/nls/generic';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class CordovaService {
  private _message: MessagesService = inject(MessagesService);

  constructor() { }

  resolveFS(fileName: string, data: any) {
    this.checkAndRequestPermissions(() => this.createBackupDirectory(fileName, data))

  }
  createBackupDirectory(fileName: string, data: any) {
    // console.log("Performing backup");
    (window as any).resolveLocalFileSystemURL(cordova.file.externalRootDirectory, (entry: any) => {
      const dirEntry = entry as any;
      this.createFile(dirEntry, fileName, data);
      // console.log(dirEntry);

    }, (error: any) => {
      this._message.error(nls.resolveError)
    });
  }
  private createFile(dirEntry: any, fileName: string, dataObj: Blob): void {
    // console.log(dirEntry);
    dirEntry.getDirectory('Download/', { create: true, exclusive: false }, (dirEntry: any) => {
      dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry: any) => {
        this.writeFile(fileEntry, dataObj);
        // console.log(fileEntry)
      }, (error: any) => {
        this._message.error(nls.createBackupError)
      });
    })
  }
  private writeFile(fileEntry: any, dataObj: Blob): void {
    fileEntry.createWriter((fileWriter: any) => {
      fileWriter.onwriteend = () => {
        // console.log('saved suceess')
        this._message.success(nls.createBackupSuccess)
      };

      fileWriter.onerror = (error: any) => {
        this._message.error(nls.saveBackupError)
      };

      fileWriter.write(dataObj);
    });
  }
  checkAndRequestPermissions(storageOpration: any) {
    const permissions = cordova.plugins.permissions;

    // Check if we have write permission
    permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, (status: any) => {
      if (!status.hasPermission) {
        // Request permission
        permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, (status: any) => {
          if (!status.hasPermission) {
            // Permission denied, direct user to settings
            this.showPermissionDeniedAlert();
          } else {
            storageOpration();
          }
        });
      } else {
        // console.log("I have permission")
        storageOpration();
      }
    });
  }

  // Show a message to the user to manually enable permission
  showPermissionDeniedAlert() {
    if (confirm("Storage permission is required to create a backup. Please enable it from settings and try again.")) {
      this.openAppSettings();
    }
  }

  // Open app settings to enable permission manually
  openAppSettings() {
    cordova.plugins.diagnostic.switchToSettings();
  }
}
