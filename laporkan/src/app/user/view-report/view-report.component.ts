import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.css'
})
export class ViewReportComponent {
  documentData: any;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const documentId = params['id'];
      const report = 'reports';

      this.firestore
        .collection(report)
        .doc(documentId)
        .get()
        .subscribe((doc) => {
          if (doc.exists) {
            this.documentData = doc.data();
            // console.log('Document Data:', this.documentData);
          } else {
            console.log('Document does not exist');
          }
        });
    });
  }
}
