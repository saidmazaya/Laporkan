import { Component } from '@angular/core';
import { FileMetaData } from '../../model/file-meta-data';
import { FileService } from '../../shared/file.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.css'
})
export class CreateReportComponent {

  selectedFiles!: FileList;
  currentFileUpload: FileMetaData[] = [];
  fileNames: string[] = [];
  percentage: number = 0;
  formattedPercentage: string = '0%';
  errorMessages: string[] = [];

  constructor(
    private fileService: FileService,
    private fireStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    this.fileNames = []; // Clear previous file names
    this.errorMessages = []; // Clear previous error messages

    // Define allowed file types and maximum file size (in bytes)
    const allowedFileTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const currentFile = this.selectedFiles[i];

      // Check file type
      if (allowedFileTypes.indexOf(currentFile.type) === -1) {
        this.errorMessages.push(`Invalid file type: ${currentFile.name}. Please select only SVG, PNG, JPG, or GIF files.`);
        this.selectedFiles = [] as unknown as FileList; // Clear selected files
        return;
      }

      // Check file size
      if (currentFile.size > maxFileSize) {
        this.errorMessages.push(`File size exceeds the maximum limit for ${currentFile.name}. Maximum allowed size is 5 MB.`);
        this.selectedFiles = [] as unknown as FileList; // Clear selected files
        return;
      }

      this.fileNames.push(currentFile.name);
    }
  }

  uploadFiles() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const currentFile = this.selectedFiles[i];
      const currentFileUpload = new FileMetaData(currentFile);
      const path = `Uploads/${currentFileUpload.file.name}`;
  
      const storageRef = this.fireStorage.ref(path);
      const uploadTask = storageRef.put(currentFile);
  
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadLink => {
            currentFileUpload.url = downloadLink;
            currentFileUpload.size = currentFileUpload.file.size;
            currentFileUpload.name = currentFileUpload.file.name;
  
            this.fileService.saveMetaDataOfFiles(currentFileUpload);
          });
        })
      ).subscribe((res: any) => {
        // Calculate percentage as a number (0 to 100)
        const calculatedPercentage = (res.bytesTransferred / res.totalBytes) * 100;
  
        // Round the percentage to zero decimal places
        this.percentage = calculatedPercentage;
  
        // Format the percentage as a string with a percentage symbol
        this.formattedPercentage = this.percentage.toFixed(0) + '%';
      }, err => {
        console.log('Error');
      });
    }
  }

}
