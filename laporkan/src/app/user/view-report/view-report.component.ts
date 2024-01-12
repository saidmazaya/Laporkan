import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.css'
})
export class ViewReportComponent {
  documentData: any;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    const documentId = 'n9XWNUN5MgtwomQz9GEU';
    const report = 'reports';

    this.firestore
      .collection(report)
      .doc(documentId)
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          this.documentData = doc.data();
          console.log('Document Data:', this.documentData);
        } else {
          console.log('Document does not exist');
        }
      });
  }
}
