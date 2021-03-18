<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <!-- 步骤条区 -->
            <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="deforeTabLeave"
                    @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name='1'>
                        <!-- 渲染表单的Item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTabeData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name='2'>
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name='3'>
                        <!-- action 表示图片要上传到后台api地址 -->
                        <el-upload action="http://192.168.1.30:8888/api/private/v1/upload" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headersObj"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click='add'>添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="perviewImg">

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
                activeIndex: '0',
                // 添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    // 商品所属的分类数组
                    goods_cat: [],
                    // 图片的数组
                    pics: [],
                    // 商品的详情描述
                    goods_introduce: '',
                    attrs:[]
                },
                addFormRules: {
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
                // 动态参数列表数据
                manyTabeData: [],
                // 静态属性列表数据
                onlyTableData: [],
                // 图片上传组件的headers请求头对象
                headersObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewPath: '',
                previewVisible: false

            };
        },
        created() {
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
            // 级联选择器选中项变化，会触发这个函数
            handleChange() {
                console.log(this.addForm.goods_cat)
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                }
            },
            deforeTabLeave(activeName, oldActiveName) {
                // console.log('离开的页面:'+oldActiveName);
                // console.log('进入的页面:'+activeName);
                // return false

                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类')
                    return false
                }
            },
            tabClicked() {
                // console.log(this.activeIndex)
                // console.log('1')
                // 证明访问的是动态参数面板
                if (this.activeIndex === '1') {
                    this.axios.get(`/api/categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'many'
                        }
                    }).then(res => {
                        console.log(res.data);
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('获取动态参数列表失败')
                        }
                        res.data.data.forEach(item => {
                            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(
                                ' ')
                        })
                        this.manyTabeData = res.data.data
                        console.log(this.manyTabeData)
                    })
                } else if (this.activeIndex === '2') {
                    this.axios.get(`/api/categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'only'
                        }
                    }).then(res => {

                        if (res.data.meta.status !== 200) {
                            return this.$message.error('获取静态属性失败')
                        }
                        console.log(res.data.data);
                        this.onlyTableData = res.data.data
                    })

                }
            },
            // 处理图片预览效果
            handlePreview(file) {
                console.log(file);
                this.previewPath = file.url
                this.previewVisible = true
            },
            // 处理移除图片的操作
            handleRemove(file) {
                console.log(file);
                // 1. 获取要删除的图片的临时路径
                const filePath = file.response.data.tmp_path
                // 2. 从pics 数组中，找到这个图片对应的索引值
                const i = this.addForm.pics.findIndex(x =>
                    x.pic === filePath)

                // 3. 调用数组的 splice 方法， 把图片信息对象， 从pics 数组中移除
                this.addForm.pics.splice(i, 1)
                console.log(this.addForm);

            },
            // 监听图片上传成功的数据
            handleSuccess(response) {
                console.log(response);
                // 1. 先拼接的得到一个图片的信息对象
                const picInfo = {
                    pic: response.data.tmp_path
                }
                // 2. 将图片信息对象，push到pics 数组中
                this.addForm.pics.push(picInfo)
                console.log(this.addForm);

            },
            // 商品添加按钮
            add() {
                console.log(this.addForm);
                this.$refs.addFormRef.validate(v => {
                    if (!v) {
                        return this.$message.error('请填写必要的表单项目')
                    }
                    // 执行添加的业务逻辑
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTabeData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    // 处理静态属性

                    this.onlyTableData.forEach(item => {
                        const newonly = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals,
                        }
                        console.log(newonly);
                        
                        this.addForm.attrs.push(newonly)
                    })
                    form.attrs = this.addForm.attrs
                    console.log(form)
                    // 发起请求添加商品
                    // 商品的名称，必须是唯一的
                    this.axios.post(`/api/goods`,form).then(res=>{
                        console.log(res);
                        
                        if(res.data.meta.status !== 201){
                            return this.$message.error('添加商品失败')
                        }
                        this.$message.success('添加商品成功')
                        this.$router.push('/home/goods')
                    })
                })
            }
        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        },
        components: {

        },
    };
</script>

<style scoped lang="less">
    .el-steps {
        margin: 15px 0px;
    }

    .el-cascader {
        width: 260px;
    }

    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .perviewImg {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>