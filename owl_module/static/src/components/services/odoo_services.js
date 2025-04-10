/**@odoo-module */

import {registry} from "@web/core/registry"
import {Layout} from "@web/search/layout"
import {getDefaultConfig} from "@web/views/view"
import {useService} from "@web/core/utils/hooks"
import {ConfirmationDialog} from "@web/core/confirmation_dialog/confirmation_dialog"
import {routeToUrl} from "@web/core/browser/router_service"
import {browser} from "@web/core/browser/browser"

const {Component,useSubEnv,onMounted,useState} = owl

export class OwlOdooServices extends Component {
    setup(){
        console.log("Owl Odoo Services");
        console.log(this.env.services) //for getting all the services in console 

        this.display={
            controlPanel:{"top-right":false,"bottom-right":false}
        }

        useSubEnv({
            config:{
                ...getDefaultConfig,
                ...this.env.config,      
            }
        })

        // this.localStorageService = useService("local_storage");
        onMounted(() => {
            const isDarkTheme = window.localStorage.getItem("dark_theme");
            console.log("Dark mode on load:", isDarkTheme); // Debugging
            if (isDarkTheme === "true") {
                document.body.classList.add("o_dark_mode");
            }
        });
        
        const router = this.env.services.router

        this.state = useState({
            get_http_data :[],
            post_http_data :[],
            rpc_state:[],  
            orm_state:[],
            bg_success:router.current.search.bg_success,
            user_data:null,
            company_data:null,
        })


        const titleService = useService("title")
        titleService.setParts({zopenerp:"Rahul"})
        console.log(titleService.getParts())

        // this.notification = useService("notification") same as notification variable value

        // this.cookieService = useService("cookie")
        // console.log(this.cookieService)
    }

    localStoragess() { //use instead of cookie service for odoo17 and onwards
        const isDarkMode = document.body.classList.toggle("dark_mode_enabled");
        window.localStorage.setItem("dark_theme", isDarkMode);
    
        let darkModeStyle = document.getElementById("dark-mode-style");
    
        if (isDarkMode && !darkModeStyle) {
            document.head.insertAdjacentHTML("beforeend", `
                <style id="dark-mode-style">
                    :root, .o_web_client { background-color: #121212 !important; color: #ffffff !important; }
                </style>
            `);
            // document.cookie = "test=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; use if below approach not work for the browser
            if ('cookieStore' in window) {
                cookieStore.delete("test").then(() => {
                    console.log("Cookie 'test' deleted!");
                });
            } else {
                console.log("Cookie Store API not supported.");
            }
            

        } else if (!isDarkMode && darkModeStyle) {
            darkModeStyle.remove();
        }
    
        console.log("Dark mode toggled:", isDarkMode);
    }

    async getHttpServices(){
        const http = this.env.services.http
        console.log(http)
        const data = await http.get('https://dummyjson.com/products')
        console.log(data)
        this.state.get_http_data = data.products
    }

    async postHttpServices(){
        const http = this.env.services.http
        console.log(http)
        const data = await http.post('https://dummyjson.com/users/add',{firstName:'rahul',lastName:'gautam'})
        this.state.post_http_data.push(data);
        console.log(data)
    }

    async rpcServices(){
        const rpc = this.env.services.rpc;
        const data = await rpc("/owl/rpc_service",{limit:15})
        console.log(data)
        this.state.rpc_state=data;
    }

    async ormService(){
        const orm = this.env.services.orm;
        console.log(orm)
        const data = await orm.searchRead("res.partner",[],['name','email'])
        console.log(data)
        this.state.orm_state=data;
    }

    getAction(){
        const action = this.env.services.action
        console.log(action)
        action.doAction({
            type:"ir.actions.act_window",
            target:"new",
            name:"Action Service",
            res_model:"res.partner",
            context:{},
            views:[
                [false,"list"],
                [false,"form"],
            ],
            view_mode:"list,form",
            target:"current",
        })
    }

    getRouterService(){
        const router = this.env.services.router
        console.log(router)
        let {search} = router.current
        search.bg_success = search.bg_success == "1" ? "0" : "1"
        console.log(router.current)
        browser.location.href=browser.location.origin + routeToUrl(router.current)
    }


    getUser(){
        const user = this.env.services.user
        console.log(user)
        this.state.user_data = JSON.stringify(user)
    }

    getCompany(){
        const company = this.env.services.company
        console.log(company)
        this.state.company_data = JSON.stringify(company)
    }

    showNotification(){
        const notification=this.env.services.notification
        notification.add("This is a notification",{
            title:"Odoo notification service",
            type:"warning",
            sticky:true,
            className:"p-4",
            buttons:[
                {
                name:" Notification ",
                onClick:()=>{
                    console.log("Button Notification Clicked.....")
                },
                primary:true
                },
                {
                    name:"Show",
                    onClick:()=>{
                        this.showNotification()
                    },
                }
            ]
        })
    }

    showDialog(){
        const dialog = this.env.services.dialog
        console.log(dialog)
        dialog.add(ConfirmationDialog,{
            title:"Dialog Services",
            body:"Are you sure to Continue?",
            confirm:()=>{
                console.log("Dialog Confirmed")
            },
            cancel:()=>{
                console.log("Dialog Cancelled...")
            }
        },{
            onClose:()=>{
                console.log("Closed The Dialog Services............")
            }
            })
    }

    showEffect(){
        const effect = this.env.services.effect
        console.log(effect)
        effect.add({
            type:"rainbow_man",
            message:"Effect Service is working fine..",
        })
    }

    
    
}

OwlOdooServices.template= "owl.OdooServices"
OwlOdooServices.components={Layout}

registry.category("actions").add("owl.OdooServices",OwlOdooServices)
