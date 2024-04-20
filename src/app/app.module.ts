// DEPENDENCIES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
// PROVIDERS
import { BoardService } from './board/board.service';
import { CardService } from './card/card.service';
import { HtpInterceptor } from './interceptor.service';
import { ColumnService } from './column/column.service';
import { HttpClientService } from './httpclient';
import { WebSocketService } from './ws.service';

// COMPONENTS
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardComponent } from './board/board.component';
import { ColumnComponent } from './column/column.component';
import { CardComponent } from './card/card.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { OrderBy } from './pipes/orderby.pipe';
import { Where } from './pipes/where.pipe';

const appRoutes: Routes = [
  { path: 'b/:id', component: BoardComponent },
  { path: '', component: DashboardComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BoardComponent,
    ColumnComponent,
    CardComponent,
    OrderBy,
    Where,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [BoardService, CardService, BoardService, ColumnService,HtpInterceptor, HttpClientService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
