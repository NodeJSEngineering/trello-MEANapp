import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BoardService} from '../board/board.service';
import {Board} from '../board/board';

@Component({
  selector: 'app-gtm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  boards: Board[] = [{title: 'generic board', _id: '1', columns: [], cards: [], userList: []}];

  constructor(private _bs: BoardService,
      private _router: Router) { }

  ngOnInit() {
    this.boards = [];
    this._bs.getAll().subscribe((boards:any) => {
      console.log(boards, 'boards')
      this.boards = boards.data;
    });
    setTimeout(function() {
      document.getElementById('content-wrapper').style.backgroundColor = '#fff';
    }, 100);
  }

  public addBoard() {
    console.log('Adding new board');
    this._bs.post(<Board>{ title: "New board" })
      .subscribe((board: any) => {
      console.log(board, 'addBoard')

if(board._id){
        this._router.navigate(['/b', board._id]);
        console.log('new board added', board);
}
    });
    // alert(`Only 1 Board allowed in basic version To add more boards you need to subscribe
    // premium version`);
  }

}
