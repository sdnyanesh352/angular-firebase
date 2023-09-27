import { Component } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.scss']
})
export class TutorialsListComponent {
  tutorials?: Tutorial[];
  currentTutorial?: Tutorial;
  currentIndex = -1;
  title = '';

  constructor(private tutorialService: TutorialService,private router:Router) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  refreshList(): void {
    this.currentTutorial = undefined;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.tutorials = data;
    });
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    //this.router.navigateByUrl("/tutorialsdetail/"+index)
    this.currentTutorial = tutorial;
    this.currentIndex = index;
    this.tutorialService.getTutorialDetails(tutorial,index);
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }

}
