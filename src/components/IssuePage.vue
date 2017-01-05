<style>
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

<!-- issue number
data opened


issue creater (input)
issue type: issue, complaint (select box)
department (select box)
issue title (input)
issue description (textarea)
issue involved julien barcodes (input) -->

<template>
    <div class="container">
        <el-tabs style="width: 100%;">
            <el-tab-pane label="Existing Issues">
                <div class="table-list-header row" style="margin-bottom: 0%; margin-top: 2%;">
                    <div class="col-md-3" style="text-align:left; font-size:130%;"><svg aria-hidden="true" class="octicon octicon-issue-opened" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>&nbsp 3 unsolved issues</div>
                    <div class="col-md-3" style="text-align:left; font-size:130%;"><svg aria-hidden="true" class="octicon octicon-check" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>&nbsp 1 solved issues</div>
                </div>
                <div class="border-right border-bottom border-left well" style="margin-bottom: 0%; margin-top: 1%; margin-left: 0px; border-left: 0px;">
                    <form style="margin-left: 0px;">
                        <div>
                        <el-dropdown style="float: right;">
                            <el-button id="order_btn">
                                Order By<i class="el-icon-caret-bottom el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>Number</el-dropdown-item>
                                <el-dropdown-item>Open-date</el-dropdown-item>
                                <el-dropdown-item>Close-date</el-dropdown-item>
                                <el-dropdown-item>Created-By</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                            <input placeholder="Search..." type="text" class="form-control input-lg" style="width: 30%;">
                        </div>
                    </form>
                </div>
                <div class="border-right border-bottom border-left">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <div class="well well-lg panel-heading">
                                <div>
                                    <span class="glyphicon glyphicon-flag">&nbsp</span>
                                    <span class="label label-default">000001</span>
                                    <a class="issue-title" @click="changeShowMe">&nbsp This is the first issue!</a>
                                    <button type="button" class="btn btn-primary btn-xs badge-btn">Comments &nbsp<span class="badge">7</span></button>
                                </div>
                                <div style="margin-top: 2%;">
                                    <span style="font-size:120%; color: gray">This issue is created by Zhe 3 days ago; Last updated by Zhe 1 days ago.</span>
                                </div>
                            </div>
                            <transition name="fade">
                                <issue-detail v-if="showMe" issue_number="123"></issue-detail>
                            </transition>
                        </li>
                        <li class="list-group-item">
                            <div class="well well-lg">
                                <div>
                                    <span class="glyphicon glyphicon-flag">&nbsp</span>
                                    <span class="label label-default">000002</span>
                                    <a class="issue-title">&nbsp This is the second open issue</a>
                                    <button type="button" class="btn btn-primary btn-xs btn-xs badge-btn">Comments &nbsp<span class="badge">1</span></button>
                                </div>
                                <div style="margin-top: 2%;">
                                    <span style="font-size:120%; color: gray">This issue is created by Zhe 2 days ago; Last updated by Zhe 0 days ago.</span>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="well well-lg">
                                <div>
                                    <span class="glyphicon glyphicon-lock">&nbsp</span>
                                    <span class="label label-default">000003</span>
                                    <a class="issue-title">&nbsp This is a finished issue</a>
                                    <!-- <button type="button" class="btn btn-primary btn-xs" style="float: right;">Comments &nbsp<span class="badge">1</span></button> -->
                                </div>
                                <div style="margin-top: 2%;">
                                    <span style="font-size:120%; color: gray">This issue is created by Zhe 2 days ago; Last updated by Zhe 0 days ago.</span>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="well well-lg">
                                <div>
                                    <span class="glyphicon glyphicon-flag">&nbsp</span>
                                    <span class="label label-default">000004</span>
                                    <a class="issue-title">&nbsp This is the fourth issue!</a>
                                    <button type="button" class="btn btn-primary btn-xs badge-btn">Comments &nbsp<span class="badge">7</span></button>
                                </div>
                                <div style="margin-top: 2%;">
                                    <span style="font-size:120%; color: gray">This issue is created by Zhe 3 days ago; Last updated by Zhe 1 days ago.</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <h1>{{ msg }}</h1>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Open New Issue" align="center">
                <new-issue></new-issue>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import IssueDetail from './IssueDetail'
    import NewIssue from './NewIssue'
    import { mapGetters } from 'vuex'
    export default {
        name: "issue-tag",
        components: {IssueDetail, NewIssue},
        created() {
            // console.log(this.current_loggin_user);
            // console.log(this.$store.getters.test)
            console.log("created");
        },
        mounted() {
          this.links = this.loadAll();
        },
        computed: {
            ...mapGetters({
                'current_loggin_user': 'get_login_user'
            })
        },
        data() {
            return {
                msg: "Hello from issue page",
                showMe: false,
            }
        },
        methods: {
            changeShowMe() {
                this.showMe = !this.showMe;
            },
            closeExpandedDiv(event) {
                console.log("you pressed me!");
                this.showMe = !this.showMe;
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
                console.log(item);
            }
        }
    }
</script>