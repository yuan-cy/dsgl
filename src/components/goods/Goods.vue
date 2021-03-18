<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图区域 -->
        <el-card>
            <!-- 搜索与添加 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList"
                        class="input-with-select">
                        <el-button slot="append" @click="getGoodsList" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="goodlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
                <el-table-column label="添加时间" prop="add_time" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.add_time|dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template #default="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.goods_id)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeById(scope.row.goods_id)"></el-button>

                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>
        <!-- 修改的对话框 -->
        <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="editForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="editForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="editForm.goods_number" type="number"></el-input>
                </el-form-item>
                   <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="editForm.goods_cat" :options="catelist" :props="cateProps"
                                @change="handleChange"></el-cascader>
                  </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
     import _ from 'lodash'
    export default {
        props: {

        },
        data() {
            return {
                // 查询参数对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                // 商品列表
                goodlist: [],
                // 总数据条数
                total: 0,
                // 修改对话框的显示与隐藏
                editdialogVisible: false,
                editForm: {},
                editFormRules: {
                    goods_name: [{
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }, ],
                    goods_price: [{
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }, ],
                    goods_weight: [{
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    }, ],
                    goods_number: [{
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }, ],
                    goods_cat: [{
                        required: true,
                        message: '请选择分类',
                        trigger: 'blur'
                    }, ]
                },
                 // 商品分类列表
                    catelist: [],
                cateProps: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children',
                    expandTrigger: 'hover'
                },
            };
        },
        created() {
            this.getGoodsList()
            this.getCateList()
        },
        methods: {
               // 获取所有商品分类数据
            getCateList() {
                this.axios.get('/api/categories').then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取商品分类数据')
                    }
                    this.catelist = res.data.data
                    console.log(this.catelist);
                })
            },
            // 根据分页获取对应的商品列表
            getGoodsList() {
                this.axios.get('/api/goods', {
                    params: this.queryInfo
                }).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取商品列表失败')
                    } else {
                        this.$message.success('获取商品列表成功')
                    }
                    console.log(res.data.data.goods);
                    this.goodlist = res.data.data.goods
                    
                    this.total = res.data.data.total
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            removeById(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.axios.delete(`/api/goods/${id}`).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('删除失败')
                        }
                        this.$message.success('删除成功')
                        this.getGoodsList()
                    })
                }).catch(err => {
                    if (err !== 'confirm') {
                        return this.$message.info('已取消删除')
                    }
                })
            },
            goAddpage() {
                this.$router.push('/home/add')
            },
            // 修改按钮
            showEdit(id) {
                console.log(id)
                this.axios.get(`/api/goods/${id}`).then(res => {

                    if (res.data.meta.status !== 200) {
                        return this.$message.error('查询用户信息失败')
                    }
                    this.editForm = res.data.data
                })
                this.editdialogVisible = true
            },
            // 修改用户信息并提交
            editUserInfo() {
                     // 执行添加的业务逻辑
                    const form = _.cloneDeep(this.editForm)
                    form.goods_cat = form.goods_cat.join(',')
                this.$refs.editFormRef.validate(v => {
                    if (!v) return
                    this.axios.put(`/api/goods/${this.editForm.goods_id}`, {
                        goods_name: this.editForm.goods_name,
                        goods_price: this.editForm.goods_price,
                        goods_number: this.editForm.goods_number,
                        goods_weight: this.editForm.goods_weight,
                        goods_cat:   form.goods_cat
                    }).then(res => {
                        console.log(res);
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('更新用户信息失败')
                        }
                          // 关闭对话框
                        this.editdialogVisible = false
                        // 修改数据列表
                        this.getGoodsList();
                        // 提示修改成功
                        this.$message.success('更新用户信息成功')
                    })
                })
            },
            handleChange(){
                console.log(this.editForm.goods_cat)
                if (this.editForm.goods_cat.length !== 3) {
                    this.editForm.goods_cat = []
                }
            }
        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .el-table {
        margin-top: 15px;
    }
</style>