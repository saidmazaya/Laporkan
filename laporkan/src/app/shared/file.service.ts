import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileMetaData } from '../model/file-meta-data';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private fireStore : AngularFirestore, 
    private fireStorage : AngularFireStorage
  ) { }

  saveMetaDataOfFiles(fileObj : FileMetaData) {

    const fileMeta = {
      id : '',
      name : fileObj.name,
      size : fileObj.size,
      url : fileObj.url
    }

    fileMeta.id = this.fireStore.createId();

    this.fireStore.collection('/Uploads').add(fileMeta);

  }

  getAllFiles() {
    this.fireStore.collection('/Uploads').snapshotChanges();
  }
}
