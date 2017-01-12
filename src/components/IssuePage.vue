<style >
    .list-group-item {
        margin-top: 0%;
        margin-bottom: 0%;
    }
    .well-lg {
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
        font-size:110%;
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
        background: #f0f0f0;
        color: #8c8b8b;
        font-size: 18px;
        -webkit-transform: rotate(60deg);
        -moz-transform: rotate(60deg);
        transform: rotate(60deg);
    }
</style>

<template>
    <div class="container">
        <el-tabs style="width: 100%;">
            <el-tab-pane label="Existing Issues">
                <div v-if="issues.length > 0">
                    <div class="table-list-header row" style="margin-bottom: 0%; margin-top: 2%;">
                        <div class="col-md-3" style="text-align:left; font-size:130%;"><svg aria-hidden="true" class="octicon octicon-issue-opened" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>&nbsp {{num_of_unsolved_issues}} unsolved issues</div>
                        <div class="col-md-3" style="text-align:left; font-size:130%;"><svg aria-hidden="true" class="octicon octicon-check" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>&nbsp {{num_of_closed_issues}} closed issues</div>
                    </div>
                    <div class="border-right border-bottom border-left well" style="margin-bottom: 0%; margin-top: 1%; margin-left: 0px; border-left: 0px;">
                        <form style="margin-left: 0px;">
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
                        </form>
                    </div>
                    <issue-div :issues_prop="filtered_issues"></issue-div>
            </el-tab-pane>
            <el-tab-pane label="Open New Issue" align="center">
                <new-issue></new-issue>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import IssueDiv from './IssueDiv'
    import NewIssue from './NewIssue'
    import { mapGetters } from 'vuex'
    export default {
        components: {NewIssue, IssueDiv},
        computed: {
            ...mapGetters({
                current_loggin_user: 'get_login_user',
                is_login: 'get_is_login',
                issues: 'get_issues'
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
                    let isIncludingNumber = el.issue_number.includes(this.search_issue_number.trim().toUpperCase());
                    let isIncludingTitle = el.title.includes(this.search_issue_number.trim());
                    // console.log("isIncludingTitle: ", isIncludingTitle)
                    // let isIncludingTitle = false;
                    return (isIncludingNumber || isIncludingTitle);
                });
            }
        },
        data() {
            return {
                search_issue_number: '',
            }
        },
        beforeMount: function() {

        },
        methods: {
            // ...mapActions({
            //   sort_issues: 'sort_issues',
            // }),
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