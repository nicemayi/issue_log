<style>

</style>
<template>
    <div class="issue-detail panel-body">
        <div>
            <h5>
                This is a <b style="color: red;">{{issue_detail.issue_type}}</b> issue from client <b style="color: red;">{{issue_detail.client_id}}</b>, opened by <b style="color: red;">{{issue_detail.create_by}}</b> at <b style="color: red;">{{issue_detail.create_time}}</b>
            </h5>
        </div>
        <div>
            <h5>
                <b>1. Description:</b>
            </h5>
            <p>&nbsp&nbsp&nbsp&nbsp{{issue_detail.description}}</p>
        </div>
        <div v-if="issue_detail.barcodes.length > 0">
            <h5>
                <b>2. Involved Patient Sample Barcodes:</b>
            </h5>
            <div class="btn-group" role="group" aria-label="Basic example">
                <label class="label label-default" style="margin: 1% 2% 1% 2%;" v-for="barcode in issue_detail.barcodes">{{barcode}}</label>
            </div>
        </div>
        <div v-else><h5><b>2. No involved patient samples.</b></h5></div>
        <div>
            <div v-if="issue_detail.comments.length > 0">
                <h5>
                    <b>3. Comments:</b>
                </h5>
                <ul>
                    <li v-for="each_comment in issue_detail.comments">
                        <h5 v-if="each_comment.comment_type === 'DEPARTMENT_CLOSE'">
                            <span
                                class="label label-primary"
                                style="margin-right: 0.5rem;">
                                {{each_comment.comment_from_department}} - Close
                            </span>
                            <b>{{each_comment.commented_time}} updated by {{each_comment.commented_by}} :</b>
                        </h5>
                        <h5 v-if="each_comment.comment_type === 'CLOSE_ISSUE'">
                            <span
                                class="label label-success"
                                style="margin-right: 0.5rem;">
                                Issue Closed By {{each_comment.commented_by}}
                            </span>
                            <b>{{each_comment.commented_time}} updated by {{each_comment.commented_by}} :</b>
                        </h5>
                        <h5 v-else>
                            <b>{{each_comment.commented_time}} updated by {{each_comment.commented_by}} :</b>
                        </h5>

                        <p>{{each_comment.comment_content}}</p>
                    </li>
                </ul>
            </div>
            <div v-else>
                <h5>
                    <b>3. Currently No Comments On This Issue.</b>
                </h5>
            </div>
        </div>
        <div v-if="issue_detail.is_closed == '0'">
            <div>
                <h5>
                    <b>Add Update Actions:</b>
                </h5>
                <div class="form-group">
                    <textarea
                        class="form-control"
                        rows="5"
                        v-model="action_content">
                    </textarea>
                </div>
            </div>
            <div>
                <h5><b>Add Department / Send notifications</b></h5>
                <div>
                    <div>
                        <el-form ref="form">
                            <el-form-item width="50%">
                                <el-select v-model="add_department_or_person" multiple placeholder="Select" style="width: 30%;">
                                    <el-option-group
                                        v-for="group in groups"
                                        :label="group.label">
                                        <el-option
                                            v-for="person in group.persons"
                                            :label="person.label"
                                            :value="person.value">
                                        </el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item style="float:left;">
                            <el-form-item>
                                <button :disabled="!validSubmit" type="submit" class="btn btn-primary" @click.stop.prevent="onSubmitStatus">Submit Updates</button>
                                <button :disabled="!is_head" type="submit" class="btn btn-success" @click.stop.prevent="onDepartmentCloseIssue">Department Close</button>
                                <button :disabled="!is_admin" type="submit" class="btn btn-danger" @click.stop.prevent="onCloseIssue">Close Issue ?</button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>

        </div>
        <div v-if="(issue_detail.is_closed == '1') && (is_admin)">
            <button :disabled="!is_admin" type="submit" class="btn btn-danger" @click.stop.prevent="onReOpenIssue">Re-open Issue ?</button>
        </div>
        <div v-if="issue_detail.departments.length + issue_detail.notifications.length">
            <hr class="seperate_relations"/>
            <div v-if="issue_detail.departments.length > 0">
                <h5>
                    Related to the following departments:
                </h5>
                <span v-for="(each_department, index) in issue_detail.departments">
                    <button :disabled="canBeRemoved" data-toggle="modal" :data-target="'#' + 'department-' + index" class="btn btn-info" style="margin-right: 1%; margin-bottom: 1%;"><b style="color: black;">{{each_department}}</b></button>
                    <remove-modal :issueNumber="issue_detail.issue_number" :removeModalIndex="'department-' + index" :removeModelUser="each_department" :operator="current_loggin_user"></remove-modal>
                </span>
            </div>
            <div v-if="issue_detail.notifications.length > 0">
                <h5>
                    This issue has been notified to:
                </h5>
                <span v-for="(each_user, index) in issue_detail.notifications">
                    <button :disabled="canBeRemoved" data-toggle="modal" :data-target="'#' + 'notification-' + index" class="btn btn-info" style="margin-right: 1%; margin-bottom: 1%;"><b style="color: black;">{{each_user}}</b></button>
                    <remove-modal :issueNumber="issue_detail.issue_number" :removeModalIndex="'notification-' + index" :removeModelUser="each_user" :operator="current_loggin_user"></remove-modal>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import RemoveModal from './RemoveModal';
    export default {
        props: ['issue_detail'],
        components: {RemoveModal},
        computed: {
            ...mapGetters({
                current_loggin_user: 'get_login_user',
                is_login: 'get_is_login',
                is_admin: 'get_is_admin',
                is_head: 'get_is_head',
                groups: 'get_groups',
                department: 'get_department'
            }),
            validSubmit: function() {
                let action_content = this.action_content.trim();
                let add_department_or_person = this.add_department_or_person;
                if (action_content == '' && add_department_or_person.length == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            canBeRemoved: function() {
                return ((this.issue_detail.is_closed == 1)) ? true: false;
            }
        },
        beforeMount: function() {
            this.issue_detail.notifications.sort()
            this.issue_detail.departments.sort()
        },
        mounted() {

        },
        data () {
            return {
                action_content: '',
                selected: null,
                options: ['foo','bar','baz'],
                send_to: "",
                add_department_or_person: "",
                links: [],
                state1: ''
            }
        },
        methods: {
            ...mapActions({
              reload: 'reload'
            }),
            onReOpenIssue() {
                if ((this.current_loggin_user) && (this.is_admin)) {
                    let self = this;
                    let input_user = this.current_loggin_user;
                    let issue_number = self.issue_detail.issue_number;
                    self.$http.post('/re-open-issue/', {input_user, issue_number}).then(function(res){
                        let res_data = res.data;
                        // console.log("In re-open res: ", res_data);
                        self.$message({
                          message: `You successfully re-opened issue ${issue_number}.`,
                          type: 'success'
                        });
                        self.$emit('closeMe')
                        self.reload();
                    }, function(err){
                        console.log("In re-open err: ", err);
                    });
                }
            },
            onDepartmentCloseIssue() {
                const self = this;
                console.log('in onDepartmentCloseIssue');
                let input_user = self.current_loggin_user;
                let action_content = self.action_content.trim();
                if (action_content) {
                    action_content = action_content[0].toUpperCase() + action_content.slice(1, action_content.length);
                }
                let issue_number = self.issue_detail.issue_number;
                let departments = []
                self.issue_detail.departments.forEach(el => {
                    departments.push(el);
                });
                let notifications = []
                self.issue_detail.departments.forEach(el => {
                    notifications.push(el);
                })
                let tmp = self.add_department_or_person;
                let add_department_or_person = [];
                for (let each of tmp) {
                    if (!(departments.includes(each) || notifications.includes(each))) {
                        add_department_or_person.push(each);
                    }
                }
                action_content = `${self.department.toUpperCase()} close issue. ` + action_content;
                const comment_type = "DEPARTMENT_CLOSE";
                self.$http.post('/update-issue/', {input_user, action_content, issue_number, add_department_or_person, comment_type}).then(res => {
                    let res_data = JSON.parse(res.data);
                    self.$message({
                        message: `You successfully updated issue ${issue_number}`,
                        type: 'success'
                    });
                    self.reload();
                    self.action_content = '';
                    self.add_department_or_person = [];
                }, err => {
                    console.log("In submit err: ", err);
                })
            },
            onCloseIssue() {
                if ((this.current_loggin_user) && (this.is_admin)) {
                    let self = this;
                    let input_user = this.current_loggin_user;
                    let issue_number = self.issue_detail.issue_number;

                    let action_content = self.action_content.trim();
                    if (action_content) {
                        action_content = action_content[0].toUpperCase() + action_content.slice(1, action_content.length);
                    }
                    let departments = []
                    self.issue_detail.departments.forEach(el => {
                        departments.push(el);
                    });
                    let notifications = []
                    self.issue_detail.departments.forEach(el => {
                        notifications.push(el);
                    })
                    let tmp = self.add_department_or_person;
                    let add_department_or_person = [];
                    for (let each of tmp) {
                        if (departments.includes(each) || notifications.includes(each)) {
                        } else {
                            add_department_or_person.push(each);
                        }
                    }

                    const updates = {};
                    if (action_content !== '' || add_department_or_person.length !== 0) {
                        updates.action_content = action_content;
                        updates.add_department_or_person = add_department_or_person;
                    }

                    self.$http.post('/close-issue/', {input_user, issue_number, updates}).then(function(res){
                        let res_data = res.data;
                        self.$message({
                          message: `You closed issue ${issue_number}`,
                          type: 'success'
                        });
                        self.$emit('closeMe')
                        self.reload();
                    }, function(err){
                        console.log("In close err: ", err);
                    });
                }
            },
            onSubmitStatus() {
                if (this.current_loggin_user && this.is_login) {
                    let self = this;
                    let input_user = self.current_loggin_user;
                    let action_content = self.action_content.trim();
                    if (action_content) {
                        action_content = action_content[0].toUpperCase() + action_content.slice(1, action_content.length);
                    }
                    let issue_number = self.issue_detail.issue_number;
                    let departments = []
                    self.issue_detail.departments.forEach(el => {
                        departments.push(el);
                    });
                    let notifications = []
                    self.issue_detail.departments.forEach(el => {
                        notifications.push(el);
                    })
                    let tmp = self.add_department_or_person;
                    let add_department_or_person = [];
                    for (let each of tmp) {
                        if (departments.includes(each) || notifications.includes(each)) {
                            // self.$notify({
                            //     type: 'warning',
                            //     title: `You do not need to notify ${each}`,
                            //     message: `${each} has already been nofified.`,
                            //     duration: 5000
                            // });
                        } else {
                            // console.log(`${each} is not in here`);
                            add_department_or_person.push(each);
                        }
                    }
                    if (action_content == '' && add_department_or_person.length == 0) {
                        // console.log("empty!!!");

                    } else {
                        const comment_type = 'NORMAL';
                        self.$http.post('/update-issue/', { input_user, action_content, issue_number, add_department_or_person, comment_type }).then(res => {
                            // console.log(res);
                            let res_data = JSON.parse(res.data);
                            // console.log("In submit res: ", res_data);
                            self.$message({
                              message: `You successfully updated issue ${issue_number}`,
                              type: 'success'
                            });
                            self.reload();
                            self.action_content = '';
                            self.add_department_or_person = [];
                        }, err => {
                            console.log("In submit err: ", err);
                        })
                    }
                }
            },
            querySearch(queryString, cb) {
                var links = this.links;
                var results = queryString ? links.filter(this.createFilter(queryString)) : links;
                // call callback function to return suggestions
                cb(results);
            },
            createFilter(queryString) {
                return (link) => {
                    return (link.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAll() {
                return [
                    { "value": "vue", "link": "https://github.com/vuejs/vue" },
                    { "value": "element", "link": "https://github.com/ElemeFE/element" },
                    { "value": "cooking", "link": "https://github.com/ElemeFE/cooking" },
                    { "value": "mint-ui", "link": "https://github.com/ElemeFE/mint-ui" },
                    { "value": "vuex", "link": "https://github.com/vuejs/vuex" },
                    { "value": "vue-router", "link": "https://github.com/vuejs/vue-router" },
                    { "value": "babel", "link": "https://github.com/babel/babel" }
                ];
            },
            handleSelect(item) {
                // console.log(item);
            }
        }
    }
</script>
