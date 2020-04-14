import Vue from 'vue'
//按需导入element ui组件
import {
    Input,
    Button,
    Table,
    TableColumn,
    Row,
    Col,
    Dialog,
    Card,
    Form,
    FormItem,
    Message,
    Container,
    Aside,
    Main,
    Image,
    Icon,
    Tag,
    ButtonGroup,
    Checkbox,
    CheckboxGroup,
    CheckboxButton,
    Select,
    Option,
    MessageBox,
    Pagination,
    DatePicker,
    Switch,
    Upload,
    Tree,
    Loading
} from 'element-ui'
Vue.prototype.$ELEMENT = {
    size: 'small',
    zIndex: 10001
} //统一控制大小
//按需使用element ui组件
Vue.use(Input)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Image)
Vue.use(Icon)
Vue.use(Tag)
Vue.use(ButtonGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(CheckboxButton)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(DatePicker) 
Vue.use(Switch)
Vue.use(Upload)
Vue.use(Tree)
Vue.use(Loading.directive)

    
Vue.prototype.$message = Message
Vue.prototype.$msgBox = MessageBox
Vue.prototype.$loading = Loading.service

