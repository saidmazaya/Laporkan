import { Component } from '@angular/core';
import { FileMetaData } from '../../model/file-meta-data';
import { FileService } from '../../shared/file.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { forkJoin, interval } from 'rxjs';
import { User } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent {

  form!: FormGroup;
  title: string = '';
  description: string = '';

  selectedFiles!: FileList;
  currentFileUpload: FileMetaData[] = [];
  fileNames: string[] = [];
  percentage: number = 0;
  formattedPercentage: string = '0%';
  errorMessages: string[] = [];
  downloadUrls: FileMetaData[] = [];
  isUploading: boolean = false;
  isAnonim: boolean = false;

  constructor(
    private fileService: FileService,
    private fireStorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: [[], [Validators.required]],
    });
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
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      console.log('No files selected for upload.');
      return;
    }
  
    this.isUploading = true; // Set the flag to indicate that the upload is in progress
    const observables = [];
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const currentFile = this.selectedFiles[i];
      const currentFileUpload = new FileMetaData(currentFile);
      const uniqueFileName = this.generateUniqueFileName(currentFileUpload.file.name);
      const path = `Uploads/${uniqueFileName}`;
  
      const storageRef = this.fireStorage.ref(path);
      const uploadTask = storageRef.put(currentFile);
  
      const observable = uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadLink => {
            currentFileUpload.url = downloadLink;
            currentFileUpload.size = currentFileUpload.file.size;
            currentFileUpload.name = uniqueFileName;
  
            // Check if the URL already exists in the array before pushing it
            if (!this.downloadUrls.some(fileData => fileData.url === downloadLink)) {
              this.downloadUrls.push(currentFileUpload);
            }
          });
        })
      );
  
      observable.subscribe(
        (res: any) => {
          // Calculate percentage as a number (0 to 100)
          const calculatedPercentage = (res.bytesTransferred / res.totalBytes) * 100;
  
          // Round the percentage to zero decimal places
          this.percentage = calculatedPercentage;
  
          // Format the percentage as a string with a percentage symbol
          this.formattedPercentage = this.percentage.toFixed(0) + '%';
        },
        err => {
          console.log('Error during upload:', err);
          // Handle errors during upload
        }
      );
  
      observables.push(observable);
    }
  
    // Wait for all observables to complete
    forkJoin(observables).subscribe(() => {
      // All files uploaded, you can use this.downloadUrls array as needed
      this.isUploading = false; // Set the flag to indicate that the upload is complete
    });
  }

  // Generate a unique filename by appending a timestamp to the original filename
  generateUniqueFileName(originalFileName: string): string {
    const currentDate = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Random string of length 6
    const fileExtension = originalFileName.split('.').pop();
    const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
  
    return `${sanitizedFileName}-${currentDate}-${randomString}.${fileExtension}`;
  }

  toggleAnonim() {
    this.isAnonim = !this.isAnonim;
  }  

  saveData(): void {
    if (this.form.valid) {
      this.uploadFiles();
  
      // Wait for the upload to complete before saving to the 'reports' collection
      const uploadSubscription = interval(2000).subscribe(() => {
        if (!this.isUploading) {
          uploadSubscription.unsubscribe(); // Stop checking when the upload is complete
  
          // Dapatkan informasi pengguna saat ini
          this.afAuth.authState.subscribe(user => {
            if (user) {
              // Tentukan nilai informantInfo berdasarkan nilai isAnonim
              const informantInfo = this.isAnonim ? 'Anonymous' : user.email?.split('@')[0] || '';
  
              // Gunakan this.downloadUrls saat menyimpan data ke koleksi 'reports'
              this.firestore.collection('reports').add({
                title: this.form.value.title,
                description: this.form.value.description,
                category: this.form.value.category,
                informant: informantInfo,
                imageUrls: this.downloadUrls.map(fileData => fileData.url),
                status: 'Pending',
              }).then(() => {
                this.router.navigate(['home']);
              }).catch((error: any) => {
                console.log(error);
              });
            }
          });
        }
      });
    }
  }
  
}
