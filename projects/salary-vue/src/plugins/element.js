import Vue from "vue"
//按需导入element ui组件
import { Input, Button, Table, TableColumn, Row, Col, Dialog, Select, Form, FormItem, DatePicker, Option, Popover, Pagination, Tabs, TabPane, Checkbox, CheckboxButton, CheckboxGroup, Dropdown, DropdownItem, DropdownMenu, Alert, RadioGroup, RadioButton, Menu, Submenu, MenuItemGroup, MenuItem, Radio, Tooltip, Container, Aside, Main, Header, Progress, Upload, Breadcrumb, BreadcrumbItem, InputNumber, MessageBox, Message, Steps, Step, Cascader, Loading, Notification, Autocomplete, Card, Carousel, CarouselItem, Tree, badge } from "element-ui"
Vue.prototype.$ELEMENT = {
        size: "small",
        zIndex: 3000
    } //统一控制大小
    //按需使用element ui组件
Vue.use(Input)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(DatePicker)
Vue.use(Option)
Vue.use(Popover)
Vue.use(Pagination)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Alert)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Radio)
Vue.use(Tooltip)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Progress)
Vue.use(Upload)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(InputNumber)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Loading.directive)
Vue.use(Autocomplete)
Vue.use(Card)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Tree)
Vue.use(badge)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$msgBox = MessageBox
Vue.prototype.$notify = Notification