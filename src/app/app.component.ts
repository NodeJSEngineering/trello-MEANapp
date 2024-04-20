import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BoardService } from './board/board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(private _board?: BoardService, private cdr?: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._board.isLoading.subscribe((loadingStatus) => {
      this.loading = loadingStatus;
      this.cdr.detectChanges();
  });
  }

}

