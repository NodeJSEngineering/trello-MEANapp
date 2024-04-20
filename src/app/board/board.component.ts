import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Board } from '../board/board';
import { Column } from '../column/column';
import { Card } from '../card/card';
import { BoardService } from './board.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { CardService } from '../card/card.service';
import { WebSocketService } from 'app/ws.service';
import { HttpClientService } from 'app/httpclient';
import { ColumnService } from 'app/column/column.service';
import { MockBoardService } from './mock_board.service';

declare var jQuery: any;
var curYPos = 0,
  curXPos = 0,
  curDown = false;

@Component({
  selector: 'app-gtm-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  board: Board = this._mockboard.getBoards()[0];
  addingColumn = false;
  addColumnText: string;
  editingTilte = false;
  currentTitle: string;
  boardWidth: number;
  columnsAdded = 0;
  searchText = '';
  selectedData = '0';
  options = [
    { name: 'Task Priority', value: '0', checked: true },
    { name: 'high', value: '1', checked: true },
    { name: 'medium', value: '2', checked: false },
    { name: 'low', value: '3', checked: true }
  ];

  constructor(public el: ElementRef,
    private _mockboard: MockBoardService,
    private _cards: CardService,
    private _ws: WebSocketService,
    private _boardService: BoardService,
    private _http: HttpClientService,
    private _columnService: ColumnService,
    private _router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit() {
    this._ws.connect();
    this._ws.onColumnAdd.subscribe(column => {
      console.log('adding column from server');
      this.board.columns.push(column);
      this.updateBoardWidth();
    });

    this._ws.onCardAdd.subscribe(card => {
      console.log('adding card from server');
      this.board.cards.push(card);
    });

    let boardId = this._route.snapshot.params['id'];

    //let boardId = this._routeParams.get('id');
    this._boardService.getBoardWithColumnsAndCards(boardId)
      .subscribe((data: any) => {
        console.log(`joining board ${boardId}`, data);
        this._ws.join(boardId);

        // this.board = data[0];
        // this.board.columns = data[1].data;
        // this.board.cards = data[2].data;
        // document.title = this.board.title + " | Generic Task Manager";
        this.setupView();
      });
    // this._board.refreshcard.subscribe((res) => {
    //   if (res === 'deleteCard') {
    //     this.getData();
    //   } else {
    //     this.getData();
    //   }
    // });

console.log(this, 'board comp');
  }

  // getData() {
  //   this._board.getCards('').subscribe((res) => {
  //     this.board = { title: 'Mini-Task Manager', _id: '1', columns: [], cards: [], userList: [] };

  //     this.board.columns = [{
  //       boardId: '5f8ed7a917c0456f389586a7',
  //       order: 1000, title: 'Add tasks', _id: '1'
  //     }];
  //     if (this.searchText) {
  //       this.board.cards = this.updateHtmlSearch(this.searchText, res['tasks'], 'message');
  //     } else if (this.selectedData !== '0') {
  //       this.board.cards = this.updateHtmlSearch(this.selectedData, res['tasks'], 'priority');
  //     } else {
  //       this.board.cards = res['tasks'];
  //     }
  //     this._cards.getAllUsers().subscribe((resp) => {
  //       this.board.userList = resp['users'];
  //     });
  //     document.title = this.board.title + ' | Generic Task Manager';
  //     this.setupView();
  //   });
  // }

  setupView() {
    const component = this;
    setTimeout(() => {

      var startColumn;
      jQuery('#main').sortable({
        items: '.sortable-column',
        handler: '.header',
        connectWith: "#main",
        placeholder: "column-placeholder",
        dropOnEmpty: true,
        tolerance: 'pointer',
        start: function (event, ui) {
          ui.placeholder.height(ui.item.find('.column').outerHeight());
          startColumn = ui.item.parent();
        },
        stop: function (event, ui) {
          var columnId = ui.item.find('.column').attr('column-id');

          component.updateColumnOrder({
            columnId: columnId
          });
        }
      }).disableSelection();

      //component.bindPane();;
      window.addEventListener('resize', function (e) {
        component.updateBoardWidth();
      });
      component.updateBoardWidth();
      document.getElementById('content-wrapper').style.backgroundColor = '';
    }, 100);
  }

  bindPane() {
    let el = document.getElementById('content-wrapper');
    el.addEventListener('mousemove', function (e) {
      e.preventDefault();
      if (curDown === true) {
        el.scrollLeft += (curXPos - e.pageX) * .25;// x > 0 ? x : 0;
        el.scrollTop += (curYPos - e.pageY) * .25;// y > 0 ? y : 0;
      }
    });

    el.addEventListener('mousedown', function (e) {
      console.log(e)
      // if (e.srcElement.id === 'main' || e.srcElement.id === 'content-wrapper') {
      //   curDown = true;
      // }
      curYPos = e.pageY; curXPos = e.pageX;
    });
    el.addEventListener('mouseup', function (e) {
      curDown = false;
    });
  }

  updateHtmlSearch(searchText: string, tasks, key) {
    const tempData = tasks;
    tasks = tempData.filter(person =>
      (person[key].toLowerCase().indexOf(searchText.toLowerCase()) > -1) === true ? person[key] : '');
    return tasks;
  }

  updateBoardWidth() {
    // this.boardWidth = ((this.board.columns.length + (this.columnsAdded > 0 ? 1 : 2)) * 280) + 10;
    this.boardWidth = ((this.board.columns.length + 1) * 280) + 10;
if (document.getElementById('main')) {

    if (this.boardWidth > document.body.scrollWidth) {
      document.getElementById('main').style.width = this.boardWidth + 'px';
    } else {
      document.getElementById('main').style.width = '100%';
    }

  }
    if (this.columnsAdded > 0) {
      const wrapper = document.getElementById('content-wrapper');
      wrapper.scrollLeft = wrapper.scrollWidth;
    }

    this.columnsAdded++;
  }

  updateBoard() {
    if (this.board.title && this.board.title.trim() !== '') {
      this._boardService.put(this.board);
    } else {
      this.board.title = this.currentTitle;
    }
    this.editingTilte = false;
    document.title = this.board.title + ' | Generic Task Manager';
  }

  editTitle() {
    this.currentTitle = this.board.title;
    this.editingTilte = true;

    const input = this.el.nativeElement
      .getElementsByClassName('board-title')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function () { input.focus(); }, 0);
  }


  updateColumnElements(column: Column) {
    let columnArr = jQuery('#main .column');
    let columnEl = jQuery('#main .column[columnid=' + column._id + ']');
    let i = 0;
    for (; i < columnArr.length - 1; i++) {
      column.order < +columnArr[i].getAttibute('column-order');
      break;
    }

    columnEl.remove().insertBefore(columnArr[i]);
  }

  updateColumnOrder(event) {
    let i: number = 0,
      elBefore: number = -1,
      elAfter: number = -1,
      newOrder: number = 0,
      columnEl = jQuery('#main'),
      columnArr = columnEl.find('.column');

    for (i = 0; i < columnArr.length - 1; i++) {
      if (columnEl.find('.column')[i].getAttribute('column-id') == event.columnId) {
        break;
      }
    }

    if (i > 0 && i < columnArr.length - 1) {
      elBefore = +columnArr[i - 1].getAttribute('column-order');
      elAfter = +columnArr[i + 1].getAttribute('column-order');

      newOrder = elBefore + ((elAfter - elBefore) / 2);
    }
    else if (i == columnArr.length - 1) {
      elBefore = +columnArr[i - 1].getAttribute('column-order');
      newOrder = elBefore + 1000;
    } else if (i == 0) {
      elAfter = +columnArr[i + 1].getAttribute('column-order');

      newOrder = elAfter / 2;
    }

    let column = this.board.columns.filter(x => x._id === event.columnId)[0];
    column.order = newOrder;
    this._columnService.put(column).then(res => {
      this._ws.updateColumn(this.board._id, column);
    });
  }


  blurOnEnter(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }

  enableAddColumn() {
    this.addingColumn = true;
    const input = document.querySelectorAll('.add-column')[0]
      .getElementsByTagName('input')[0];

    setTimeout(function () { input.focus(); }, 0);
    alert(`Only 1 Column allowed in basic version To add more columns subscribe to
    premium version`);
  }

  addColumn() {
    const newColumn = <Column>{
      title: this.addColumnText,
      order: (this.board.columns.length + 1) * 1000,
      boardId: this.board._id
    };

    // this.board.columns.push(newColumn);
    // this.updateBoardWidth();
    // this.addColumnText = '';
    this._columnService.post(newColumn)
    .subscribe((column: any) => {
      this.board.columns.push(column)
      console.log('column added', column);
      this.updateBoardWidth();
      this.addColumnText = '';
      this._ws.addColumn(this.board._id, column);
    });

  }

  addColumnOnEnter(event) {
    if (event.keyCode === 13) {
      if (this.addColumnText && this.addColumnText.trim() !== '') {
        this.addColumn();
      } else {
        this.clearAddColumn();
      }
    } else if (event.keyCode === 27) {
      this.clearAddColumn();
    }
  }

  addColumnOnBlur() {
    if (this.addColumnText && this.addColumnText.trim() !== '') {
      this.addColumn();
    }
    this.clearAddColumn();
  }

  clearAddColumn() {
    this.addingColumn = false;
    this.addColumnText = '';
  }


  addCard(card: Card) {

    this.board.cards.push(card);

  }

  foreceUpdateCards() {
    const cards = JSON.stringify(this.board.cards);
    this.board.cards = JSON.parse(cards);
  }


  onCardUpdate(card: Card) {
    this.foreceUpdateCards();
  }

  ngOnDestroy() {
    console.log(`leaving board ${this.board._id}`);
    this._ws.leave(this.board._id);
  }
}
