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
                :trigger-on-focus="false"
                :autofocus="true"
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
        <el-form-item label="Actions">
            <el-input type="textarea" placeholder="Please input any required actions." v-model="issue_form.action"></el-input>
        </el-form-item>
        <el-form-item label="Department">
            <el-select multiple placeholder="Select" v-model="issue_form.department">
                <el-option
                    v-for="each_department in departments"
                    :label="each_department.label"
                    :value="each_department.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Notifify To">
            <el-select multiple placeholder="Select" v-model="issue_form.notify_to">
                <el-option
                    v-for="each_people in people"
                    :label="each_people.label"
                    :value="each_people.value">
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
                        label="Patient Full-name"
                        align="left">
                    </el-table-column>
                    <el-table-column
                        prop="patient_dos"
                        label="Patient Date Of Service"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="patient_bd"
                        label="Patient Date of Birth"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="julien_barcode"
                        label="Julien Barcode"
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
            <div style="margin-left: 140px; cursor: pointer;" v-if="showPossiblePatientTable">
                <el-table
                    v-loading="isCalculating"
                    :data="possiblePatientTable"
                    @row-click="selectMe"
                    max-height="250">
                    <el-table-column
                        prop="patient_fullname"
                        label="Patient Full-name"
                        align="left">
                    </el-table-column>
                    <el-table-column
                        prop="patient_dos"
                        label="Patient Date Of Service"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="patient_bd"
                        label="Patient Date of Birth"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="julien_barcode"
                        label="Julien Barcode"
                        align="center">
                    </el-table-column>
                </el-table>
                <hr>
            </div>
            </transition>
        </div>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :disable="is_login">Create</el-button>
            <el-button>Reset</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import _ from 'lodash'
    import Vue from 'vue';
    import { mapGetters } from 'vuex'
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
                    notify_to: ''
                },
                people: [
                    {
                        label: "Zhe Wang",
                        value: "zhe"
                    },
                    {
                        label: "Tianhao Wang",
                        value: "wang"
                    },
                    {
                        label: "Ethan Liu",
                        value: "ethan"
                    }
                ],
                departments: [
                    {
                        label: "Lab",
                        value: "Lab"
                    },
                    {
                        label: "Accessioning",
                        value: "Accessioning"
                    },
                    {
                        label: "Billing",
                        value: "Billing"
                    },
                    {
                        label: "IT",
                        value: "IT"
                    },
                ]
            }
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
            // possiblePatientTable: function(newVal, oldVal) {
            //     if (newVal.length == 0) {
            //         this.showPossiblePatientTable = false;
            //     } else {
            //         this.showPossiblePatientTable = true;
            //     }
            // },
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
            self.$http.get('/who/').then(function(res){
                self.current_loggin_user = res.data;
                console.log("current_loggin_user", self.current_loggin_user)
            }, function(err){
                console.log(err)
            });
            // console.log("current_loggin_user: ", this.current_loggin_user);
            self.$http.get('/get-clients/').then(function(res){
            // console.log("res.data: ", res.data);
            self.searchSuggestions = JSON.parse(res.data);
            }, function(err){
            // console.log("fail!");
            console.log(err)
            });
        },
        methods: {
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
            console.log("Select :", item);
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
                console.log("selectMe");
                console.log("row", row);
                console.log("event", event);
                console.log("column", column);
                console.log(row.julien_barcode)
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
                console.log(this.selectedPatientTable);
            },
            onSearchForPatient: _.debounce(function () {
                this.isCalculating = true;
                (function () {
                    // this.isCalculating = false
                    this.searchQueryIsDirty = false;
                    console.log("haha");
                    this.getPatients();
                }.bind(this))();
            }, 500),
            getPatients() {
                let self = this;
                this.isCalculating = true;
                let search_for = self.search_for.trim().toUpperCase();
                if (search_for == "") {
                    self.possiblePatientTable.length = 0;
                    return;
                }
                self.$http.post("/inquiry-patient/", {search_for}).then(res => {
                    return res.json();
                }).then(res => {
                    console.log("Now res is: ", res);
                    console.log("LENGTH is: ", res.length);
                    console.log(res[0]);
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
                }).then(function() {
                    setTimeout(function(){
                        // self.possiblePatientTable = [];
                    }, 30000)
                })
                .catch(err => {
                    console.log("Error is ", err);
                })
                console.log("in get patients");
            },
            onSubmit() {
                let {issue_title, issue_from, issue_type, department, description, action, notify_to} = this.issue_form;
                let barcode_array = this.selectedPatientTable.map(el => {return el.julien_barcode});
                let create_by = this.current_loggin_user;
                this.$http.post('/open-new-issue/', {
                    issue_title,
                    issue_from,
                    issue_type,
                    department,
                    description,
                    barcode_array,
                    action,
                    notify_to,
                    create_by
                }).then(function(res) {
                    console.log("In response: ", res);
                }).catch(function(err) {
                    console.log("In error: ", err);
                })
            },
        }
    }
</script>
