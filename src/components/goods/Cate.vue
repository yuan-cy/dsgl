<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCate">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <zk-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
                show-index index-text="#" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted ===false" style="color:lightgreen;"></i>
                    <i class="el-icon-error" style="color:red;" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
                    <el-tag size="mini" v-else type="warning">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEidt(scope.row.cat_id)">编辑
                    </el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                        @click="removeUserById(scope.row.cat_id)">删除
                    </el-button>
                </template>
            </zk-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCateClose'>
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- options 用来指定数据源-->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader v-model="selectdkeys" :options="PcateList" expand-trigger='hover'
                        :props="cascaderProps" @change="pcd" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改分类的对话框 -->
        <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%" @close='editCateClose'>
            <!-- 添加分类的表单 -->
            <el-form :model="editCateForm" ref="editCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
                // 查询条件
                querInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                // 商品分类的数据列表，默认为空
                catelist: [],
                // 总数据条数
                total: 0,
                // 为table指定列
                columns: [{
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: "是否有效",
                        // 表示将当前列定义为模板
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'isok'

                    },

                    {
                        label: "排序",
                        // 表示将当前列定义为模板
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'order'

                    },
                    {
                        label: "操作",
                        // 表示将当前列定义为模板
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'opt'

                    },


                ],
                // 控制添加分类对话框显示和隐藏
                addCateDialogVisible: false,
                // 控制修改分类对话框显示和隐藏
                editCateDialogVisible: false,
                // 添加分类的表单数据对象
                addCateForm: {
                    // 将要添加分类的名称
                    cat_name: '',
                    // 父级分类的id
                    cat_pid: 0,
                    // 分类的等级默认要添加的是一级分类
                    cat_level: 0
                },
                // 添加分类表单的验证规则对象
                addCateFormRules: {
                    cat_name: [{
                        required: true,
                        message: '请输入分类的名称',
                        trigger: 'blur'
                    }, ]
                },
                // 父级分类的列表
                PcateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly: true
                },
                // 选中的父级分类的Id数组
                selectdkeys: [],
                //修改
                editCateForm: {}
            };
        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取商品分类数据
            getCateList() {
                this.axios.get('/api/categories', {
                    params: this.querInfo
                }).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取商品失败')
                    }
                    // console.log(res.data.data)
                    this.catelist = res.data.data.result;
                    this.total = res.data.data.total;
                })
            },
            // 监听pagesize 改变
            handleSizeChange(newSize) {
                this.querInfo.pagesize = newSize;
                this.getCateList();
            },
            // 监听pagenum 的改变
            handleCurrentChange(newPage) {
                this.querInfo.pagenum = newPage;
                this.getCateList();
            },
            // 点击按钮，展示添加分类的对话框
            showAddCate() {
                // 先获取父级分类的数据列表
                this.getPcateList()
                // 在展示出对话框
                this.addCateDialogVisible = true
            },
            // 获取父级分类的数据列表
            getPcateList() {
                this.axios.get('/api/categories', {
                    params: {
                        type: 3
                    }
                }).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取父级分类失败')
                    }
                    console.log(res.data.data)
                    this.PcateList = res.data.data
                })
            },
            // 选择项发生变化触发这个函数
            pcd() {
                console.log(this.selectdkeys)
                // 如果selectdkeys 数组中的length 大于0 证明选中的父级分类
                // 反之，就说明没有选中任何父级分类
                if (this.selectdkeys.length > 0) {
                    // 父级分类的Id
                    this.addCateForm.cat_pid = this.selectdkeys[this.selectdkeys.length - 1]
                    // 为当前分类的等级赋值
                    this.addCateForm.cat_level = this.selectdkeys.length
                    return
                } else {

                    this.addCateForm.cat_pid = 0

                    this.addCateForm.cat_level = 0
                }
            },
            // 点击按钮，添加新的分类
            addCate() {
                this.$refs.addCateFormRef.validate(valid => {
                    if (!valid) return
                    this.axios.post('/api/categories', this.addCateForm).then(res => {
                        if (res.data.meta.status !== 201) {
                            return this.$message.error('添加分类失败')
                        }
                        this.$message.success('添加分类成功')
                        this.getCateList()
                        this.addCateDialogVisible = false
                    })
                })
            },
            // 监听对话框的关闭，重置表单数据
            addCateClose() {
                this.$refs.addCateFormRef.resetFields()
                this.selectdkeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            },

            // 编辑按钮 展示修改分类的对话框
            showEidt(id) {
                console.log(id)
                this.axios.get('/api/categories/' + id).then(res => {
                    console.log(res);

                    if (res.data.meta.status !== 200) {
                        return this.$message.error('查询用户信息失败')
                    }
                    this.editCateForm = res.data.data
                })
                this.editCateDialogVisible = true
            },
            // 修改用户信息并提交
            editUserInfo() {
                this.$refs.editCateFormRef.validate(valid => {
                    if (!valid) return
                    this.axios.put(`/api/categories/${this.editCateForm.cat_id}`, {
                        cat_name: this.editCateForm.cat_name
                    }).then(res => {


                        if (res.data.meta.status !== 200) {
                            return this.$message.error('更新用户信息失败')
                        }
                        // 关闭对话框
                        this.editCateDialogVisible = false
                        // 修改数据列表
                        this.getCateList();
                        // 提示修改成功
                        this.$message.success('更新用户信息成功')
                    })
                })
            },
            // 监听对话框的关闭，重置表单数据
            editCateClose() {
                this.$refs.editCateFormRef.resetFields()
            },
            // 根据Id删除对应的用户信息
            removeUserById(id) {
                console.log(id)
                // 弹框询问是否删除数据
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res=>{
                    this.axios.delete(`/api/categories/${id}`).then(res=>{
                         if (res.data.meta.status !== 200) {
                            return this.$message.error('删除用户失败')
                        } else {
                            this.$message.success('删除用户成功')
                            this.getCateList();
                        }
                    })
                }).catch(err=>{
                    if (err !== "confirm") {
                        return this.$message.info('已取消删除')
                    }
                })
            }
        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .treeTable {
        margin-top: 15px;
    }
    .box-card{
        margin-top: 15px;
    }
</style>