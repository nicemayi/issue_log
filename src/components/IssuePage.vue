<style >
    .list-group-item {
        margin-top: 0%;
        margin-bottom: 0%;
        padding: 3px 5px;
    }
    .panel {
        margin-bottom:  0%;
    }
    .issue-detail {
        text-align:left;
        margin-top: 0%;
        margin-bottom: 0%;
    }
    a {
        cursor: pointer;
    }
    .issue-title {
        font-size:130%;
    }
    .label, label-default {
        font-size:85%;
    }
    .badge-btn {
        float: right;
    }
    #order_btn{
        border-style:none;
        font-size:120%;
    }
    #issue_type {
        margin-top: 1%;
    }
    .fade-enter-active{
        transition: opacity 1s
    }
    .fade-enter {
        opacity: 0
    }
    hr.seperate_relations {
        border-top: 1px solid #8c8b8b;
        text-align: center;
    }
    hr.seperate_relations:after {
        content: '§';
        display: inline-block;
        position: relative;
        top: -14px;
        padding: 0 10px;
        /* background: #f0f0f0;*/
        color: #8c8b8b;
        font-size: 18px;
        -webkit-transform: rotate(60deg);
        -moz-transform: rotate(60deg);
        transform: rotate(60deg);
    }
</style>

<template>
    <div class="container">
        <el-tabs style="width: 100%;" v-model="activateName">
            <el-tab-pane name="existingIssueTab" label="Existing Issues">
                <div v-if="issues.length > 0">
                    <div class="table-list-header row" style="margin-bottom: 0%; margin-top: 2%;">
                        <div class="col-md-3" style="text-align:left; font-size:130%;">{{num_of_unsolved_issues}} <el-radio class="radio" v-model="radio" label="1"><svg aria-hidden="true" class="octicon octicon-issue-opened" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg> unsolved issues</el-radio></div>
                        <div class="col-md-3" style="text-align:left; font-size:130%;"> {{num_of_closed_issues}} <el-radio class="radio" v-model="radio" label="2"><svg aria-hidden="true" class="octicon octicon-check" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg> closed issues</el-radio></div>
                        <el-button
                            style="float: right; margin-right: 2rem"
                            type="primary"
                            @click.prevent.default="reload_from_daterange">
                            Search Date
                        </el-button>
                        <el-date-picker
                            style="float: right; margin-right: 0.5rem"
                            v-model="dateRange"
                            type="daterange" 
                            align="right"
                            placeholder="Pick a range"
                            :picker-options="datePickerOption">
                        </el-date-picker>
                    </div>
                    <div class="border-right border-bottom border-left well" style="margin-bottom: 0%; margin-top: 1%; margin-left: 0px; border-left: 0px;">
                        <!-- <form style="margin-left: 0px;"> -->
                            <div>
                            <el-dropdown style="float: right;" @command="handleCommand">
                                <el-button id="order_btn">
                                    Order By<i class="el-icon-caret-bottom el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="issue number">Issue Number</el-dropdown-item>
                                    <el-dropdown-item command="issue open date">Open-date</el-dropdown-item>
                                    <el-dropdown-item command="issue opened by">Open-By</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                                <input v-model="search_issue_number" placeholder="Search for issue number or title..." type="text" class="form-control input-lg" style="width: 50%;">
                            </div>
                        <!-- </form> -->
                    </div>
                    <issue-div :issues_prop="filtered_issues"></issue-div>
                    </div>
            </el-tab-pane>
            <el-tab-pane name="newIssueTab" label="Open New Issue" align="center" :disabled="disable_new_issue_tab">
                <new-issue @createdNewIssue="handleCreatedNewIssue"></new-issue>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import IssueDiv from './IssueDiv';
    import NewIssue from './NewIssue';
    import { mapGetters, mapActions} from 'vuex';
    import moment from 'moment';

    export default {
        components: {NewIssue, IssueDiv},
        computed: {
            ...mapGetters({
                current_loggin_user: 'get_login_user',
                is_login: 'get_is_login',
                issues: 'get_issues',
                disable_new_issue_tab: 'get_disable_new_issue'
            }),
            num_of_closed_issues: function() {
                return this.issues.filter(el => {
                    return el.is_closed == 1;
                }).length;
            },
            num_of_unsolved_issues: function() {
                return this.issues.filter(el => {
                    return el.is_closed == 0;
                }).length;
            },
            filtered_issues: function() {
                return this.issues.filter(el => {
                    if (this.radio === "1") {
                        if (el.is_closed == 1) {
                            return
                        }
                    } else {
                        if (el.is_closed == 0) {
                            return
                        }
                    }
                    let isIncludingNumber = el.issue_number.includes(this.search_issue_number.trim().toUpperCase());
                    let isIncludingTitle = el.title.toLowerCase().includes(this.search_issue_number.trim().toLowerCase());
                    let isIncludingDescription = el.description.toLowerCase().includes(this.search_issue_number.trim().toLowerCase());
                    // console.log("isIncludingTitle: ", isIncludingTitle)
                    // let isIncludingTitle = false;
                    return (isIncludingNumber || isIncludingTitle || isIncludingDescription);
                });
            }
        },
        data() {
            return {
                search_issue_number: '',
                radio: '1',
                activateName: 'existingIssueTab',
                dateRange: [],
                datePickerOption: {
                    shortcuts: [{
                    text: 'Last week',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        const _end = moment(end).add(1, 'd').format("YYYY-MM-DD");
                        const _start = moment(start).format("YYYY-MM-DD");;
                        picker.$emit('pick', [_start, _end]);
                    }
                    }, {
                    text: 'Last month',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                    }, {
                    text: 'Last 3 months',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                    }]
                }
            }
        },
        beforeMount: function() {
            // this.authUser();
        },
        methods: {
            ...mapActions({
              authUser: 'authUser',
              changeIssueDateRange: 'changeIssueDateRange'
            }),
            reload_from_daterange() {
                if (!!this.dateRange[0]) {
                    const [_start, _end] = this.dateRange;
                    const __start = moment(_start);
                    const __end = moment(_end).add(1, 'd');
                    const start = __start.format("YYYY-MM-DD");
                    const end = __end.format("YYYY-MM-DD");
                    this.changeIssueDateRange({ start, end });
                } else {
                    const _end = moment().add(1, 'd');
                    const _start = moment(_end.diff(3600*1000*24*31)); 
                    const start = _start.format("YYYY-MM-DD");
                    const end = _end.format("YYYY-MM-DD");
                    this.changeIssueDateRange({ start, end });
                }
            },
            handleCreatedNewIssue() {
                this.activateName = 'existingIssueTab';
            },
            handleCommand(command) {
                if (command == "issue number") {
                    this.issues.sort(this.compare_by_number);
                } else if (command == "issue open date") {
                    this.issues.sort(this.compare_by_open_date);
                } else if (command == "issue opened by") {
                    this.issues.sort(this.compare_by_opener);
                }
            },
            // sort helper
            compare_by_number(a,b) {
                if (a.issue_number < b.issue_number)
                    return -1;
                if (a.issue_number > b.issue_number)
                    return 1;
                return 0;
            },
            compare_by_open_date(a,b) {
                if (a.create_time < b.create_time)
                    return 1;
                if (a.create_time > b.create_time)
                    return -1;
                return 0;
            },
            compare_by_opener(a,b) {
                if (a.create_by < b.create_by)
                    return -1;
                if (a.create_by > b.create_by)
                    return 1;
                return 0;
            }
        }
    }
</script>