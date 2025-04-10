/** @odoo-module */

import {Component,useState} from "@odoo/owl";
import { Card } from "./card";

export class CardList extends Component{
    static components = {Card}

    setup(){
        this.cards=useState([
            {title:"card 1",content:"this is card 1"},
            {title:"card 2",content:"this is card 2"},
            {title:"card 3",content:"this is card 3"},
        ]);
    }

} 