/** @odoo-module */

import {Component} from "@odoo/owl";

export class Card extends Component{

    static props = {
        title:String,
        content:String,
    };
}

Card.template="owl.DemoCard";

