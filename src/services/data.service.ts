import { Injectable } from '@angular/core'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore'
import { UserService } from './user.service'
import { Task } from '../intefaces'
import { Observable } from 'rxjs'
import { User } from 'firebase'
import { AngularFireAuth } from '@angular/fire/auth'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tasksCollection: AngularFirestoreCollection<Task>
  private tasksCollection2: AngularFirestoreCollection<Task>
  // private tasks: Observable<Task[]>
  // private user: User
  private rootLevelTasks: Observable<Task[]>
  private user: User
  private lvl1: Observable<Task[]>
  private lvl2: Observable<Task[]>
  private lvl3: Observable<Task[]>
  private selected: Task
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth // private firestore: AngularFirestore, // private userService: UserService
  ) {}

  public start(user: User): Observable<Task[]> {
    this.user = user
    this.tasksCollection = this.db.collection('tasks', (ref) =>
      ref.where('owner', '==', user.uid).where('parent', '==', null)
    )
    this.rootLevelTasks = this.tasksCollection.valueChanges()
    this.lvl1 = this.rootLevelTasks
    return this.rootLevelTasks
  }

  selectTask(task: Task, level: number) {
    switch (level) {
      case 1:
    }
    const tasks = this.db.collection('tasks', (ref) =>
      ref.where('owner', '==', this.user.uid).where('parent', '==', task.uid)).valueChanges()
  }

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
