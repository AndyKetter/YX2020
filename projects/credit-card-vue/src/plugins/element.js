import Vue from 'vue'
//按需导入element ui组件
import {
    Input,
    DatePicker,
    Button,
    Table,
    TableColumn,
    Pagination,
    Row,
    Col,
    Select,
    Option,
    Checkbox,
    Dialog,
    ColorPicker,
    Badge,
    Tabs,
    Tag,
    TabPane,
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Popover,
    Autocomplete,
    CheckboxGroup,
    Card,
    ButtonGroup,
    Tooltip,
    Message,
    Loading,
    InputNumber,
    Progress,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Alert,
} from 'element-ui' 
Vue.prototype.$ELEMENT = {size:'small',zIndex:3000} //统一控制大小 
//按需使用element ui组件
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(Checkbox)
Vue.use(Dialog)
Vue.use(ColorPicker)
Vue.use(Badge)
Vue.use(Tabs)
Vue.use(Tag)
Vue.use(TabPane)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Popover)
Vue.use(Autocomplete)
Vue.use(CheckboxGroup)
Vue.use(Card)
Vue.use(ButtonGroup)
Vue.use(Tooltip)
Vue.use(InputNumber)
Vue.use(Loading.directive)
Vue.use(Progress)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Alert)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service