import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.css'
})
export class ViewReportComponent {
  documentData: any;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    const documentId = 'Z1R8g6y8UjAEUgSVasPZ';
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
