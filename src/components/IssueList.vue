<style></style>

<template>
    <li class="list-group-item">
        <div class="well well-lg panel-heading">
            <div>
                <span :class="isClosed">&nbsp</span>
                <span class="label label-default">{{issue.issue_number}}</span>
                <a class="issue-title" @click="changeShowMe">&nbsp {{issue.title}}</a>
                <button type="button" class="btn btn-primary btn-xs badge-btn">Comments &nbsp<span class="badge">{{issue.comments.length}}</span></button>
            </div>
            <div style="margin-top: 2%;">
                <span style="font-size:120%; color: gray">This issue is created by {{issue.create_by}} 3 days ago; Last updated by Zhe 1 days ago.</span>
            </div>
        </div>
        <transition name="fade">
            <issue-detail v-if="showMe" :issue_detail="issue"></issue-detail>
        </transition>
    </li>
</template>

<script>
    import IssueDetail from './IssueDetail';
    export default {
        components: {IssueDetail},
        props: ['issue'],
        mounted() {
            this.links = this.loadAll();
            console.log("In List", this.issue);
        },
        computed: {
            // Arrow function cant use 'this' ???
            isClosed: function() {
                return this.issue.is_closed == '1' ? "glyphicon glyphicon-lock" : "glyphicon glyphicon-flag"
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
                console.log(item);
            }
        }
    }
</script>