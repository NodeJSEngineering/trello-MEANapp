import { Column } from '../column/column';
import { Card } from '../card/card';

export class Board {
_id?: string;
id?: string;
title: string;
columns: Column[];
cards?: Card[];
userList?: any;
}
