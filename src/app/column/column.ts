import { Card } from '../card/card';

export class Column {
    _id?: string;
    id?: number;
    title: string;
    boardId: string;
    order: number;
    cards?: Card[];
}
