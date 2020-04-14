import Vue from 'vue'
//安按需导入element-ui组件
//以前的写法
/*import {Button} from 'element-ui'
import {Form} from 'element-ui'
import {FormItem} from 'element-ui'
import {Input} from 'element-ui'*/

//合并方式(优化)
//导入组件
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload,
    DatePicker,
    InputNumber,
    Collapse,
    CollapseItem,
    Timeline,
    TimelineItem
} from 'element-ui'


//注册为全局组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(InputNumber)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Timeline)
Vue.use(TimelineItem)






//如果需要设置全局变量，在main.js中，Vue实例化的代码理添加。
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
