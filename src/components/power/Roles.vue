<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>

            <el-row>
                <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <el-table-column type="expand">

                    <template #default="scope">
                        <el-row :class="['bdbottom',index === 0 ? 'bdtop':'', 'vcenter']"
                            v-for="(item,index) in scope.row.children" :key="item.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row :class="[i2 ===0?'':'bdtop', 'vcenter']" v-for="(ite,i2) in item.children"
                                    :key="ite.id">
                                    <el-col :span='6'>
                                        <el-tag type="success" closable @close="removeRightById(scope.row,ite.id)">
                                            {{ite.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span='18'>
                                        <el-tag type="warning" v-for="item3 in ite.children" :key="item3.id" closable
                                            @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                    </template>
                </el-table-column>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="角色描述" prop="roleDesc">
                </el-table-column>
                <el-table-column table="操作" width='300px'>
                    <template #default="scope">

                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.id)">编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="removeUserById(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting"
                            @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限的对话框  -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close='setRightDialogClosed'>
            <!-- 树形控件 -->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key='id' default-expand-all
                :default-checked-keys="defkeys" ref="treeref"></el-tree>
            <span slot="footer" class="dialog-footer">

                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <!-- @click="setRightDialogVisible = false" -->
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加角色对话框 -->
        <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
            <!-- <span>这是一段信息</span> -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色的对话框 -->
        <el-dialog title="提示" :visible.sync="EditdialogVisible" width="50%">
            <el-form :model="addForm" ref="EditFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="EditForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="EditForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="EditUser">确 定</el-button>
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
                // 所有角色列表数据
                rolelist: [],
                // 控制分配权限的对话框
                setRightDialogVisible: false,
                // 所有权限的数据
                rightslist: [],
                // 树形控件
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 默认选中的节点Id值数组
                defkeys: [],
                // 当前即将分配权限的角色id
                roleId: '',
                // 添加用户对话框的显示和隐藏
                addDialogVisible: false,
                //添加用户的数据表单
                addForm: {
                    roleName: '',
                    roleDesc: ''
                },
                addFormRules: {
                    roleName: [{
                            required: true,
                            message: '请输入角色名称',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: '长度在 3 到 10 个字符',
                            trigger: 'blur'
                        }
                    ],

                    roleDesc: [{
                            required: true,
                            message: '请输入角色描述',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: '长度在 3 到 10 个字符',
                            trigger: 'blur'
                        }
                    ],
                },
                // 修改用户
                EditForm: {},
                EditdialogVisible: false,

            };
        },
        created() {
            this.getRoleList()
        },
        methods: {
            // 获取所有角色的列表
            getRoleList() {
                this.axios.get('api/roles').then(res => {

                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取角色失败')
                    }
                    this.rolelist = res.data.data;
                    // console.log(this.rolelist)

                })
            },
            // 根据id删除对应的权限
            removeRightById(role, rightId) {
                // 弹框提示用户是否删除
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.axios.delete(`api/roles/${role.id}/rights/${rightId}`).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('删除权限失败')
                        } else {
                            // this.getRoleList()
                            role.children = res.data.data
                        }
                    })
                }).catch(err => {
                    if (err !== 'confirm') {
                        return this.$message.info('取消了删除')
                    }
                })

            },
            // 展示分配权限的对话框
            showSetRightDialog(role) {
                this.roleId = role.id
                // 获取所有权限的数据
                this.axios.get('api/rights/tree').then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取数据失败！')
                    }
                    // 获取到的权限数据保存到data中
                    this.rightslist = res.data.data
                    // console.log(this.rightslist)

                })
                // 递归获取三级节点的Id
                this.getleafkeys(role, this.defkeys)
                this.setRightDialogVisible = true
            },
            // 通过递归的形势， 获取所有角色下的三级特权的id，并保存到defkeys 数组中
            getleafkeys(node, arr) {
                // 如果当前 node 节点不包含children 属性 则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getleafkeys(item, arr)
                });
            },
            // 监听分配权限的对话框的关闭事件
            setRightDialogClosed() {
                this.defkeys = []
            },
            // 点击为角色分配权
            allotRights() {
                const keys = [
                    ...this.$refs.treeref.getCheckedKeys(),
                    this.$refs.treeref.getHalfCheckedKeys()
                ]
                // console.log(keys)
                const idStr = keys.join(',');
                this.axios.post(`api/roles/${this.roleId}/rights`, {
                    rids: idStr
                }).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('分配权限失败')
                    }
                    this.$message.success('分配权限成功');
                    this.getRoleList()
                    this.setRightDialogVisible = false
                })



            },
            // 添加角色
            addUser() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return
                    // 可以发起添加用户的网络请求
                    this.axios.post('api/roles', this.addForm).then(res => {
                        console.log(res);
                        if (res.data.meta.status !== 201) {
                            return this.$message.error('添加用户失败')
                        }
                        this.$message.success('添加用户成功');
                        this.addDialogVisible = false;
                        this.getRoleList()
                    })
                })
            },
            
            // 修改角色
            showEdit(id) {
                // console.log(id);
                this.axios.get('/api/roles/' + id).then(res => {
                    // console.log(res);
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('查询用户信息失败')
                    }
                    this.EditForm = res.data.data
                    console.log(this.EditForm);

                })
                this.EditdialogVisible = true
            },
            EditUser() {
                this.$refs.EditFormRef.validate(valid => {
                    if (!valid) return;
                    this.axios.put('/api/roles/' +this.EditForm.roleId, {
                        roleName: this.EditForm.roleName,
                        roleDesc: this.EditForm.roleDesc
                    }).then(res => {
                        // console.log(res);

                        if (res.data.meta.status !== 200) {
                            return this.$message.error('更新用户信息失败')
                        }
                        // 关闭对话框
                        this.EditdialogVisible = false
                        // 修改数据列表
                        this.getRoleList();
                        // 提示修改成功
                        this.$message.success('更新用户信息成功')
                    })

                })
            },
            // 根据Id删除对应的用户信息
            removeUserById(id) {
                console.log(id);
                // 弹框询问是否删除数据
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.axios.delete('/api/roles/' + id).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('删除用户失败')
                        } else {
                            this.$message.success('删除用户成功')
                            this.getRoleList();
                        }
                    })
                }).catch(err => {
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
    .el-card {
        margin-top: 15px;

        .el-tag {
            margin: 7px;
        }
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>