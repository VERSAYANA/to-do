import { Injectable } from '@angular/core'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore'
import { UserService } from './user.service'
import { Task } from '../intefaces'
import { Observable } from 'rxjs'
import { User } from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // private tasksCollection: AngularFirestoreCollection<Task>
  // private tasks: Observable<Task[]>
  // private user: User

  constructor(
    // private firestore: AngularFirestore,
    // private userService: UserService
  ) {}

  // private createTasksRef(): void {}
  // getUserTasks(): Observable<Task[]> {
  //   this.userService.getUser().subscribe((user) => {
  //     this.user = user
  //     this.tasksCollection = this.firestore.collection('tasks', (ref) =>
  //       ref.where('owner', '==', this.user.uid)
  //     )
  //     this.tasks = this.tasksCollection.valueChanges()
  //     return this.tasks
  //   })
  // }
  //
  // createTask(text: string): void {
  //   this.tasksCollection.add({
  //     owner: this.user.uid,
  //     focus: false,
  //     text,
  //   })
  // }
}
