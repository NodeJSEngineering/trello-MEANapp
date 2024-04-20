import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone, OnDestroy} from '@angular/core';
import {Card} from './card';
import {CardService} from './card.service';
import { BoardService } from '../board/board.service';
import { HttpClientService } from 'app/httpclient';
import { WebSocketService } from 'app/ws.service';

@Component({
  selector: 'app-gtm-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() card: Card;
  @Input() userList;

  @Output() cardUpdate: EventEmitter<Card>;
  editingCard = false;
  currentTitle: string;
  zone: NgZone;


  constructor(private el: ElementRef,
    //  private _cards?: CardService,
      private _board: BoardService,
      private _ref: ChangeDetectorRef,
      private _ws: WebSocketService,
      private _cardService: CardService,
      private _http: HttpClientService) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.cardUpdate = new EventEmitter();
  }

  ngOnInit() {
    this._ws.onCardUpdate.subscribe((card: Card) => {
      if (this.card._id === card._id) {
        this.card.title = card.title;
        this.card.order = card.order;
        this.card.columnId = card.columnId;
      }
    });
    console.log(this, 'card comp');

  }

  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    } else if (event.keyCode === 27) {
      this.card.message = this.currentTitle;
      // this.card.title = this.currentTitle;
      this.editingCard = false;
    }
  }

  editCard() {
    this.editingCard = true;
    this.currentTitle = this.card.message;

    const textArea = this.el.nativeElement.getElementsByTagName('textarea')[0];

    setTimeout(function() {
      textArea.focus();
    }, 0);
  }

  updateCard() {
    if (!this.card.message || this.card.message.trim() === '') {
      this.card.message = this.currentTitle;
    }

    const formData: FormData = new FormData();
    formData.append('message', this.card.message);
    formData.append('due_date', this.card.due_date);
    formData.append('priority', this.card.priority.toString());
    formData.append('assigned_to', this.card.assigned_to);
    formData.append('taskid', this.card['id'].toString());

    // this._cards.updateCard(formData).subscribe((res) => {
    //   if (res['status'] === 'success') {
    //     alert('Task Updated Successfully');
    //   }

            // });
            this._cardService.put(this.card).then(res => {
              this._ws.updateCard(this.card.boardId, this.card);
            });
    this.editingCard = false;
  }

  deleteCard() {
    const formData: FormData = new FormData();
    formData.append('taskid', this.card['id'].toString());
    // this._cards.deleteTask(formData).subscribe((res) => {
    //     alert(res['message']);
    //   this._board.refreshcard.next('deleteCard');
    // });
  }

    //TODO: check lifecycle
    private ngOnDestroy() {
      //this._ws.onCardUpdate.unsubscribe();
    }
}
