<style>

</style>

<template>
    <li class="list-group-item">
        <div class="well well-lg panel-heading">
            <div>
                <span :class="isClosed">&nbsp</span>
                <span class="label label-default">{{issue.issue_number}}</span>
                <a class="issue-title" @click="changeShowMe">&nbsp {{issue.title}}</a>
                <button @click="changeShowMe" type="button" class="btn btn-primary btn-xs badge-btn">Comments &nbsp<span class="badge">{{issue.comments.length}}</span></button>
            </div>
            <div style="margin-top: 2%;">
                <span style="font-size:120%; color: gray">This issue is created by {{issue.create_by}} {{issue_create_related_time}}; {{issue_last_update_related_time_str}}</span>
            </div>
        </div>
        <transition name="fade">
            <issue-detail v-if="showMe" :issue_detail="issue" @closeMe="showMe=false"></issue-detail>
        </transition>
    </li>
</template>
<script>
    import IssueDetail from './IssueDetail';
    import moment from 'moment-timezone';


    export default {
        components: {IssueDetail},
        props: ['issue'],
        mounted() {
            this.links = this.loadAll();
            // console.log("In List", this.issue);
        },
        computed: {
            // Arrow function cant use 'this' ???
            isClosed: function() {
                return this.issue.is_closed == '1' ? "glyphicon glyphicon-lock" : "glyphicon glyphicon-flag"
            },
            issue_create_related_time: function() {
                // console.log(this.issue.create_time)
                return moment(this.issue.create_time).fromNow();
            },
            issue_last_update_related_time_str: function() {
                if (this.issue.comments.length > 0) {
                    let nearest_comment = this.issue.comments[0];
                    let commented_time = this.issue.comments[0].commented_time;
                    let commented_time_str = moment(commented_time).fromNow();
                    let commented_by = this.issue.comments[0].commented_by;
                    let return_str = `Last update is from ${commented_by} ${commented_time_str}.`;
                    return return_str;
                } else {
                    return "No comments have been added on this issue yet.";
                }
            }
        },
        data() {
            return {
                showMe: false
            }
        },
        methods: {
            changeShowMe() {
                this.showMe = !this.showMe;
            },
            querySearch(queryString, cb) {
                var links = this.links;
                var results = queryString ? links.filter(this.createFilter(queryString)) : links;
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
