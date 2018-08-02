<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
    .el-table .positive-row {
        background: #e2f0e4;
    }
</style>

<template>
    <el-form ref="form" label-width="140px">
        <el-form-item label="Issue Title" prop="issue_title">
            <el-input v-model="issue_form.issue_title"></el-input>
        </el-form-item>
        <el-form-item label="Issue From">
            <el-autocomplete
                v-model="searchForClient"
                :fetch-suggestions="querySearchClient"
                custom-item="client-id"
                placeholder="You can search for ID number or name..."
                @select="handleSelectClient"
                style="width: 100%;">
            </el-autocomplete>
        </el-form-item>
        <el-form-item label="Issue Type">
            <el-radio-group style="margin-left: 1%; float: left;" v-model="issue_form.issue_type">
                <el-radio :label="'issue'">Issue</el-radio>
                <el-radio :label="'complaint'">Complaint</el-radio>
                <el-radio :label="'others'">Others</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="Description">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="Please input detailed issue descriptions."
              v-model="issue_form.description">
            </el-input>
        </el-form-item>
        <el-form-item label="Extra emails">
            <el-input placeholder="Please input more emails as needed seperated by ;" v-model="issue_form.extra_email"></el-input>
        </el-form-item>
        <el-form-item label="Department">
            <el-select  style="float: left; width: 100%;" multiple placeholder="Select" v-model="issue_form.department">
                <el-option
                    v-for="each_department in departments_option"
                    :label="each_department.label"
                    :value="each_department.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Involved Samples" v-if="showSelectedPatientTable" style="cursor: pointer;">
            <div>
                <el-table
                    :data="selectedPatientTable"
                    max-height="250"
                    @row-click="removeMe"
                    row-class-name="positive-row">
                    <el-table-column
                        prop="patient_fullname"
                        label="Full Name"
                        align="left">
                    </el-table-column>
                    <el-table-column
                        prop="patient_dos"
                        label="DoS"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="patient_bd"
                        label="DoB"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="patient_gender"
                        label="Gender"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="julien_barcode"
                        label="Julien Barcode"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="sample_id"
                        label="Sample ID"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="client_name"
                        label="Client Name"
                        align="center">
                    </el-table-column>
                </el-table>
                <hr>
            </div>
        </el-form-item>
        <div>
            <el-form-item label="Search Patients">
                <el-input
                    placeholder="Please input patient names."
                    v-model="search_for">
                </el-input>
            </el-form-item label="Possible Patients">
            <transition name="fade" mode="out-in">
            <div style="margin-left: 140px; cursor: pointer;" v-show="showPossiblePatientTable">
                <el-table
                    v-loading="isCalculating"
                    :data="possiblePatientTable"
                    @row-click="selectMe"
                    max-height="250">
                    <el-table-column
                        prop="patient_fullname"
                        label="Full Name"
                        align="left">
                    </el-table-column>
                    <el-table-column
                        prop="patient_dos"
                        label="DoS"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="patient_bd"
                        label="DoB"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="patient_gender"
                        label="Gender"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="julien_barcode"
                        label="Julien Barcode"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="sample_id"
                        label="Sample ID"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="client_name"
                        label="Client Name"
                        align="center">
                    </el-table-column>
                </el-table>
                <hr>
            </div>
            </transition>
        </div>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="!is_login">Create</el-button>
            <!-- <el-button @click="clearAllForm">Reset</el-button> -->
        </el-form-item>
    </el-form>
</template>

<script>
    import _ from 'lodash'
    import Vue from 'vue';
    import { mapGetters, mapActions} from 'vuex'
    Vue.component('client-id', {
        functional: true,
        render: function (h, ctx){
            var item = ctx.props.item;
            return h('li', ctx.data, [
                h('h4', { attrs: { class: 'name' } }, [item.client_practice_name]),
                h('h5', { attrs: { class: 'name' } }, [item.client_name]),
                h('div', { attrs: { class: 'addr' } }, [item.client_id])
            ]);
        },
        props: {
            item: { type: Object, required: true }
        }
    });
    export default {
        computed: {
            ...mapGetters({
                current_loggin_user: 'get_login_user',
                is_login: 'get_is_login'
            })
        },
        data () {
            return {
                showPossiblePatientTable: false,
                showSelectedPatientTable: false,
                searchForClient: '',
                possiblePatientTable: [],
                selectedPatientTable: [],
                search_for: '',
                searchQueryIsDirty: false,
                isCalculating: false,
                issue_form: {
                    issue_title: '',
                    issue_from: {
                        "client_id": '',
                        "client_practice_name": '',
                        "client_name": ''
                    },
                    issue_type: '',
                    department: '',
                    description: '',
                    action: '',
                    extra_email: ''
                },
                departments_option: []
            };
        },
        watch: {
            search_for: function(newVal, oldVal) {
                if (newVal == '') {
                    this.possiblePatientTable = [];
                    this.showPossiblePatientTable = false;
                } else {
                    this.searchQueryIsDirty = true;
                    this.isCalculating = true;
                    this.showPossiblePatientTable = true;
                    this.onSearchForPatient();
                }
            },
            selectedPatientTable: function(newVal, oldVal) {
                if (newVal.length == 0) {
                    this.showSelectedPatientTable = false;
                } else {
                    this.showSelectedPatientTable = true;
                }
            },
        },
        beforeMount: function() {
            let self = this;
            self.$http.get('/get-clients/').then(function(res){
                self.searchSuggestions = res.data;
            }, function(err){
                clearImmediate(immediate);
                console.log(err)
            });

            self.$http.get('/get-department-and-heads/').then((res) => {
                const res_obj = res.data;
                const departments = Object.keys(res_obj).sort();
                const index = departments.indexOf("Other");
                if (index > -1) {
                    departments.splice(index, 1);
                    departments.push("Other");
                }
                for (let each of departments) {
                    self.departments_option.push({
                        label: each,
                        value: each
                    });
                }
            });
        },
        methods: {
            ...mapActions({
                reload: 'reload'
            }),
            querySearchClient(queryString, cb) {
                var searchSuggestions = this.searchSuggestions;
                var results = queryString ? searchSuggestions.filter(this.createFilterClient(queryString)) : searchSuggestions;
                cb(results);
            },
            createFilterClient(queryString) {
                return (searchSuggestions) => {
                    let isName = (searchSuggestions.client_name.includes(queryString.toUpperCase()));
                    let isID = (searchSuggestions.client_id.includes(queryString.toUpperCase()));
                    let isPracticeName = (searchSuggestions.client_practice_name.includes(queryString.toUpperCase()));
                    return isName | isID | isPracticeName
                };
            },
            handleSelect(item) {
                // console.log("Select :", item);
            },
            handleSelectClient(item) {
                let self = this;
                self.issue_form.issue_from.client_id = item.client_id;
                self.issue_form.issue_from.client_practice_name = item.client_practice_name;
                self.issue_form.issue_from.client_name = item.client_name;
                self.searchForClient = `${item.client_name} (with practice name ${item.client_practice_name} and client-id ${item.client_id})`;
            },
            removeMe(row, event, column) {
                let inx = this.selectedPatientTable.findIndex(el => {
                    return el.julien_barcode == row.julien_barcode;
                });
                this.selectedPatientTable.splice(inx, 1);
            },
            selectMe(row, event, column) {
                if (this.selectedPatientTable.filter(el => {
                    return el.julien_barcode == row.julien_barcode
                }).length == 0) {
                    this.selectedPatientTable.push(row);
                } else {
                    this.$message({
                        showClose: true,
                        message: `Sample ${row.julien_barcode} has already been selected!`,
                        type: 'warning'
                    });
                }
                // console.log(this.selectedPatientTable);
            },
            onSearchForPatient:
              _.debounce(function() {
                this.getPatients()
              }, 500)
            ,
            getPatients() {
                let self = this;
                // this.isCalculating = true;
                let search_for = self.search_for.trim().toUpperCase();
                if (search_for == "") {
                    self.possiblePatientTable.length = 0;
                    return;
                }
                if (/^\d+$/.test(search_for)) {
                    if (search_for.length === 10) {
                        self.$http.post("/inquiry-patient/", {search_for}).then(res => {
                            return res.json();
                        }).then(res => {
                            if (res.length == 0) {
                                self.$message({
                                    showClose: true,
                                    message: `No record find for your input : ${this.search_for}`,
                                    type: 'error'
                                });
                                this.showPossiblePatientTable = false;
                                return;
                            }
                            self.possiblePatientTable = res;
                            this.isCalculating = false;
                        })
                        .catch(err => {
                            console.log("Error is ", err);
                        });
                    } else {
                        return;
                    }
                }
                self.$http.post("/inquiry-patient/", {search_for}).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.length == 0) {
                        self.$message({
                            showClose: true,
                            message: `No record find for your input : ${this.search_for}`,
                            type: 'error'
                        });
                        this.showPossiblePatientTable = false;
                        return;
                    }
                    self.possiblePatientTable = res;
                    this.isCalculating = false;
                })
                .catch(err => {
                    console.log("Error is ", err);
                })
            },
            clearAllForm() {
                let self = this;
                // console.log(self.departments_option)
                self.showPossiblePatientTable = false;
                self.showSelectedPatientTable = false;
                self.searchForClient = '';
                self.possiblePatientTable = [];
                self.selectedPatientTable = [];
                self.search_for = '';
                self.searchQueryIsDirty = false;
                self.isCalculating = false;
                self.issue_form = {
                    issue_title: '',
                    issue_from: {
                        "client_id": '',
                        "client_practice_name": '',
                        "client_name": ''
                    },
                    issue_type: '',
                    department: '',
                    description: '',
                    action: '',
                    extra_email: ''
                };
            },
            forceUpdate() {
                this.$forceUpdate();
            },
            onSubmit() {
                let self = this;
                let {issue_title, issue_from, issue_type, department, description, action, extra_email} = self.issue_form;
                if (issue_title.trim() == '') {
                    self.$message.error('Please input issue title.');
                    return;
                }
                if (issue_from.client_id == '') {
                    self.$message.error('Please denote where is this issue from.');
                    return;
                }
                if (issue_type == '') {
                    self.$message.error('Please select a issue type.');
                    return;
                }
                if (department == '') {
                    self.$message.error('Please select any department you want to notifify.');
                    return;
                }
                // console.log("issue_from.issue_type: ", issue_from.issue_type);
                let barcode_array = self.selectedPatientTable.map(el => {return el.julien_barcode});
                let create_by = self.current_loggin_user;
                self.$http.post('/open-new-issue/', {
                    issue_title,
                    issue_from,
                    issue_type,
                    department,
                    description,
                    barcode_array,
                    action,
                    extra_email,
                    create_by
                }).then(function(res) {
                    // console.log("In response: ", res);
                    if (res.body == "success") {
                        self.$message({
                          message: 'You opened a new issue.',
                          type: 'success'
                        });
                        self.$emit('createdNewIssue');
                        self.reload();
                        self.clearAllForm();
                    } else if (res.body == "fail") {
                        self.$message({
                          message: 'You are trying to submit too fast. Try again in 1 minute laster.',
                          type: 'error'
                        });
                    }
                }).catch(function(err) {
                    console.log("In error: ", err);
                })
            },
        }
    }
</script>
