<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>

        </el-breadcrumb>

        <el-card>
            <!-- 警告区域 -->
            <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false">
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:
                        <!-- 选择商品分类的级联选择框-->
                        <el-cascader v-model="selectedCatekeys" :options="catelist" :props="cateProp"
                            @change="handleChange" expandTrigger='hover'>
                        </el-cascader>
                    </span>
                </el-col>
            </el-row>
            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size='mini' :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数
                    </el-button>
                    <!-- 动态参数的表格 -->
                    <el-table :data="mabyTabData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable  @close="handleClose(index,scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加的按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-search"
                                    @click="showEidt(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="removeParams(scope.row.attr_id)">删除</el-button>


                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size='mini' :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性
                    </el-button>
                    <!-- 静态属性的表格 -->
                    <el-table :data="onlyTabData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加的按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-search"
                                    @click="showEidt(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
        </el-card>
        <!-- 这是添加参数的对话框 -->
        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addClose">
            <!-- 添加参数的对话框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数的对话框 -->
        <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editClose">
            <!-- 添加参数的对话框 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: {

        },
        data() {
            return {
                // 商品分类列表
                catelist: [],
                // 级联选择框配置对象
                cateProp: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 级联选择框双向绑定到数组
                selectedCatekeys: [],
                // 被激活页签的名称
                activeName: 'many',
                // 动态参数的数据
                mabyTabData: [],
                // 静态属性的数据
                onlyTabData: [],
                // 控制添加对话框的显示与隐藏
                addDialogVisible: false,
                // 添加参数的表单数据对象
                addForm: {},
                // 这是添加表单验证规则对象
                addFormRules: {
                    attr_name: [{
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }, ]
                },
                // 控制秀该对话框的显示和隐藏
                editDialogVisible: false,
                // 修改的表单数据对象
                editForm: {},
                // 修改表单的验证规则对象
                editFormRules: {
                    attr_name: [{
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }, ]
                },
            };
        },
        created() {
            this.getCateList()
        },
        methods: {
            getCateList() {
                this.axios.get('/api/categories').then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取商品失败')
                    }
                    this.catelist = res.data.data
                    console.log(this.catelist);
                })
            },
            handleChange() {
                // this.getParamsData()
                if (this.selectedCatekeys.length !== 3) {
                    this.selectedCatekeys = []
                    return
                }
                console.log(this.selectedCatekeys)
                // 根据所选分类的Id,和当前所处的面板，获取对应参数
                this.axios.get(`/api/categories/${this.cateId}/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                }).then(res => {

                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取参数列表失败！')
                    }

                    res.data.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        // 控制文本框的显示与隐藏
                        item.inputVisible = false
                        // 文本框中输入的值
                        item.inputValue = ''
                    });
                    console.log(res.data.data);
                    if (this.activeName === 'many') {
                        this.mabyTabData = res.data.data
                    } else {
                        this.onlyTabData = res.data.data
                    }
                })

            },
            // 这是tab 页签点击事件
            handleTabClick() {
                this.handleChange()
                console.log(this.activeName)
            },
            // 获取参数的列表数据
            getParamsData() {},
            // 监听添加对话框的事件
            addClose() {
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加参数
            addParams() {
                this.$refs.addFormRef.validate(v => {
                    if (!v) return
                    this.axios.post(`/api/categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    }).then(res => {
                        if (res.data.meta.status !== 201) {
                            return this.$message.error('添加参数失败')
                        }
                        this.$message.success('添加参数成功')
                        this.addDialogVisible = false
                        this.handleChange()
                    })
                })
            },
            // 点击按钮展示修改的对话框
            showEidt(attrId) {
                console.log(attrId);

                // 查询当前参数的id
                this.axios.get(`/api/categories/${this.cateId}/attributes/${attrId}`, {
                    params: {
                        attr_sel: this.activeName
                    }
                }).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取参数信息失败')
                    }
                    this.editForm = res.data.data
                })
                this.editDialogVisible = true
            },
            // 重置修改的表单
            editClose() {
                this.$refs.editFormRef.resetFields()
            },
            // 点击按钮修改
            editParams() {
                this.$refs.editFormRef.validate(v => {
                    if (!v) return
                    this.axios.put(`/api/categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    }).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('修改参数失败')
                        }
                        this.$message.success('修改数据成功');
                        this.handleChange();
                        this.editDialogVisible = false;
                    })
                })
            },
            // 根据Id删除对应的参数项
            removeParams(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.axios.delete(`/api/categories/${this.cateId}/attributes/${id}`).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('删除用户失败')
                        } else {
                            this.$message.success('删除用户成功')
                            this.handleChange();
                        }
                    })
                }).catch(err => {
                    if (err !== 'confirm') {
                        return this.$message.info('已取消删除')
                    }
                })
            },
            // 文本框失去焦点，或按下了 enter 都会触发
            handleInputConfirm(row) {
                if(row.inputValue.trim().length === 0){
                    row.inputValue =''
                     row.inputVisible = false
                     return
                }
               // 如果没有return 则证明输入的内容，需要做后续处理
               row.attr_vals.push(row.inputValue.trim())
               row.inputValue = ''
               row.inputVisible = false
               // 需要发起请求，保存这次操作
             this.saveAttrVals(row)
            },
            // 将对 attr_vals 的操作,保存到数据库
            saveAttrVals(row){
                 // 需要发起请求，保存这次操作
               this.axios.put(`/api/categories/${this.cateId}/attributes/${row.attr_id}`,{
                   attr_name:row.attr_name,
                   attr_sel:row.attr_sel,
                   attr_vals: row.attr_vals.join(' ')
               }).then(res=>{
                   if(res.data.meta.status !==200){
                       return this.$message.error('修改参数项失败')
                   }
                   this.$message.success('修改参数项成功')
               })
            },
            // 点击按钮，展示文本输入框
            showInput(row) {
                row.inputVisible = true;
                // 让文本框自动获取焦点
                // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 删除对应的参数可选项
            handleClose(index,row){
                row.attr_vals.splice(index,1)
                this.saveAttrVals(row)
            }

        },
        computed: {
            // 如果按钮要被禁用，则返回true，否则返回false
            isBtnDisabled() {
                if (this.selectedCatekeys.length !== 3) {
                    return true
                }
                return false
            },
            // 当前选中的三级分类Id
            cateId() {
                if (this.selectedCatekeys.length === 3) {
                    return this.selectedCatekeys[2]
                }
                return null
            },
            // 动态计算标题的文本
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }
        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .cat_opt {
        margin: 15px 0;
    }

    .el-tag {
        margin: 5px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>